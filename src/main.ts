import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <main class="genesis">
    <h1>RPGSO <span class="gear">⚙️</span></h1>
    <p class="subtitle">Simulador educativo de sistema operativo</p>
    <p class="status">Fase 0 — Génesis del laboratorio. El mundo aún no tiene tiempo.</p>
  </main>
`;
