import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const adminKey = process.env.SUPABASE_TEST_SERVICE_KEY;
const ref = process.env.SUPABASE_TEST_PROJECT_REF;
if (
  process.env.SUPABASE_TEST_ALLOW_WRITE !== "true" ||
  !adminKey ||
  !key ||
  !url ||
  new URL(url).hostname !== `${ref}.supabase.co`
) {
  throw new Error(
    "Cloud QA requires explicit write authorization and test-project credentials supplied only through process environment.",
  );
}
const origin = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const makeClient = (secret) =>
  createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const admin = makeClient(adminKey);
const publicClient = makeClient(key);
const learners = [];
const results = [];
let browser;
let cleanupFailed = false;
function verify(condition, message) {
  if (!condition) throw new Error(message);
}
const image = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l8sAAAAASUVORK5CYII=",
  "base64",
);

async function loginInBrowser(page, learner) {
  await page.goto(`${origin}/practica/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Mi cuenta", exact: true }).click();
  await page.getByLabel("Correo", { exact: true }).fill(learner.email);
  await page.getByLabel("Contraseña", { exact: true }).fill(learner.password);
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await page.getByText("Sesión iniciada como", { exact: false }).waitFor();
  await page.getByRole("button", { name: "Cerrar", exact: true }).click();
}
function fixture() {
  const now = new Date().toISOString();
  return {
    version: 1,
    activityId: "qa-tienda",
    startedAt: now,
    updatedAt: now,
    submittedAt: null,
    status: "draft",
    evidence: [],
    cases: Array.from({ length: 3 }, (_, i) => ({
      id: `cloud-case-${i}`,
      requirement: i ? "REQ-02" : "REQ-01",
      title: `Caso sintético ${i + 1}`,
      steps: "Reiniciar y seleccionar la cantidad de prueba.",
      expected: "El envío coincide con el requisito indicado.",
      actual: "Se muestra un resultado reproducible de la prueba.",
      result: "fallo",
    })),
    reports: Array.from({ length: 2 }, (_, i) => ({
      id: `cloud-report-${i}`,
      requirement: "REQ-02",
      title: `Hallazgo sintético ${i + 1}`,
      severity: "Media",
      steps: "Reiniciar el escenario y seleccionar dos unidades.",
      expected: "El envío debe ser gratuito a partir del umbral.",
      actual: "Se añaden 12 soles al total del pedido.",
    })),
    reflection:
      "Esta es una prueba técnica con datos sintéticos. No representa a una persona real ni sirve como evidencia de validación del producto para el hackatón.",
  };
}
try {
  for (const suffix of ["a", "b"]) {
    const email = `qa-${randomBytes(8).toString("hex")}-${suffix}@example.com`;
    const password = randomBytes(24).toString("base64url") + "Aa7";
    const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    verify(!created.error && created.data.user, "Could not create synthetic cloud QA user.");
    const client = makeClient(key);
    const signed = await client.auth.signInWithPassword({ email, password });
    learners.push({ id: created.data.user.id, email, password, client });
    verify(!signed.error && signed.data.session, "Synthetic user could not sign in.");
  }
  const [a, b] = learners;
  const saved = await a.client
    .from("practice_drafts")
    .upsert({ user_id: a.id, activity_id: "qa-tienda", payload: fixture() });
  verify(!saved.error, "Owner could not save a draft.");
  const own = await a.client.from("practice_drafts").select("payload").eq("user_id", a.id);
  verify(!own.error && own.data?.length === 1, "Owner could not read a saved draft.");
  const others = await b.client.from("practice_drafts").select("payload").eq("user_id", a.id);
  verify(!others.error && others.data?.length === 0, "Cross-user read was not isolated.");
  const spoof = await b.client.from("practice_drafts").insert({
    user_id: a.id,
    activity_id: "spoof",
    payload: { ...fixture(), activityId: "spoof" },
  });
  verify(Boolean(spoof.error), "A learner could spoof a different owner.");
  const anonymous = await publicClient.from("practice_drafts").select("payload");
  verify(Boolean(anonymous.error), "An anonymous client could access private drafts.");
  results.push({ check: "authenticated drafts and cross-user isolation", status: "PASS" });

  const objectPath = `${a.id}/qa-tienda/private-qa.png`;
  const uploaded = await a.client.storage
    .from("evidence")
    .upload(objectPath, image, { contentType: "image/png", upsert: true });
  verify(!uploaded.error, "Owner could not upload private evidence.");
  const ownFile = await a.client.storage.from("evidence").download(objectPath);
  verify(
    !ownFile.error && ownFile.data?.size === image.length,
    "Owner could not download private evidence.",
  );
  const otherFile = await b.client.storage.from("evidence").download(objectPath);
  verify(Boolean(otherFile.error), "Private evidence was accessible to another learner.");
  const spoofFile = await b.client.storage
    .from("evidence")
    .upload(`${a.id}/qa-tienda/spoof.png`, image, { contentType: "image/png" });
  verify(Boolean(spoofFile.error), "A learner could write into another learner's evidence path.");
  results.push({ check: "private files and owner paths", status: "PASS" });

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.evaluate(
    (draft) => localStorage.setItem("escalon-cero:practice:v1", JSON.stringify(draft)),
    fixture(),
  );
  await loginInBrowser(page, a);
  await page.getByRole("button", { name: /Mi entrega/ }).click();
  await page
    .locator("input[type=file]")
    .setInputFiles({ name: "cloud-fixture.png", mimeType: "image/png", buffer: image });
  await page.getByRole("button", { name: "Descargar cloud-fixture.png", exact: true }).waitFor();
  await page.getByRole("button", { name: "Sincronizar con mi cuenta", exact: true }).click();
  await page.getByText("Práctica sincronizada con tu cuenta.", { exact: false }).waitFor();
  const cloud = await a.client
    .from("practice_drafts")
    .select("payload")
    .eq("user_id", a.id)
    .single();
  verify(
    !cloud.error && cloud.data.payload.evidence[0]?.remotePath,
    "The UI did not save the private file reference.",
  );

  const secondContext = await browser.newContext();
  const secondPage = await secondContext.newPage();
  await loginInBrowser(secondPage, a);
  await secondPage
    .getByRole("button", { name: "Recuperar mi práctica de mi cuenta", exact: true })
    .click();
  await secondPage.getByRole("heading", { name: /Una compra sin sorpresas/ }).waitFor();
  await secondPage.getByRole("button", { name: /Casos de prueba/ }).click();
  verify(
    (await secondPage.locator(".entry-card").count()) === 3,
    "A second browser did not restore the cases.",
  );
  await secondPage.getByRole("button", { name: /Mi entrega/ }).click();
  const downloadPromise = secondPage.waitForEvent("download");
  await secondPage
    .getByRole("button", { name: "Descargar cloud-fixture.png", exact: true })
    .click();
  const download = await downloadPromise;
  verify(
    download.suggestedFilename() === "cloud-fixture.png",
    "A restored private file could not be downloaded.",
  );
  results.push({
    check:
      "UI sign-in, synchronization, second-browser restoration and private attachment download",
    status: "PASS",
  });
  await secondPage.getByRole("button", { name: "Mi cuenta", exact: true }).click();
  await secondPage.getByRole("button", { name: "Cerrar sesión", exact: true }).click();
  await secondPage.getByRole("button", { name: "Cerrar", exact: true }).click();
  await secondPage
    .getByRole("heading", { name: "Tu primera práctica te espera.", exact: true })
    .waitFor();
  await loginInBrowser(secondPage, b);
  await secondPage
    .getByRole("heading", { name: "Tu primera práctica te espera.", exact: true })
    .waitFor();
  verify(
    (await secondPage.locator(".entry-card").count()) === 0,
    "A different account saw the previous account's local draft.",
  );
  results.push({ check: "sign-out and account-scoped local drafts", status: "PASS" });
} catch (error) {
  results.push({
    status: "FAIL",
    message: error instanceof Error ? error.message : "Cloud QA failed.",
  });
  process.exitCode = 1;
} finally {
  await browser?.close();
  for (const learner of learners) {
    const files = await admin.storage.from("evidence").list(`${learner.id}/qa-tienda`);
    if (files.data?.length) {
      const deleted = await admin.storage
        .from("evidence")
        .remove(files.data.map((file) => `${learner.id}/qa-tienda/${file.name}`));
      if (deleted.error) {
        cleanupFailed = true;
        results.push({ cleanup: "FAIL", resource: "synthetic evidence" });
        process.exitCode = 1;
      }
    }
    const deleted = await admin.auth.admin.deleteUser(learner.id);
    if (deleted.error) {
      cleanupFailed = true;
      results.push({ cleanup: "FAIL", resource: "synthetic user" });
      process.exitCode = 1;
    }
  }
  results.push({
    cleanup: cleanupFailed ? "REVIEW" : "PASS",
    note: "Only synthetic users created by this run were targeted; no real-user validation is claimed.",
  });
  const output = new URL("../output/playwright/", import.meta.url);
  await mkdir(output, { recursive: true });
  await writeFile(new URL("cloud-qa-results.json", output), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}
