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
- Supabase: migración aplicada y registrada. Prueba SQL con usuarios sintéticos y rollback aprobada.
- Supabase SDK: escritura propia, bloqueo de lectura e inserción entre usuarios, ausencia de acceso anónimo y archivos privados aprobados.
- Navegador y Supabase: inicio de sesión, sincronización de textos y archivo, recuperación en otra sesión y descarga del adjunto aprobados.
- Navegador: cierre de sesión y cambio de cuenta mantienen separados los borradores locales.
- Las cuentas y archivos sintéticos de la prueba de nube se eliminaron al terminar.
- Vercel: primer despliegue funcional con respuesta HTTP 200 sin autenticación de visitante. GitHub conectado al proyecto y variables públicas de Supabase configuradas.

El detalle y las capturas se generan en `output/playwright/`, excluido de Git para no publicar por accidente datos de una sesión real. El script utiliza exclusivamente datos ficticios.

## Límites pendientes

- Configurar SMTP antes de abrir el registro con correo verificado a personas externas. No se ha probado envío de correos a usuarios reales.
- Ejecutar prueba de uso con una persona real y registrarla en la plantilla oficial del hackatón.

Las comprobaciones automáticas anteriores no son evidencia de validación de mercado ni de aprendizaje medido.

## Revisión de UI — 29 de octubre de 2026

- Lint, tipos y once pruebas de dominio aprobados. Build estático aprobado.
- Recorrido Playwright completo aprobado: búsqueda, casos, reportes, borrador, tienda, adjuntos, entrega y portafolio compartido.
- Sin errores no controlados del navegador ni infracciones axe detectadas en inicio y entrega.
- Capturas de inicio, catálogo y encargo a 1440, 768, 390 y 320 px; ajuste específico para apilar la portada en tablet. Revisados también formularios de casos y portafolio compartido.
- Comprobados pausa y movimiento reducido. La revisión visual reduce los bucles decorativos a un único movimiento de la ilustración.
- La prueba de nube no se repitió: esta revisión modifica presentación y textos, sin cambios de autenticación, persistencia o SQL. No se realizó una prueba con participantes reales.

## Inicio como archivo de prácticas — opción G

- Lint, TypeScript, once pruebas de dominio y build aprobados.
- Recorrido completo de navegador aprobado con la portada nueva. Comprobados abrir/cerrar carpetas con Enter, selección exclusiva, áreas pendientes sin enlace de práctica, control de movimiento y preferencia del sistema.
- Sin desbordamiento del inicio a 1440, 1024, 768, 390 y 320 px. Capturas revisadas de escritorio y móvil; comprobación táctil adicional a 390 px.
- axe sin infracciones detectadas en inicio, entrega y carpeta pendiente abierta en móvil. Comprobada navegación de cliente al catálogo y regreso: el estilo de la franja lateral se limita a la portada.
- Sin cambios de persistencia o SQL; no se repitió QA de nube. No se realizaron pruebas con usuarios reales.

## Jerarquía Área → Rol → Actividades

- Lint, tipos, once pruebas de dominio y build estático de once rutas aprobados.
- Recorrido de navegador aprobado desde la carpeta de software hasta el catálogo de QA y la actividad existente, incluida la entrega y el portafolio compartido.
- Verificado que la página de área contiene roles y ningún enlace directo de inicio de actividad; el catálogo QA contiene una actividad disponible y un espacio «Próximamente» para futuras incorporaciones.
- axe sin infracciones detectadas en inicio, roles de software, catálogo QA y entrega. Sin desbordamiento a 320 px en las rutas principales, incluida la nueva ruta de QA.
- Comprobada navegación táctil a 390 px, búsqueda en el catálogo y retorno desde el encargo a QA. La prueba espera a la URL de destino para evitar confundir el nombre del rol en la página de área con el encabezado del catálogo.
- No se repitieron pruebas de nube ni se realizó validación con usuarios reales.

## Textos breves y filtros de actividades — 2026-10-29

Se eliminaron explicaciones repetidas del inicio, las carpetas y el catálogo. QA combina búsqueda por palabras, tema, nivel y duración, muestra el recuento real y permite limpiar todos los criterios. Los temas y niveles proceden del catálogo publicado; se conserva una sola actividad funcional.

