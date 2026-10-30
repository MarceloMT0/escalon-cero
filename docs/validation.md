# Validación técnica

29 de octubre de 2026. Comprobaciones sobre la versión local del MVP.

- `npm run check`: lint, tipos y once pruebas de dominio aprobadas.
- `npm run build`: exportación de todas las rutas completada.
- `npm run qa:browser`: recorrido completo aprobado en Chromium, sin excepciones no controladas.
- Borradores conservados tras recarga; tres casos y dos reportes creados desde los formularios.
- Comprobados los tres defectos educativos y el reinicio de la tienda.
- Adjuntado un PNG; rechazado un SVG no permitido.
- Registrada una entrega y abierto su portafolio desde un contexto de navegador nuevo, sin acceso al almacenamiento del autor ni a sus archivos.
- Sin desbordamiento horizontal en las rutas principales a 320 px y en portada a 390 px.
- axe: sin infracciones automáticas WCAG A/AA detectadas en portada y entrega. Esto no equivale a certificación completa de accesibilidad.

El detalle y las capturas se generan en `output/playwright/`, excluido de Git para no publicar por accidente datos de una sesión real. El script utiliza exclusivamente datos ficticios.

## Límites pendientes

- Verificar cuentas, confirmación de correo, sincronización, archivos y RLS en el proyecto Supabase real una vez conectado.
- Verificar el despliegue en Vercel y sus variables públicas.
- Ejecutar prueba de uso con una persona real y registrarla en la plantilla oficial del hackatón.

Las comprobaciones automáticas anteriores no son evidencia de validación de mercado ni de aprendizaje medido.
