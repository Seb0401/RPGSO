/**
 * EL DIRECTOR DE ORQUESTA — traduce tiempo real a tiempo simulado.
 *
 * El SimLoop es puro: solo avanza cuando alguien lo empuja. Este Driver es
 * quien lo empuja al ritmo que el usuario elija (ticks por segundo), usando
 * requestAnimationFrame (~60 llamadas/segundo cuando la pestaña es visible).
 *
 * Los frames del navegador no llegan a intervalos exactos y casi nunca
 * coinciden con la duración de un tick: a 10 t/s un tick dura ~6 frames y la
 * mayoría de los frames no deben disparar ninguno; a velocidad turbo cada
 * frame debe disparar varios. La solución es el patrón del ACUMULADOR (el
 * mismo de los motores de videojuegos): cada frame convierte los ms reales
 * transcurridos a ticks fraccionarios, los acumula, dispara solo los enteros
 * y conserva la fracción para el frame siguiente.
 */

import type { SimLoop } from './loop';

/** Tope de ticks por frame: si la pestaña estuvo congelada 30 segundos no
 *  queremos disparar decenas de miles de ticks de golpe y congelar el
 *  navegador. El atraso que supere el tope se descarta. */
const MAX_TICKS_PER_FRAME = 1000;

export class Driver {
  private running = false;
  private ticksPerSecond = 10;

  /** Ticks fraccionarios pendientes de disparar (patrón del acumulador). */
  private accumulator = 0;

  /** Timestamp del frame anterior (ms), o null recién arrancado/pausado. */
  private lastTimestamp: number | null = null;

  /** Id de requestAnimationFrame, para poder cancelarlo al pausar. */
  private rafId: number | null = null;

  constructor(private readonly loop: SimLoop) {}

  isRunning(): boolean {
    return this.running;
  }

  getSpeed(): number {
    return this.ticksPerSecond;
  }

  /** Cambia la velocidad (ticks/segundo) incluso en caliente. Ignora
   *  valores no positivos o no finitos. */
  setSpeed(tps: number): void {
    if (!Number.isFinite(tps) || tps <= 0) return;
    this.ticksPerSecond = tps;
  }

  /** Pone el mundo en marcha. Idempotente. */
  play(): void {
    if (this.running) return;
    this.running = true;
    // El primer frame tras un play no sabe cuánto tiempo real pasó:
    // solo anota su timestamp, sin disparar ticks.
    this.lastTimestamp = null;
    this.rafId = requestAnimationFrame(this.frame);
  }

  /** Congela el mundo. Idempotente. Los ticks fraccionarios pendientes se
   *  descartan: al reanudar, el tiempo empieza limpio. */
  pause(): void {
    if (!this.running) return;
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.accumulator = 0;
    this.lastTimestamp = null;
  }

  /** Avanza exactamente un tick. Solo en pausa (depuración paso a paso). */
  stepOnce(): void {
    if (this.running) return;
    this.loop.step();
  }

  // Arrow function: al pasarla como callback a requestAnimationFrame se
  // invoca sin receptor, y una función normal perdería su `this`.
  private frame = (now: number): void => {
    if (!this.running) return;

    if (this.lastTimestamp === null) {
      this.lastTimestamp = now;
    } else {
      const elapsedMs = now - this.lastTimestamp;
      this.lastTimestamp = now;

      this.accumulator += (elapsedMs * this.ticksPerSecond) / 1000;
      let whole = Math.floor(this.accumulator);
      if (whole > MAX_TICKS_PER_FRAME) {
        whole = MAX_TICKS_PER_FRAME;
        this.accumulator = 0; // el atraso excedente se pierde a propósito
      } else {
        this.accumulator -= whole; // la fracción sobrevive al frame
      }

      if (whole > 0) {
        this.loop.advance(whole);
      }
    }

    this.rafId = requestAnimationFrame(this.frame);
  };
}
