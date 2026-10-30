# Arquitectura actual

## Aplicación

Next.js App Router genera rutas estáticas. Los componentes de servidor se ejecutan durante el build; las interacciones, borradores y el simulador funcionan en componentes cliente. La salida `out/` permite desplegar en Vercel sin procesos de servidor adicionales.

React y TypeScript implementan la interfaz. Tailwind y CSS con tokens propios reproducen el estilo aprobado. Los controles usan variantes de estilo shadcn y Radix Dialog para foco, cierre y accesibilidad. Fuentes e ilustración se sirven localmente.

El inicio usa `components/practice-archive.tsx`: un acordeón de carpetas con estado local para la carpeta abierta y el movimiento. CSS anima la expansión, la hoja interior y las respuestas a foco y cursor. No hay bucles por fotograma ni dependencias de animación. El contenido y los destinos proceden de `content/catalog.ts`. La preferencia del sistema y el control manual permiten reducir el movimiento.

## Límites de módulos

- `content/catalog.ts`: actividad, requisitos y taxonomía inicial.
- `features/practice/model.ts`: contrato Zod, validación y rúbrica de estructura.
- `features/practice/store.ts`: almacenamiento local versionado; `useSyncExternalStore` evita problemas de hidratación y coordina cambios entre pestañas.
- `features/practice/evidence.ts`: blobs privados en IndexedDB.
- `features/practice/cloud.ts`: carga y recuperación explícitas de borradores y archivos de Supabase.
- `features/simulator/engine.ts`: comportamiento determinista de la tienda y errores educativos intencionales. No interviene en autenticación ni pagos.
- `features/portfolio/`: extracción explícita de campos compartibles, codificación Base64url, validación y renderizado de texto sin HTML arbitrario.

## Persistencia

En modo local, el navegador conserva un único borrador de la actividad y hasta cinco archivos de 2 MB. Los textos tienen límites y se validan al leer y guardar. Un error de almacenamiento no debe descartar el texto del formulario ni fingir que se guardó.

Los borradores locales se separan por usuario autenticado. El primer inicio de sesión puede trasladar un borrador de invitado a un espacio de cuenta vacío, sin sobrescribir borradores de cuenta existentes. Cerrar sesión oculta el borrador de la cuenta en la interfaz; otra cuenta no lo hereda. Este aislamiento de interfaz no equivale a cifrar el almacenamiento del dispositivo.

Con variables públicas de Supabase, se habilita autenticación por correo y sincronización manual. `practice_drafts` tiene clave compuesta por usuario y actividad; sus políticas permiten operar solo sobre filas propias. El bucket privado `evidence` limita formato, tamaño y rutas por usuario. Las credenciales administrativas no forman parte del cliente.

La migración está aplicada y registrada en el proyecto real. Las pruebas SQL y las pruebas de SDK verificaron RLS; una prueba en navegador verificó inicio de sesión, sincronización y recuperación de adjuntos en otra sesión. Se utilizaron cuentas sintéticas, retiradas al terminar. El registro público por correo requiere configurar SMTP; la confirmación de correo permanece activa.

## Portafolio

Solo se crea a partir de una entrega que satisface la rúbrica de estructura. El autor introduce nombre o alias, revisa el contenido y confirma su publicación. El enlace lleva una instantánea codificada en el fragmento de URL; ese fragmento no se envía al servidor HTTP. La entrada tiene un límite de tamaño antes de decodificar y no usa descompresión de datos no confiables. El receptor lo valida con Zod y lo muestra como texto de React.

No incluye archivos ni rutas privadas. No es un registro certificado, no ofrece revocación y no actualiza enlaces anteriores. La elección reduce dependencias para la demo; un catálogo público persistente de perfiles queda fuera del MVP.

## Comprobaciones

Pruebas de dominio con Node Test Runner y tsx. Recorrido de navegador con Playwright y auditorías axe. Lint, TypeScript y build en CI. Las pruebas del simulador aseguran que sus defectos permanezcan reproducibles; no convierten esos defectos en comportamiento válido para el resto del producto.

## Diseño de interfaz

La opción G, aprobada posteriormente por el usuario, define el inicio como un archivo de prácticas: franja lateral cobalto, encabezado sans serif y carpetas con pestañas. `app/archive-home.css` acota esta identidad a la portada; las otras rutas conservan su navegación y estilo. En móvil las carpetas se apilan. Las áreas pendientes se pueden abrir para consultar su descripción, pero no ofrecen un enlace para comenzar. Los recursos y la referencia visual anteriores se conservan como antecedentes.

