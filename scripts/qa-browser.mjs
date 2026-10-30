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
  await page.getByRole("heading", { name: "¿En qué área quieres dar tu primer paso?" }).waitFor();
  await page.getByText("Marketing digital", { exact: true }).waitFor();
  assert.equal(
    await page.getByRole("link", { name: "Ver actividad", exact: true }).count(),
    0,
    "home does not recommend an activity before area selection",
  );
  assert.equal(await page.locator(".home-area-picker .coming-badge").count(), 4);
  await noOverflow(page, "desktop home");
  await screenshot("home-desktop");
  await accessibility("home");
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await noOverflow(page, `home ${width}`);
  }
  await screenshot("home-mobile");
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.getByRole("link", { name: /Ingeniería de software/ }).click();
  await page.getByRole("textbox", { name: "Buscar actividades" }).fill("sin-coincidencias");
  await page.getByRole("heading", { name: "Aún no hay una práctica para esta búsqueda" }).waitFor();
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await page.getByLabel("Filtrar por rol").selectOption("QA / Testing");
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
  await strangerContext.close();
  for (const path of [
    "/",
    "/explorar/",
    "/actividad/qa-tienda/",
    "/practica/",
    "/simulador/",
    "/portafolio/",
    "/acerca/",
  ]) {
    await page.setViewportSize({ width: 320, height: 844 });
    await open(path);
    await noOverflow(page, `mobile ${path}`);
  }
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
      "catalog search",
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
