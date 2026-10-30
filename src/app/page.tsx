import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  Compass,
  MoveRight,
} from "lucide-react";
import { ActivityCard } from "@/components/activity-card";
import { AreaGrid } from "@/components/area-grid";

export default function HomePage() {
  return (
    <div className="page-container home-page">
      <section className="home-heading">
        <span className="quiet-eyebrow">EL PRIMER PASO ES TUYO</span>
        <h1>
          Tu experiencia empieza <span className="heading-mark">haciendo.</span>
        </h1>
        <p>Practica tareas de un rol junior y muestra lo que sabes hacer.</p>
      </section>
      <section className="hero-grid" aria-label="Tu primera oportunidad de practicar">
        <div className="hero-art">
          <div className="hero-glow" />
          <Image
            src="/images/escalones.webp"
            width={1000}
            height={667}
            alt="Tres escalones azules que llevan hacia una tienda online y una lupa de testing"
            priority
            sizes="(max-width: 760px) 90vw, 46vw"
          />
          <span className="art-caption">Un proyecto. Un aprendizaje. Un paso más.</span>
        </div>
        <ActivityCard />
      </section>
      <section className="steps-row" aria-label="Cómo funciona">
        {[
          {
            Icon: Compass,
            title: "1. Explora",
            text: "Conoce el contexto, el objetivo y las herramientas.",
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
      <section className="home-areas">
        <div className="section-heading">
          <h2>Explora por área</h2>
          <Link href="/explorar/">
            Ver todas las áreas <ArrowRight size={16} />
          </Link>
        </div>
        <AreaGrid />
      </section>
      <div className="home-note">
        <span className="status-dot" />
        Sin experiencia previa. Sin competir por una vacante. A tu ritmo.
      </div>
    </div>
  );
}