Los estilos compartidos elevan la escala de texto auxiliar a 13–14 px, los campos a 16 px y los controles principales a un mínimo de 44 px. Encargo, catálogo y portafolio usan jerarquías distintas: lectura continua, actividad destacada y documento de trabajo. Las transiciones de interacción y avisos son breves y respetan movimiento reducido. No se incorpora una dependencia de animación ni se modifica la persistencia.

## Jerarquía del catálogo

El modelo de navegación es Área → Rol → Actividades → Encargo. Una carpeta de inicio representa un área, no un proyecto único. Las carpetas permiten elegir primero un área, luego un rol y finalmente un encargo. La búsqueda global ofrece un acceso directo alternativo sin exigir esa secuencia.

- `/`: titular «Tu experiencia empieza haciendo», búsqueda global con sugerencias agrupadas y carpetas de áreas; acción «Ver roles».
- `/buscar/`: catálogo general con resultados, accesos a áreas/roles y filtros de área, rol, tema, nivel y duración.
- `/explorar/`: roles de Ingeniería de software. QA está disponible; Frontend y Backend indican «Próximamente».
- `/explorar/qa/`: colección de actividades de QA con búsqueda local; se muestra el número real disponible y un espacio de próximas incorporaciones sin actividades ficticias.
- `/actividad/qa-tienda/`: encargo existente. Su enlace de retorno lleva al catálogo de QA.

Se conserva la URL del encargo y los borradores existentes. `content/catalog.ts` contiene los roles y la colección `activities`; `ActivityCard` recibe un elemento de esa colección. La práctica funcional sigue limitada al encargo QA actual: añadir un nuevo encargo ejecutable requerirá su contenido, modelo de persistencia y pruebas, además de una tarjeta.

Las migas de navegación permiten regresar de rol a área y de área al inicio. La navegación mantiene visible la jerarquía sin explicaciones repetidas. Esta estructura está comprobada técnicamente; su comprensión con estudiantes reales queda pendiente.

## Búsqueda global y filtros

La búsqueda del inicio (`features/catalog/global-search.tsx`) consulta un índice local derivado del contenido (`search.ts`). Presenta sugerencias en tres grupos: Áreas, Roles y Actividades. Los enlaces disponibles se recorren con Tab o flechas; Escape cierra el panel y devuelve el foco al campo. Enter abre `/buscar/?q=...`. Las áreas y roles pendientes son texto identificado como «Próximamente», sin enlaces de inicio. El icono de búsqueda del encabezado abre el catálogo completo; «Explorar» vuelve al archivo de áreas.

La página `/buscar/` combina búsqueda por palabras, área, rol, tema, nivel y duración mediante lógica AND en `features/catalog/filter.ts`. Ignora mayúsculas y tildes, e incluye nombres de área y rol en el texto de cada actividad. La taxonomía usa IDs de área y rol; temas y niveles proceden de actividades publicadas. El tiempo usa el extremo superior estimado (`durationMinutes`): menos de 60, de 60 a 180 y más de 180 minutos.

Los filtros se reflejan en los parámetros `q`, `area`, `role`, `topic`, `level` y `duration`, leídos bajo Suspense para preservar la exportación estática. La History API permite filtrar sin recargar y conserva el estado al recargar, compartir la URL o volver desde un resultado. Los valores desconocidos se descartan y el texto se limita a 160 caracteres. Cambiar de área elimina un rol incompatible. Se pueden quitar filtros individuales mediante etiquetas o restablecerlos todos. No hay persistencia nueva ni llamadas externas.

En móvil el botón «Filtros» despliega los controles. El catálogo propio de QA conserva únicamente búsqueda local y un enlace al catálogo general con QA preseleccionado y removible. Los elementos pendientes se muestran separados de las actividades disponibles y no incrementan su contador.

Las sugerencias y los cambios de resultados usan transiciones breves de desplazamiento, sin atenuar la legibilidad del texto. Respetan `prefers-reduced-motion`, el control existente del archivo y un control equivalente en la búsqueda general. Estas comprobaciones técnicas no sustituyen pruebas de comprensión con usuarios reales.

## Pie de página compartido

`components/site-footer.tsx` muestra marca, descripción breve, navegación de exploración/espacio personal/proyecto, enlace al repositorio y retorno al contenido principal. Los grupos de enlaces y las preguntas frecuentes se mantienen en `content/site.ts`. Los enlaces sobre datos y preguntas llevan a secciones identificadas de `/acerca/`; las preguntas usan elementos nativos `details`/`summary`. No se añaden contactos, redes sociales ni políticas legales ficticias. La cuadrícula se adapta a móvil y conserva los márgenes del archivo de inicio; los iconos responden al hover y respetan movimiento reducido. El pie sigue oculto al imprimir portafolios.
