import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const origin = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const output = new URL("../output/playwright/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
const page = await context.newPage();
const errors = [];
const results = [];
page.on("pageerror", (error) => errors.push(error.message));
const open = (path) => page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
const screenshot = (name) =>
  page.screenshot({ path: fileURLToPath(new URL(name + ".png", output)), fullPage: true });
async function noOverflow(target, label) {
  const sizes = await target.evaluate(() => ({
    window: innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  assert.ok(
    sizes.document <= sizes.window + 1,
    `${label}: horizontal overflow ${JSON.stringify(sizes)}`,
  );
}
async function accessibility(label) {
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const violations = report.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
  }));
  results.push({ label, accessibilityViolations: violations });
}

try {
  await open("/");
  assert.match(await page.title(), /Escalón Cero/);
  await page.getByRole("heading", { name: "Tu experiencia empieza haciendo." }).waitFor();
  await page
    .getByRole("button", { name: "Marketing digital, próximamente", exact: true })
    .waitFor();
  assert.equal(
    await page.getByRole("link", { name: "Ver actividad", exact: true }).count(),
    0,
    "home does not recommend an activity before area selection",
  );
  assert.equal(await page.locator('.archive-folder[data-available="false"]').count(), 4);
  await noOverflow(page, "desktop home");
  await screenshot("home-desktop");
  await accessibility("home");
  const archive = page.locator(".practice-archive");
  const software = page.getByRole("button", { name: "Ingeniería de software", exact: true });
  const dataFolder = page.getByRole("button", {
    name: "Datos y analítica, próximamente",
    exact: true,
  });
  await dataFolder.focus();
  await page.keyboard.press("Enter");
  assert.equal(await dataFolder.getAttribute("aria-expanded"), "true");
  assert.equal(await software.getAttribute("aria-expanded"), "false");
  assert.equal(
    await page.locator("#folder-panel-datos a").count(),
    0,
    "upcoming areas cannot start a practice",
  );
  await page.locator("#folder-panel-datos").getByText("Próximamente", { exact: true }).waitFor();
  await software.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("link", { name: "Explorar Ingeniería de software" }).waitFor();
  await page.getByRole("button", { name: "Reducir movimiento" }).click();
  assert.equal(await archive.getAttribute("data-motion"), "off");
  await dataFolder.click();
  assert.equal(await archive.evaluate((el) => el.getAnimations({ subtree: true }).length), 0);
  await software.click();
  await page.getByRole("button", { name: "Activar movimiento" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await dataFolder.click();
  assert.equal(await archive.evaluate((el) => el.getAnimations({ subtree: true }).length), 0);
  await software.click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await noOverflow(page, `home ${width}`);
    assert.equal(await archive.isVisible(), true);
  }
  await screenshot("home-mobile");
  await page.setViewportSize({ width: 1440, height: 1080 });
  const globalInput = page.getByRole("searchbox", { name: "Buscar áreas, roles o actividades" });
  await globalInput.fill("QA");
  const suggestions = page.getByRole("region", { name: "Sugerencias de búsqueda" });
  for (const kind of ["Áreas", "Roles", "Actividades"]) {
    await suggestions.getByRole("heading", { name: kind, exact: true }).waitFor();
  }
  await screenshot("global-suggestions-desktop");
  await accessibility("global suggestions");
  await globalInput.press("ArrowDown");
  assert.equal(await page.evaluate(() => document.activeElement?.tagName), "A");
  await page.keyboard.press("Escape");
  assert.equal(await suggestions.count(), 0);
  assert.equal(await globalInput.evaluate((el) => document.activeElement === el), true);
  await globalInput.fill("Marketing");
  await suggestions.getByText("Próximamente", { exact: true }).waitFor();
  assert.equal(await suggestions.getByRole("link", { name: "Marketing digital" }).count(), 0);
  await globalInput.fill("sin-coincidencias");
  await suggestions.getByText("Sin coincidencias. Prueba con otra palabra.").waitFor();
  await globalInput.fill("QA");
  await page.getByRole("button", { name: "Reducir movimiento" }).click();
  await globalInput.fill("software");
  assert.equal(await suggestions.evaluate((el) => el.getAnimations({ subtree: true }).length), 0);
  await page.getByRole("button", { name: "Activar movimiento" }).click();
  await globalInput.fill("QA");
  await globalInput.press("Enter");
  await page.waitForURL("**/buscar/?q=QA");
  await page.getByRole("heading", { name: "Tu próxima práctica." }).waitFor();
  const resultInput = page.getByRole("searchbox", { name: "Buscar en todo el catálogo" });
  await page.getByRole("link", { name: "Ver actividad", exact: true }).waitFor();
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await page.locator(".catalog-filter-reset:disabled").waitFor();
  await screenshot("global-search-desktop");
  await accessibility("global search");
  await resultInput.fill("FUNCIONALES");
  await page.getByRole("combobox", { name: "Área", exact: true }).selectOption("software");
  await page.getByRole("combobox", { name: "Rol", exact: true }).selectOption("qa");
  await page
    .getByRole("combobox", { name: "Tema", exact: true })
    .selectOption("Pruebas funcionales");
  await page.getByRole("combobox", { name: "Nivel", exact: true }).selectOption("Inicial");
  await page.getByRole("combobox", { name: "Duración", exact: true }).selectOption("medium");
  await page.getByRole("link", { name: "Ver actividad", exact: true }).waitFor();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.getByRole("combobox", { name: "Rol", exact: true }).inputValue(), "qa");
  assert.equal(await resultInput.inputValue(), "FUNCIONALES");
  await page.getByRole("link", { name: "Ver actividad", exact: true }).click();
  await page.waitForURL("**/actividad/qa-tienda/");
  await page.goBack({ waitUntil: "networkidle" });
  assert.equal(
    await page.getByRole("combobox", { name: "Duración", exact: true }).inputValue(),
    "medium",
  );
  await page.getByRole("combobox", { name: "Duración", exact: true }).selectOption("short");
  await page.getByRole("heading", { name: "Sin actividades con estos filtros" }).waitFor();
  await accessibility("global empty state");
  await page.getByRole("button", { name: "Quitar filtro: Menos de 1 hora", exact: true }).click();
  await page.getByRole("link", { name: "Ver actividad", exact: true }).waitFor();
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await page.locator(".catalog-filter-reset:disabled").waitFor();
  for (const label of ["Área", "Rol", "Tema", "Nivel", "Duración"]) {
    assert.equal(await page.getByRole("combobox", { name: label, exact: true }).inputValue(), "");
  }
  await page.getByRole("combobox", { name: "Rol", exact: true }).selectOption("qa");
  await page.getByRole("combobox", { name: "Área", exact: true }).selectOption("marketing");
  await page.getByRole("heading", { name: "Sin actividades con estos filtros" }).waitFor();
  assert.equal(await page.getByRole("combobox", { name: "Rol", exact: true }).inputValue(), "");
  assert.equal(await page.getByRole("combobox", { name: "Rol", exact: true }).isDisabled(), true);
  await page.getByRole("heading", { name: "Próximamente", exact: true }).waitFor();
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await page.locator(".catalog-filter-reset:disabled").waitFor();
  await page.getByRole("button", { name: "Reducir movimiento" }).click();
  await page.getByRole("combobox", { name: "Duración", exact: true }).selectOption("short");
  assert.equal(
    await page
      .locator(".search-workspace")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
    0,
  );
  await page.getByRole("button", { name: "Activar movimiento" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await page.locator(".catalog-filter-reset:disabled").waitFor();
  assert.equal(
    await page
      .locator(".search-workspace")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
    0,
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 320, height: 844 });
  await noOverflow(page, "global search 320");
  await screenshot("global-search-mobile");
  await page.getByRole("button", { name: "Filtros", exact: true }).click();
  await page.getByRole("combobox", { name: "Tema", exact: true }).selectOption("Casos de prueba");
  await noOverflow(page, "global filters open 320");
  await screenshot("global-filters-mobile");
  await accessibility("global mobile filters");
  await page.getByRole("button", { name: "Filtros (1)", exact: true }).click();
  await page.getByRole("button", { name: "Quitar filtro: Casos de prueba" }).click();
  await open("/");
  await globalInput.fill("QA");
  await noOverflow(page, "home suggestions 320");
  await screenshot("global-suggestions-mobile");
  await suggestions.getByRole("link", { name: "QA / Testing", exact: true }).click();
  await page.waitForURL("**/explorar/qa/");
  await open("/");
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.getByRole("link", { name: /Ingeniería de software/ }).click();
  await page.getByRole("heading", { name: "Ingeniería de software", exact: true }).waitFor();
  assert.equal(
    await page.getByRole("link", { name: "Ver actividad", exact: true }).count(),
    0,
    "area contains roles, not activities",
  );
  await accessibility("software roles");
  await screenshot("software-roles");
  await page.getByRole("link", { name: "Ver actividades de QA" }).click();
  await page.waitForURL("**/explorar/qa/");
  await page.getByRole("heading", { name: "QA / Testing", exact: true }).waitFor();
  assert.equal(await page.getByRole("link", { name: "Ver actividad", exact: true }).count(), 1);
  await page.getByRole("heading", { name: "Más actividades de QA", exact: true }).waitFor();
  await accessibility("QA catalog");
  await screenshot("qa-catalog");
  await page.getByRole("searchbox", { name: "Buscar actividades" }).fill("sin-coincidencias");
  await page.getByRole("heading", { name: "Sin actividades con esta búsqueda" }).waitFor();
  await page.getByRole("button", { name: "Limpiar búsqueda" }).click();
  await page.getByRole("link", { name: "Abrir catálogo con filtros" }).click();
  await page.waitForURL("**/buscar/?role=qa");
  assert.equal(await page.getByRole("combobox", { name: "Rol", exact: true }).inputValue(), "qa");
  await page.getByRole("button", { name: "Quitar filtro: QA / Testing" }).click();
  await page
    .getByRole("button", { name: "Quitar filtro: QA / Testing" })
    .waitFor({ state: "hidden" });
  assert.equal(await page.getByRole("combobox", { name: "Rol", exact: true }).inputValue(), "");
  await open("/explorar/qa/");

  await page.getByRole("link", { name: "Ver actividad", exact: true }).click();
  await page.getByRole("button", { name: "Empezar mi práctica" }).click();
  await page.getByRole("heading", { name: /Una compra sin sorpresas/ }).waitFor();
  await page.getByRole("button", { name: /Casos de prueba/ }).click();
  const cases = [
    {
      title: "Compra de una unidad sin cupón",
      requirement: "REQ-01",
      steps: "1. Reiniciar la tienda. 2. Mantener una unidad y comprobar el total.",
      expected: "Subtotal de 80 y envío de 12, total de 92 soles.",
      actual: "El total mostrado es de 92 soles.",
      result: "correcto",
    },
    {
      title: "Envío gratuito en el umbral de 160 soles",
      requirement: "REQ-02",
      steps: "1. Reiniciar la tienda. 2. Seleccionar dos unidades. 3. Revisar el envío.",
      expected: "El envío debería ser gratuito al alcanzar 160 soles.",
      actual: "La tienda añade 12 soles al subtotal de 160.",
      result: "fallo",
    },
    {
      title: "Aplicar el mismo cupón dos veces",
      requirement: "REQ-03",
      steps: "1. Reiniciar la tienda. 2. Escribir BIENVENIDA10. 3. Pulsar Aplicar dos veces.",
      expected: "El descuento se mantiene en 8 soles para una unidad.",
      actual: "El descuento se acumula hasta 16 soles.",
      result: "fallo",
    },
  ];
  for (const item of cases) {
    const form = page.locator(".editor-form").last();
    await form.getByLabel("Nombre del caso").fill(item.title);
    await form.getByLabel("Requisito", { exact: true }).selectOption(item.requirement);
    await form.getByLabel("Pasos para probar").fill(item.steps);
    await form.getByLabel("Resultado esperado").fill(item.expected);
    await form.getByLabel("Resultado observado").fill(item.actual);
    await form.getByLabel("Estado", { exact: true }).selectOption(item.result);
    await form.getByRole("button", { name: "Guardar caso", exact: true }).click();
  }
  assert.equal(await page.locator(".entry-card").count(), 3);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Casos de prueba/ }).click();
  assert.equal(await page.locator(".entry-card").count(), 3, "draft survives reload");
  await screenshot("practice-cases");
  await page.getByRole("button", { name: /Reportes de errores/ }).click();
  for (const item of cases.slice(1)) {
    const form = page.locator(".editor-form").last();
    await form.getByLabel("Título del error").fill(item.title);
    await form.getByLabel("Requisito afectado").selectOption(item.requirement);
    await form.getByLabel("Severidad").selectOption("Media");
    await form.getByLabel("Pasos para reproducir").fill(item.steps);
    await form.getByLabel("Resultado esperado").fill(item.expected);
    await form.getByLabel("Resultado actual").fill(item.actual);
    await form.getByRole("button", { name: "Guardar reporte", exact: true }).click();
  }
  assert.equal(await page.locator(".entry-card").count(), 2);
  const shop = await context.newPage();
  shop.on("pageerror", (error) => errors.push(error.message));
  await shop.goto(`${origin}/simulador/`, { waitUntil: "networkidle" });
  await shop.getByLabel("Cantidad", { exact: true }).selectOption("2");
  assert.match(await shop.locator(".order-lines").innerText(), /12\.00/);
  await shop.getByLabel("¿Tienes un cupón?").fill("BIENVENIDA10");
  await shop.getByRole("button", { name: "Aplicar", exact: true }).click();
  await shop.getByRole("button", { name: "Aplicar", exact: true }).click();
  assert.match(await shop.locator(".discount-line strong").innerText(), /32\.00/);
  await shop.getByLabel("Correo del comprador").fill("prueba@");
  await shop.getByRole("button", { name: "Confirmar pedido de prueba" }).click();
  await shop.getByRole("heading", { name: "¡Gracias por tu compra!" }).waitFor();
  await shop.getByRole("button", { name: "Probar otro escenario" }).click();
  assert.equal(await shop.getByLabel("Cantidad", { exact: true }).inputValue(), "1");
  await shop.close();
  await page.getByRole("button", { name: /Mi entrega/ }).click();
  await page
    .getByLabel("¿Qué probaste y qué aprendiste?")
    .fill(
      "Elegí probar los límites de envío y las acciones repetidas porque suelen descubrir fallos distintos al caso habitual. Priorizaría corregir el cobro y escribir pruebas de regresión antes de lanzar la tienda.",
    );
  await page.getByRole("button", { name: "Guardar reflexión", exact: true }).click();
  await page.locator("input[type=file]").setInputFiles({
    name: "captura-practica.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l8sAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.getByRole("button", { name: "Descargar captura-practica.png", exact: true }).waitFor();
  await page.locator("input[type=file]").setInputFiles({
    name: "script.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg></svg>"),
  });
  await page.getByText("Usa PNG, JPG, WebP o PDF de hasta 2 MB.").waitFor();
  assert.equal(await page.locator(".evidence-list li").count(), 1);
  await page.getByRole("button", { name: "Registrar mi entrega", exact: true }).click();
  await page.getByText("¡Tu primer proyecto ya tiene una entrega!").waitFor();
  await screenshot("practice-delivery");
  await accessibility("delivery");
  await page.getByRole("link", { name: "Crear mi portafolio" }).click();
  await page.getByLabel("Tu nombre o alias").fill("Participante demo");
  await page
    .getByLabel("Una breve presentación")
    .fill("Mi primera experiencia practicando pruebas funcionales de software.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Crear enlace de mi proyecto", exact: true }).click();
  await page.getByLabel("Enlace para compartir", { exact: true }).waitFor();
  const shareUrl = await page.getByLabel("Enlace para compartir", { exact: true }).inputValue();
  assert.ok(shareUrl.includes("/compartir/#"));
  const strangerContext = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const stranger = await strangerContext.newPage();
  stranger.on("pageerror", (error) => errors.push(error.message));
  await stranger.goto(shareUrl, { waitUntil: "networkidle" });
  await stranger.getByRole("heading", { name: "Participante demo", exact: true }).waitFor();
  assert.equal(await stranger.locator(".portfolio-cases details").count(), 3);
  assert.equal(await stranger.locator(".portfolio-report").count(), 2);
  assert.equal(
    await stranger.evaluate(() => localStorage.getItem("escalon-cero:practice:v1")),
    null,
  );
  assert.equal(
    (await stranger.locator("body").innerText()).includes("captura-practica.png"),
    false,
  );
  await stranger.screenshot({
    path: fileURLToPath(new URL("portfolio-shared.png", output)),
    fullPage: true,
  });
  await stranger.emulateMedia({ media: "print" });
  assert.equal(
    await stranger.locator(".archive-spine").isVisible(),
    false,
    "printed portfolio hides the archive rail",
  );
  assert.equal(
    await stranger.locator(".site-frame").evaluate((el) => getComputedStyle(el).marginLeft),
    "0px",
  );
  await strangerContext.close();
  const themedRoutes = [
    "/",
    "/explorar/",
    "/explorar/qa/",
    "/buscar/",
    "/actividad/qa-tienda/",
    "/practica/",
    "/simulador/",
    "/portafolio/",
    "/compartir/",
    "/acerca/",
  ];
  for (const width of [1440, 768, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of themedRoutes) {
      await open(path);
      await noOverflow(page, `shared theme ${width} ${path}`);
      assert.equal(await page.locator(".archive-spine").count(), 1);
      assert.equal(await page.locator(".archive-spine").isVisible(), true);
      const theme = await page.evaluate(() => ({
        headingFont: getComputedStyle(document.querySelector("h1")).fontFamily,
        bodyFont: getComputedStyle(document.body).fontFamily,
        headerRadius: getComputedStyle(document.querySelector(".site-header")).borderRadius,
        frameLeft: document.querySelector(".site-frame").getBoundingClientRect().left,
        contentLeft: document.querySelector("main > div").getBoundingClientRect().left,
      }));
      assert.equal(
        theme.headingFont.split(",")[0],
        theme.bodyFont.split(",")[0],
        `consistent heading font on ${path}`,
      );
      assert.equal(theme.headerRadius, "0px", `consistent navigation on ${path}`);
      assert.ok(Math.abs(theme.frameLeft - theme.contentLeft) <= 1, `aligned content on ${path}`);
      const slug = path === "/" ? "home" : path.replaceAll("/", "-").replace(/^-|-$/g, "");
      await page.screenshot({
        path: fileURLToPath(new URL(`theme-${width}-${slug}.png`, output)),
        animations: "disabled",
      });
      if (
        width === 1440 &&
        ["/actividad/qa-tienda/", "/practica/", "/simulador/", "/portafolio/"].includes(path)
      )
        await accessibility(`shared theme ${path}`);
    }
  }
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("link", { name: "Preguntas frecuentes", exact: true }).click();
  await page.waitForURL("**/acerca/#preguntas-frecuentes");
  const question = page
    .locator(".about-faq summary")
    .filter({ hasText: "¿Puedo empezar sin crear una cuenta?" });
  await question.focus();
  await page.keyboard.press("Enter");
  await page
    .getByText("Sí. Puedes realizar la práctica y guardar el borrador", { exact: false })
    .waitFor();
  await accessibility("about FAQ and footer");
  await footer.getByRole("link", { name: "Tu trabajo y tus datos", exact: true }).click();
  await page.waitForURL("**/acerca/#tus-datos");
  await footer.getByRole("link", { name: "Todas las actividades", exact: true }).click();
  await page.waitForURL("**/buscar/");
  await footer.getByRole("link", { name: "Áreas de práctica", exact: true }).click();
  await page.waitForURL(origin + "/");
  await noOverflow(page, "home footer mobile");
  await footer.screenshot({
    path: fileURLToPath(new URL("footer-mobile.png", output)),
    animations: "disabled",
  });
  await page.setViewportSize({ width: 1440, height: 1080 });
  await footer.screenshot({
    path: fileURLToPath(new URL("footer-desktop.png", output)),
    animations: "disabled",
  });
  await footer.getByRole("link", { name: "Volver arriba", exact: true }).click();
  await page.waitForFunction(
    () => document.getElementById("contenido").getBoundingClientRect().top >= -2,
  );
  await page.setViewportSize({ width: 320, height: 844 });
  await page.getByRole("button", { name: "Mi cuenta", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await noOverflow(page, "account dialog mobile");
  await page.getByRole("button", { name: "Cerrar", exact: true }).click();
  assert.deepEqual(errors, [], "no unhandled browser errors");
  assert.equal(
    results.flatMap((result) => result.accessibilityViolations || []).length,
    0,
    "no detected WCAG A/AA violations on audited views",
  );
  results.push({
    functional: "PASS",
    flows: [
      "global grouped suggestions, keyboard and mobile search",
      "global filters, URLs, reload and back navigation",
      "upcoming content and empty results",
      "search motion preferences",
      "role-scoped search",
      "practice start",
      "3 cases",
      "2 reports",
      "draft reload",
      "3 deliberate simulator defects",
      "file persistence and MIME validation",
      "submission",
      "cross-browser portable share without private evidence",
      "mobile overflow",
      "account dialog",
      "shared theme across routes at 1440, 768 and 320 pixels",
      "portfolio print layout without app navigation",
      "footer navigation, anchors, keyboard FAQ and back to top",
    ],
    browserErrors: errors,
  });
} catch (error) {
  await screenshot("failure").catch(() => {});
  results.push({ functional: "FAIL", error: String(error), browserErrors: errors });
  process.exitCode = 1;
} finally {
  await writeFile(new URL("qa-results.json", output), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}
