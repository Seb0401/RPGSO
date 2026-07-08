# RPGSO 🏰⚙️

**Un sistema operativo simulado, construido para ser entendido.**

RPGSO es un simulador educativo de sistema operativo que corre en el navegador.
No arranca en hardware real: es una *computadora de fantasía* de cristal, donde
cada componente clásico de un OS —scheduler, gestión de memoria, memoria
virtual, interrupciones, llamadas al sistema, sistema de archivos, shell— está
implementado con los algoritmos reales y es **observable en tiempo real**.

## La idea

> Cada proceso es una entidad viva. La memoria es un territorio. Los procesos
> compiten por recursos. Y todo, absolutamente todo, se puede ver.

Los sistemas operativos reales son opacos: sus decisiones ocurren millones de
veces por segundo, en silencio. RPGSO invierte eso. El tiempo es simulado
(pausable, paso a paso, cámara lenta) y un dashboard —el **Observatorio**—
muestra en vivo:

- 🗺️ La memoria como territorio que los procesos conquistan y liberan
- 🐉 Los procesos como criaturas con estado, energía e historia
- 👑 El scheduler como árbitro que decide quién ocupa el Trono (la CPU)
- ⚡ Las interrupciones como mensajeros que irrumpen en la corte
- 📜 El disco como una Gran Biblioteca de bloques y catálogos

La capa RPG es narrativa; debajo están los datos técnicos reales: tablas de
páginas, PCBs, colas de planificación, inodos, métricas de fragmentación y
starvation.

## Estado

🚧 En construcción — Fase 0 (génesis del laboratorio).

| Fase | Componente | Estado |
|---|---|---|
| 0 | Núcleo de simulación por ticks + Observatorio base | 🔜 |
| 1 | Memoria física (first-fit, best-fit, fragmentación) | ⬜ |
| 2 | Procesos (PCB, ciclo de vida) | ⬜ |
| 3 | Scheduler (FIFO, Round Robin, MLFQ) | ⬜ |
| 4 | Interrupciones y E/S | ⬜ |
| 5 | Memoria virtual (paginación, fallos, reemplazo) | ⬜ |
| 6 | Llamadas al sistema | ⬜ |
| 7 | Sistema de archivos (inodos) | ⬜ |
| 8 | Shell | ⬜ |
| 9 | CPU de fantasía (ISA propia, cambio de contexto real) | ⬜ |
| 10 | Escenarios: deadlock, carreras, inanición, thrashing | ⬜ |

## Ejecutar

```bash
npm install
npm run dev
```

(Disponible a partir de la Fase 0.)

## Stack

TypeScript + Vite. El núcleo de simulación es una librería pura y determinista,
independiente de la UI: la interfaz gráfica solo observa.

## Propósito

Este es un proyecto de aprendizaje profundo de sistemas operativos. El código
prioriza claridad sobre astucia, y cada fase incluye comparaciones con cómo
resuelven el mismo problema Linux, Windows y otros sistemas reales.
