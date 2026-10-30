"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import styles from "./career-scene.module.css";

export function CareerScene() {
  const [paused, setPaused] = useState(false);

  return (
    <figure className={styles.scene} data-paused={paused}>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.heading}>
          Aprender.
          <br />
          Hacer.
          <br />
          <span>Dar el paso.</span>
        </div>
        <div className={styles.illustration}>
          <Image
            src="/images/primer-paso.webp"
            width={1000}
            height={667}
            alt=""
            priority
            sizes="(max-width: 760px) 90vw, 46vw"
          />
        </div>
        <div className={styles.note}>
          <ArrowUpRight size={22} />
          <span>
            Lo que haces hoy
            <br />
            <strong>puedes mostrarlo mañana.</strong>
          </span>
        </div>
        <div className={styles.baseline}>
          <span>Explora</span>
          <span>Practica</span>
          <span>Muéstralo</span>
        </div>
      </div>
      <div className={styles.sceneFooter}>
        <figcaption>Tu primer proyecto empieza con un paso.</figcaption>
        <button
          className={styles.motionControl}
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? "Activar animación" : "Pausar animación"}
          aria-pressed={paused}
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
          <span>{paused ? "Activar" : "Pausar"}</span>
        </button>
      </div>
    </figure>
  );
}
