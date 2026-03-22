/* =========================================
   ROMANTIC PROPOSAL SITE — script.js
   Clean, commented, mobile-first (iOS)
   ========================================= */

// ── Estado global ──────────────────────────────────────────
let currentStep = 0;        // 0 = intro, 1-5 = etapas, 6 = final
let musicStarted = false;   // música já foi iniciada?
let musicPlaying = false;   // música tocando agora?

// URL do embed Spotify (Cidade Vizinha — ajuste o track ID se necessário)
const SPOTIFY_SRC =
  'https://open.spotify.com/embed/track/2YJAIDwnezLX52s3ZBPyC7?utm_source=generator&theme=0&autoplay=1';

// Frase especial que será digitada na etapa 3
const SPECIAL_PHRASE = 'já tá podendo te pedir em namoro, princesa?';

// ── Corações flutuantes (fundo) ────────────────────────────
const HEART_EMOJIS = ['💕', '💗', '💖', '💓', '🌹', '✨', '🌸'];

function spawnHeart(container) {
  const el = document.createElement('span');
  el.classList.add('heart-particle');
  el.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  el.style.left      = Math.random() * 100 + 'vw';
  el.style.fontSize  = (0.9 + Math.random() * 1.4) + 'rem';
  el.style.animationDuration = (6 + Math.random() * 10) + 's';
  el.style.animationDelay   = (Math.random() * 4) + 's';
  container.appendChild(el);

  // Remove do DOM após a animação para economizar memória
  el.addEventListener('animationend', () => el.remove());
}

function startHeartsBg() {
  const bg = document.getElementById('heartsBg');
  if (!bg) return;

  // Inicializa com alguns corações já na tela
  for (let i = 0; i < 8; i++) spawnHeart(bg);

  // Continua gerando corações periodicamente
  setInterval(() => spawnHeart(bg), 1400);
}

// ── Início da jornada (clique no botão "Abrir") ─────────────
function startJourney() {
  vibrate(30);
  goToScreen('screen-1', 'screen-intro');
  currentStep = 1;
}

// ── Avança para a próxima etapa ─────────────────────────────
function nextStep(step) {
  vibrate(25);
  triggerButtonEffect(event);

  // Inicia música após o primeiro clique em "Sim"
  if (!musicStarted) {
    initMusic();
    musicStarted = true;
  }

  const nextScreenId = 'screen-' + (step + 1);
  const currentScreenId = 'screen-' + step;

  if (step < 5) {
    goToScreen(nextScreenId, currentScreenId);
    currentStep = step + 1;

    // Se entrou na etapa 3, inicia o efeito de digitação
    if (step + 1 === 3) {
      setTimeout(typePhrase, 400);
    }
  }
}

// ── Tela final ──────────────────────────────────────────────
function finalStep() {
  vibrate([40, 30, 40, 30, 80]);
  triggerButtonEffect(event);

  goToScreen('screen-final', 'screen-5');
  currentStep = 6;

  // Lança corações extras na tela final
  setTimeout(startFinalHearts, 400);

  // Esconde o FAB de música (o player já está na tela final)
  const fab = document.getElementById('musicFab');
  if (fab) fab.classList.add('hidden');
}

// ── Transição entre telas ───────────────────────────────────
function goToScreen(nextId, currentId) {
  const current = document.getElementById(currentId);
  const next    = document.getElementById(nextId);

  if (!next) return;

  // Animação de saída
  if (current) {
    current.classList.add('exit-left');
    setTimeout(() => {
      current.classList.remove('active', 'exit-left');
    }, 650);
  }

  // Leve delay para a entrada parecer suave
  setTimeout(() => {
    next.classList.add('active');
    // Scroll para o topo da próxima tela (iOS)
    next.scrollTop = 0;
  }, 80);
}

// ── Efeito de digitação (etapa 3) ───────────────────────────
function typePhrase() {
  const el = document.getElementById('typedPhrase');
  if (!el) return;

  el.innerHTML = '';
  let i = 0;

  // Adiciona cursor piscante
  const cursor = document.createElement('span');
  cursor.classList.add('cursor');
  el.appendChild(cursor);

  const interval = setInterval(() => {
    if (i < SPECIAL_PHRASE.length) {
      // Insere o caractere antes do cursor
      el.insertBefore(document.createTextNode(SPECIAL_PHRASE[i]), cursor);
      i++;
    } else {
      clearInterval(interval);
      // Remove o cursor após 2s
      setTimeout(() => cursor.remove(), 2000);
    }
  }, 55); // velocidade de digitação (ms por caractere)
}

