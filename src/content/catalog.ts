export const activity = {
  id: "qa-tienda",
  title: "Prueba el proceso de compra de una tienda online",
  shortTitle: "Una compra sin sorpresas",
  area: "Ingeniería de software",
  role: "QA / Testing",
  level: "Inicial",
  duration: "2–3 horas",
  description:
    "Ponte en el lugar de un QA junior. Explora una tienda, diseña tus pruebas y documenta errores que un equipo pueda reproducir.",
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
    title: "Ingeniería de software",
    description: "Frontend, Backend, QA y más.",
    icon: "code",
    available: true,
  },
  {
    id: "datos",
    title: "Datos y analítica",
    description: "Análisis de datos y reportes.",
    icon: "database",
    available: false,
  },
  {
    id: "diseno",
    title: "Producto y diseño",
    description: "UX/UI y diseño visual.",
    icon: "pen",
    available: false,
  },
  {
    id: "marketing",
    title: "Marketing digital",
    description: "Contenido, campañas y medición.",
    icon: "megaphone",
    available: false,
  },
  {
    id: "operaciones",
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