Validación ejecutada: `npm run check` (lint, tipos y 14 pruebas de dominio), `npm run build` y `npm run qa:browser` contra el build de producción local en el puerto 3001. Los filtros combinados, los resultados vacíos, el restablecimiento y el recorrido de práctica hasta compartir pasaron sin errores de navegador. Axe no detectó incidencias en inicio, roles, catálogo, estado vacío ni entrega. Se inspeccionaron capturas de escritorio y móvil de 320 px, sin desbordamiento. Pruebas de dominio cubren límites de duración, búsqueda sin tildes y combinación de criterios.

No se ejecutaron pruebas cloud (sin cambios de persistencia) ni pruebas con usuarios reales. Los cambios permanecen locales; no se desplegaron a la demo pública.

## Búsqueda global y archivo — 2026-10-29

Implementada la alternativa 3: titular «Tu experiencia empieza haciendo», buscador global en la portada, sugerencias agrupadas por áreas/roles/actividades y catálogo `/buscar/`. Se conserva el archivo de carpetas. Los filtros de área, rol, tema, nivel y duración se trasladan a la búsqueda general; QA conserva búsqueda local. Las selecciones se guardan en la URL y se pueden retirar individualmente. No se añadió ninguna actividad ni dependencia.

Comprobaciones ejecutadas:

- Lint, tipos y 16 pruebas de dominio aprobadas, incluidos búsqueda global, IDs de taxonomía, filtros incompatibles y codificación/validación de parámetros.
- Build estático aprobado con la nueva ruta `/buscar/`.
- QA en Chromium contra el build local: sugerencias de los tres tipos, flechas/Escape, Enter, contenido pendiente sin enlace de inicio, filtros combinados, borrado individual/completo, recarga y vuelta atrás, y entrada desde QA con rol removible.
- Controles manuales y preferencia del sistema de movimiento reducido comprobados; se retiró el desvanecimiento de texto tras detectar pérdida de contraste durante una transición.
- Capturas de escritorio y móvil inspeccionadas. Comprobado ancho de 320 px, sugerencias y filtros desplegados sin desbordamiento horizontal.
- Axe sin infracciones detectadas en inicio, sugerencias, búsqueda global, resultados vacíos, filtros móviles, roles, QA y entrega. Ningún error de JavaScript registrado.
- Recorrido existente de práctica, borrador, adjuntos, entrega y portafolio compartido aprobado.

No se ejecutaron pruebas cloud (sin cambios en persistencia) ni validación con usuarios reales. No se publicó a la demo externa.

## Pie de página ampliado — 2026-10-29

Pie compartido con marca, descripción breve, enlaces de exploración/espacio personal/proyecto, código fuente y retorno arriba. Se añaden preguntas frecuentes nativas y anclas de información sobre datos en `/acerca/`. Contenido y navegación centralizados en `content/site.ts`, sin inventar canales de contacto ni políticas legales.

Comprobaciones: `npm run check` (lint, tipos, 16 pruebas de dominio), build estático y recorrido completo de navegador aprobados. Verificados enlaces del pie, anclas, FAQ mediante teclado y retorno arriba. Axe sin incidencias detectadas, incluida la página de preguntas con un acordeón abierto. Capturas del pie en escritorio y 320 px inspeccionadas; sin desbordamiento. Sin errores de JavaScript. No se ejecutaron pruebas cloud ni validación con usuarios reales; no hay cambios en persistencia ni publicación externa.

## Identidad visual compartida — 2026-10-29

El archivo aprobado se extiende a todas las rutas mediante el layout raíz, `ArchiveSpine` y `archive-system.css`. Cabecera, márgenes, títulos sans serif, botones, tarjetas y estados activos comparten reglas. Se conserva el archivo de la tipografía serif anterior, pero ya no se carga. La navegación se oculta al imprimir el portafolio.

Validación: lint, tipos y 16 pruebas de dominio aprobadas; build estático correcto. Recorrido completo de navegador aprobado, incluida búsqueda, práctica, adjuntos, entrega y enlace de portafolio. Comprobadas diez rutas a 1440, 768 y 320 px, con una sola franja de marca, tipografía consistente, contenido alineado y sin desbordamiento horizontal. Capturas de escritorio/tableta/móvil inspeccionadas. Axe sin incidencias detectadas en las pantallas auditadas, ampliadas al encargo, práctica, simulador y portafolio. Verificada impresión sin navegación ni margen lateral. No hay cambios en persistencia ni nuevas pruebas cloud; no se realizó validación con usuarios reales.