// ── Música — inicialização ──────────────────────────────────
function initMusic() {
  const fab     = document.getElementById('musicFab');
  const iframe  = document.getElementById('spotifyHidden');

  if (!fab || !iframe) return;

  // Mostra o FAB
  fab.classList.remove('hidden');

  // Carrega o embed com autoplay (funciona no iOS após gesto do usuário)
  iframe.src = SPOTIFY_SRC;
  musicPlaying = true;
  updateFabIcon();
}

// ── Música — toggle play/pause ──────────────────────────────
function toggleMusic() {
  vibrate(20);
  const iframe = document.getElementById('spotifyHidden');
  if (!iframe) return;

  if (musicPlaying) {
    // Para: recarrega sem autoplay (não há API para pause no embed básico)
    iframe.src = SPOTIFY_SRC.replace('&autoplay=1', '');
    musicPlaying = false;
  } else {
    iframe.src = SPOTIFY_SRC;
    musicPlaying = true;
  }
  updateFabIcon();
}

function updateFabIcon() {
  const icon  = document.getElementById('fabIcon');
  const label = document.getElementById('fabLabel');
  if (!icon || !label) return;

  if (musicPlaying) {
    icon.textContent  = '🎵';
    label.textContent = 'Pausar';
  } else {
    icon.textContent  = '🎶';
    label.textContent = 'Tocar';
  }
}

// ── Corações na tela final ──────────────────────────────────
function startFinalHearts() {
  const container = document.getElementById('finalHearts');
  if (!container) return;

  const bigEmojis = ['❤️', '💕', '💗', '💖', '💓', '🌹', '💑', '✨'];
  let count = 0;

  const burst = setInterval(() => {
    const el = document.createElement('span');
    el.classList.add('heart-particle');
    el.textContent = bigEmojis[Math.floor(Math.random() * bigEmojis.length)];
    el.style.left            = Math.random() * 100 + 'vw';
    el.style.fontSize        = (1.2 + Math.random() * 2.2) + 'rem';
    el.style.animationDuration = (5 + Math.random() * 8) + 's';
    el.style.animationDelay   = '0s';
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());

    count++;
    if (count > 40) clearInterval(burst); // para de criar depois de 40
  }, 180);

  // Continua com fluxo contínuo após o burst inicial
  setTimeout(() => {
    setInterval(() => {
      const el = document.createElement('span');
      el.classList.add('heart-particle');
      el.textContent = bigEmojis[Math.floor(Math.random() * bigEmojis.length)];
      el.style.left            = Math.random() * 100 + 'vw';
      el.style.fontSize        = (1 + Math.random() * 1.8) + 'rem';
      el.style.animationDuration = (7 + Math.random() * 10) + 's';
      el.style.animationDelay   = (Math.random() * 2) + 's';
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, 600);
  }, 7000);
}

// ── Efeito de ripple + vibração ao clicar em botões ─────────
function triggerButtonEffect(e) {
  if (!e || !e.target) return;

  const btn = e.target.closest('button');
  if (!btn) return;

  // Ripple visual
  const circle = document.createElement('span');
  const rect   = btn.getBoundingClientRect();
  const x      = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y      = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  const size   = Math.max(rect.width, rect.height) * 2;

  circle.style.cssText = `
    position: absolute;
    width: ${size}px; height: ${size}px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transform-origin: center;
    top: ${y - size / 2}px; left: ${x - size / 2}px;
    pointer-events: none;
    animation: ripple 0.5s linear forwards;
  `;
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 520);
}

// ── Vibração (haptic feedback) — iOS & Android ──────────────
function vibrate(pattern) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(Array.isArray(pattern) ? pattern : [pattern]);
    }
  } catch (_) {
    // Ignora silenciosamente se não suportado
  }
}

// ── Previne scroll bouncing no iOS ─────────────────────────
function preventIosBounce() {
  document.addEventListener('touchmove', (e) => {
    // Permite scroll dentro de elementos scrolláveis
    if (e.target.closest('.screen-inner')) return;
    e.preventDefault();
  }, { passive: false });
}

// ── Adiciona o CSS de ripple dinamicamente ──────────────────
function injectRippleStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      from { transform: scale(0); opacity: 0.6; }
      to   { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ── Registra cliques para o ripple em todos os botões ───────
function bindButtonEffects() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-sim, .btn-start')) {
      triggerButtonEffect(e);
    }
  });
  // Suporte a touch (iOS)
  document.addEventListener('touchstart', () => {}, { passive: true });
}

// ── Inicialização ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  startHeartsBg();
  preventIosBounce();
  injectRippleStyle();
  bindButtonEffects();

  // Garante que apenas a intro esteja ativa no início
  document.getElementById('screen-intro').classList.add('active');
});
