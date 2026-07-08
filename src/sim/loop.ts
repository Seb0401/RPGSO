/**
 * EL CORAZÓN DEL MUNDO — bucle de simulación por ticks.
 *
 * Un "tick" es la unidad atómica de tiempo del mundo simulado: nada ocurre
 * "entre" dos ticks. Todo lo que exista después (procesos, scheduler, timer,
 * dispositivos) vivirá suscrito a este latido.
 *
 * REGLA SAGRADA: esta clase es PURA. No conoce el reloj real, ni el DOM, ni
 * setInterval. Solo sabe contar y avisar. Gracias a eso la simulación es
 * determinista: la misma secuencia de llamadas produce exactamente la misma
 * historia, siempre. (La conexión con el tiempo real vive en driver.ts.)
 */

/** Un suscriptor del latido: recibe el número del tick que acaba de ocurrir. */
export type TickCallback = (tick: number) => void;

export class SimLoop {
  /** Tick actual del mundo. 0 = el mundo aún no ha latido nunca. */
  private tick = 0;

  /** Suscriptores, en orden de registro. */
  private listeners: TickCallback[] = [];

  getTick(): number {
    return this.tick;
  }

  /** Registra un suscriptor que será llamado en cada tick futuro. */
  onTick(cb: TickCallback): void {
    this.listeners.push(cb);
  }

  /** Hace latir el mundo exactamente una vez y notifica a los suscriptores
   *  en orden de registro. El primer latido de la historia es el tick 1. */
  step(): void {
    this.tick += 1;
    for (const cb of this.listeners) {
      cb(this.tick);
    }
  }

  /** Avanza n latidos completos. Solo cuentan los ticks enteros: el driver
   *  puede pedir cantidades fraccionarias y la fracción no late. */
  advance(n: number): void {
    const whole = Math.floor(n);
    for (let i = 0; i < whole; i++) {
      this.step();
    }
  }
}
