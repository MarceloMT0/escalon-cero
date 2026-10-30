"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, FileCheck2, Pause, PenTool, Play, Sparkles } from "lucide-react";
import styles from "./career-scene.module.css";

export function CareerScene() {
  const [paused, setPaused] = useState(false);

  return (
    <figure className={styles.scene} data-paused={paused}>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glow} />
        <div className={styles.orbit}>
          <span />
        </div>
        <div className={styles.smallOrbit} />
        <span className={styles.topLabel}>
          <Sparkles size={13} />
          EL POTENCIAL LO PONES TÚ
        </span>

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

        <div className={`${styles.floatingCard} ${styles.design}`}>
          <div className={styles.cardLabel}>
            <PenTool size={14} />
            <span>UNA IDEA CON FORMA</span>
          </div>
          <strong>Diseña.</strong>
          <div className={styles.swatches}>
            <span />
            <span />
            <span />
            <i />
          </div>
        </div>

        <div className={`${styles.floatingCard} ${styles.data}`}>
          <div className={styles.cardLabel}>
            <span>ENCUENTRA EL PORQUÉ</span>
            <ArrowUpRight size={14} />
          </div>
          <strong>Analiza.</strong>
          <div className={styles.bars}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={`${styles.floatingCard} ${styles.create}`}>
          <div className={styles.cardLabel}>
            <Sparkles size={14} />
            <span>IDEAS QUE CONECTAN</span>
          </div>
          <strong>Crea.</strong>
          <div className={styles.storyboard}>
            <span>
              <i />
              <i />
            </span>
            <span />
            <span />
          </div>
        </div>

        <div className={`${styles.floatingCard} ${styles.portfolio}`}>
          <div className={styles.portfolioIcon}>
            <FileCheck2 size={23} />
          </div>
          <div>
            <span className={styles.portfolioLabel}>TU PRIMER PROYECTO</span>
            <strong>Muéstralo.</strong>
            <small>Tu proceso también cuenta.</small>
          </div>
        </div>

        <span className={`${styles.spark} ${styles.sparkOne}`} />
        <span className={`${styles.spark} ${styles.sparkTwo}`} />
        <span className={styles.dot} />
      </div>
      <div className={styles.sceneFooter}>
        <figcaption>De una idea a algo que puedes mostrar.</figcaption>
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
