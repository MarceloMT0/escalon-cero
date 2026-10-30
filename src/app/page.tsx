import { ChartNoAxesColumnIncreasing, ClipboardList, Compass, MoveRight } from "lucide-react";
import { AreaGrid } from "@/components/area-grid";
import { CareerScene } from "@/components/career-scene";

export default function HomePage() {
  return (
    <div className="page-container home-page">
      <section className="home-heading">
        <span className="quiet-eyebrow">EL PRIMER PASO ES TUYO</span>
        <h1>
          Tu experiencia empieza <span className="heading-mark">haciendo.</span>
        </h1>
        <p>Elige qué quieres aprender y practica tareas de un rol junior.</p>
      </section>
      <section className="hero-grid home-discovery" aria-label="Encuentra tu área de interés">
        <section className="discovery-card" aria-labelledby="discovery-title">
          <span className="eyebrow lime-badge">ELIGE TU PUNTO DE PARTIDA</span>
          <h2 id="discovery-title">¿En qué área quieres dar tu primer paso?</h2>
          <p>Encuentra prácticas relacionadas con lo que te interesa aprender.</p>
          <div className="home-area-picker">
            <AreaGrid all />
          </div>
          <p className="discovery-note">
            Hoy puedes explorar prácticas de software. Las demás áreas están en preparación.
          </p>
        </section>
        <CareerScene />
      </section>
      <section className="steps-row" aria-label="Cómo funciona">
        {[
          {
            Icon: Compass,
            title: "1. Elige tu área",
            text: "Explora los roles y encuentra una práctica que te interese.",
          },
          {
            Icon: ClipboardList,
            title: "2. Practica",
            text: "Resuelve una tarea en un entorno realista, a tu ritmo.",
          },
          {
            Icon: ChartNoAxesColumnIncreasing,
            title: "3. Muestra tu trabajo",
            text: "Entrega tus resultados y agrégalos a tu portafolio.",
          },
        ].map(({ Icon, title, text }, index) => (
          <div className="step-item" key={title}>
            <span className="step-icon">
              <Icon size={27} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            {index < 2 ? <MoveRight className="step-arrow" size={30} strokeWidth={1} /> : null}
          </div>
        ))}
      </section>
      <div className="home-note">
        <span className="status-dot" />
        Sin experiencia previa. Sin competir por una vacante. A tu ritmo.
      </div>
    </div>
  );
}
