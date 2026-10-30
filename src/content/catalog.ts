export type CatalogActivity = {
  id: string;
  title: string;
  shortTitle: string;
  area: string;
  areaId: string;
  roleId: string;
  role: string;
  level: string;
  duration: string;
  durationMinutes: number;
  topics: readonly string[];
  description: string;
  skills: readonly string[];
  deliverables: readonly string[];
};

export const activity = {
  id: "qa-tienda",
  title: "Prueba el proceso de compra de una tienda online",
  shortTitle: "Una compra sin sorpresas",
  area: "Ingeniería de software",
  areaId: "software",
  roleId: "qa",
  role: "QA / Testing",
  level: "Inicial",
  duration: "2–3 horas",
  durationMinutes: 180,
  topics: ["Pruebas funcionales", "Casos de prueba", "Reporte de errores"],
  description: "Explora una tienda, diseña pruebas y documenta errores.",
  skills: ["Pruebas funcionales", "Casos de prueba", "Reporte de errores", "Pensamiento crítico"],
  deliverables: [
    "Al menos 3 casos de prueba",
    "Al menos 2 reportes de errores",
    "Una reflexión sobre tus decisiones",
  ],
} as const;

export const areas = [
  {
    id: "software",
    archiveLabel: "Ingeniería de software",
    title: "Ingeniería de software",
    description: "Frontend, Backend, QA y más.",
    icon: "code",
    available: true,
  },
  {
    id: "datos",
    archiveLabel: "Datos",
    title: "Datos y analítica",
    description: "Análisis de datos y reportes.",
    icon: "database",
    available: false,
  },
  {
    id: "diseno",
    archiveLabel: "Diseño",
    title: "Producto y diseño",
    description: "UX/UI y diseño visual.",
    icon: "pen",
    available: false,
  },
  {
    id: "marketing",
    archiveLabel: "Marketing",
    title: "Marketing digital",
    description: "Contenido, campañas y medición.",
    icon: "megaphone",
    available: false,
  },
  {
    id: "operaciones",
    archiveLabel: "Finanzas",
    title: "Finanzas y operaciones",
    description: "Contabilidad y procesos.",
    icon: "chart",
    available: false,
  },
] as const;

export const requirements = [
  {
    id: "REQ-01",
    title: "Cantidad y total",
    text: "Cada producto cuesta S/ 80. El subtotal debe ser el precio multiplicado por la cantidad seleccionada, de 1 a 5 unidades.",
  },
  {
    id: "REQ-02",
    title: "Envío gratuito",
    text: "El envío cuesta S/ 12. Es gratuito cuando el subtotal de productos es mayor o igual a S/ 160, antes de aplicar descuentos.",
  },
  {
    id: "REQ-03",
    title: "Cupón BIENVENIDA10",
    text: "Debe descontar el 10 % del subtotal de productos, una sola vez. Pulsar nuevamente Aplicar no debe acumular el descuento.",
  },
  {
    id: "REQ-04",
    title: "Correo del comprador",
    text: "Solo se puede confirmar el pedido con un correo válido: nombre, @ y dominio con extensión. El campo es obligatorio.",
  },
  {
    id: "REQ-05",
    title: "Confirmación",
    text: "Con datos válidos, la tienda debe mostrar la cantidad, el total y una referencia de pedido ficticia. No se realizan cobros.",
  },
] as const;

export const roleOptions = ["Todos los roles", "QA / Testing", "Frontend", "Backend"] as const;

// A role contains a collection, even while the MVP has one available activity.
export const activities: readonly CatalogActivity[] = [activity];
export const softwareRoles = [
  {
    id: "qa",
    areaId: "software",
    title: "QA / Testing",
    description: "Prueba comportamientos, diseña casos y documenta hallazgos.",
    available: true,
    href: "/explorar/qa/",
  },
  {
    id: "frontend",
    areaId: "software",
    title: "Frontend",
    description: "Interfaces, accesibilidad y experiencias en la web.",
    available: false,
    href: null,
  },
  {
    id: "backend",
    areaId: "software",
    title: "Backend",
    description: "APIs, datos y lógica detrás de cada producto.",
    available: false,
    href: null,
  },
] as const;
