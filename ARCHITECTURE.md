# Arquitectura actual

## Aplicación

Next.js App Router genera rutas estáticas. Los componentes de servidor se ejecutan durante el build; las interacciones, borradores y el simulador funcionan en componentes cliente. La salida `out/` permite desplegar en Vercel sin procesos de servidor adicionales.

React y TypeScript implementan la interfaz. Tailwind y CSS con tokens propios reproducen el estilo aprobado. Los controles usan variantes de estilo shadcn y Radix Dialog para foco, cierre y accesibilidad. Fuentes e ilustración se sirven localmente.

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
