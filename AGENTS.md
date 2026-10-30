# Escalón Cero

MVP de prácticas laborales para juniors. Next.js App Router, React, TypeScript, Tailwind, componentes de estilo shadcn/Radix y Supabase opcional.

## Mapa

- `src/app/`: rutas y estilos. Páginas exportadas como HTML estático.
- `src/components/`: componentes compartidos y controles accesibles.
- `src/features/`: catálogo, práctica, simulador, portafolio y persistencia.
- `src/content/catalog.ts`: única actividad activa, áreas y requisitos.
- `supabase/migrations/`: estructura y aislamiento por usuario.
- `tests/`: lógica de dominio. `scripts/qa-browser.mjs`: prueba real en navegador.
- `docs/assets/`: estilo aprobado e imagen de referencia.

## Comandos

`npm ci`, `npm run dev`, `npm run check`, `npm run build`, `npm run preview`.
Con el preview en ejecución: `npm run qa:browser`. Si falta Chromium: `npx playwright install chromium`.

## Reglas

- Interfaz en español y responsive. Respetar `docs/assets/estilo-aprobado.json` y `docs/assets/referencia-aprobada.png`.
- Una actividad funcional: QA de una tienda simulada. Las demás indican «Próximamente».
- Los errores intencionales solo pertenecen a `src/features/simulator/engine.ts`. No corregirlos sin cambiar requisitos, pruebas y ejercicio.
- Sin testimonios, usuarios ni validaciones inventados. Distinguir revisión de estructura de validación profesional.
- Validar entradas y contenido compartido. Nunca renderizar texto de usuario con `dangerouslySetInnerHTML`.
- Mantener privadas las evidencias. No incluirlas en los enlaces de portafolio.
- En frontend solo claves publicables. Nunca incluir service_role, contraseñas de DB o tokens de despliegue.
- Antes de cambiar SQL, revisar las reglas de Supabase de la sesión. Conservar RLS y pruebas de aislamiento.
- Evitar dependencias pesadas y nuevas capas de servidor para tareas que resuelve Supabase.
- Al finalizar cambios: lint, tipos, pruebas, build y QA de navegador según alcance. Actualizar README, arquitectura o requisitos cuando cambie su contenido.

Requisitos: `docs/requirements.md`. Arquitectura: `ARCHITECTURE.md`. Competencia: `docs/hackathon.md`. Estado: `docs/plan-mvp.md`.
