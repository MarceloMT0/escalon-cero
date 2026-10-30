export const footerGroups = [
  {
    title: "Explorar",
    links: [
      { label: "Áreas de práctica", href: "/" },
      { label: "Todas las actividades", href: "/buscar/" },
      { label: "QA / Testing", href: "/explorar/qa/" },
    ],
  },
  {
    title: "Tu espacio",
    links: [
      { label: "Mi práctica", href: "/practica/" },
      { label: "Mi portafolio", href: "/portafolio/" },
    ],
  },
  {
    title: "El proyecto",
    links: [
      { label: "Sobre Escalón Cero", href: "/acerca/" },
      { label: "Preguntas frecuentes", href: "/acerca/#preguntas-frecuentes" },
      { label: "Tu trabajo y tus datos", href: "/acerca/#tus-datos" },
    ],
  },
] as const;

export const frequentlyAskedQuestions = [
  {
    question: "¿Necesito experiencia previa?",
    answer:
      "La actividad disponible es de nivel inicial. Encontrarás un encargo, requisitos y plantillas para documentar tus pruebas y errores.",
  },
  {
    question: "¿Qué actividades puedo hacer?",
    answer:
      "Por ahora puedes practicar QA en una tienda simulada. Las demás áreas y roles están identificados como Próximamente.",
  },
  {
    question: "¿Puedo empezar sin crear una cuenta?",
    answer:
      "Sí. Puedes realizar la práctica y guardar el borrador en este navegador. Borrar sus datos elimina la copia local; una cuenta conectada permite sincronizarla de forma manual.",
  },
  {
    question: "¿Qué puedo mostrar en mi portafolio?",
    answer:
      "Tu entrega, los casos de prueba, los reportes y tu reflexión. Tú confirmas qué texto compartes; los archivos adjuntos quedan fuera del enlace público.",
  },
] as const;
