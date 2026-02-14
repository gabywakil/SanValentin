// ==========================================
// REPRODUCTOR DE MÚSICA MP3
// ==========================================
const audioPlayer = document.getElementById('audioPlayer');
const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const prevBtnMusic = document.getElementById('prevBtnMusic');
const nextBtnMusic = document.getElementById('nextBtnMusic');

// ==========================================
// PANTALLA DE INICIO
// ==========================================
// ==========================================
// PANTALLA DE INICIO (iPhone-friendly)
// ==========================================
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

let userActivatedAudio = false;

async function safePlay() {
  try {
    audioPlayer.muted = false;
    audioPlayer.volume = 1;

    // En iOS a veces ayuda “despertar” el audio recargando source
    if (audioPlayer.readyState < 2) audioPlayer.load();

    await audioPlayer.play();
    userActivatedAudio = true;

    // UI estado play
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    musicPlayer.classList.add('playing');

    return true;
  } catch (e) {
    console.warn('No pudo iniciar audio:', e);
    return false;
  }
}

startButton.addEventListener('click', async () => {
  // Oculta portada
  startScreen.classList.add('fade-out');
  setTimeout(() => (startScreen.style.display = 'none'), 500);

  // Arranca audio EN EL MISMO CLICK (clave iPhone)
  const ok = await safePlay();

  // Mostrar reproductor (siempre, aunque el audio falle)
  setTimeout(() => {
    musicPlayer.classList.add('visible');
  }, 700);

  if (!ok) {
    alert(
      "No se pudo reproducir el audio.\n\n" +
      "Revisa:\n" +
      "1) El archivo se llama EXACTO: cancion.mp3\n" +
      "2) Está en la misma carpeta que index.html\n" +
      "3) En GitHub Pages subiste también el mp3\n"
    );
  }
});

// Re-intentos “silenciosos” para mantener música de fondo
function keepAudioAlive() {
  if (!userActivatedAudio) return;

  // Si el navegador la pausa por cambio de pestaña / modo ahorro, reintenta
  if (audioPlayer.paused) {
    audioPlayer.play().catch(() => {});
  }
}

// Cuando vuelves a la página (iOS Safari)
window.addEventListener('pageshow', keepAudioAlive);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') keepAudioAlive();
});

// Primer toque extra por si iOS se pone raro
document.addEventListener(
  'touchstart',
  () => {
    keepAudioAlive();
  },
  { passive: true }
);

// ==========================================
// CONTROLES DEL REPRODUCTOR
// ==========================================

// Play/Pause
playPauseBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    musicPlayer.classList.add('playing');
  } else {
    audioPlayer.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    musicPlayer.classList.remove('playing');
  }
});

// Actualizar barra de progreso
audioPlayer.addEventListener('timeupdate', () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressFill.style.width = progress + '%';
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

// Actualizar duración total
audioPlayer.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audioPlayer.duration);
});

// Click en barra de progreso
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Cerrar reproductor (PERO LA MÚSICA SIGUE SONANDO)
closePlayerBtn.addEventListener('click', () => {
  musicPlayer.classList.remove('visible');
  // Mostrar botón flotante
  document.getElementById('floatingMusicBtn').style.display = 'flex';
  // NO pausamos el audio, solo ocultamos el reproductor
});

// Botón flotante para mostrar reproductor de nuevo
document.getElementById('floatingMusicBtn').addEventListener('click', () => {
  musicPlayer.classList.add('visible');
  document.getElementById('floatingMusicBtn').style.display = 'none';
});

// Shuffle toggle (visual)
shuffleBtn.addEventListener('click', () => {
  shuffleBtn.classList.toggle('active');
});

// Repeat ya está activado por defecto
repeatBtn.classList.add('active');
audioPlayer.loop = true;

// Botones prev/next
prevBtnMusic.addEventListener('click', () => {
  audioPlayer.currentTime = 0;
});

nextBtnMusic.addEventListener('click', () => {
  audioPlayer.currentTime = 0;
  audioPlayer.play();
});

// Actualizar estado del reproductor cuando el audio se reproduce
audioPlayer.addEventListener('play', () => {
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  musicPlayer.classList.add('playing');
});

audioPlayer.addEventListener('pause', () => {
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
  musicPlayer.classList.remove('playing');
});

// Formatear tiempo
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==========================================
// PARTÍCULAS DE CORAZONES
// ==========================================
function createHeartParticles() {
  const container = document.getElementById('particles');
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particle.innerHTML = '♥';
    container.appendChild(particle);
  }
}

createHeartParticles();

// ==========================================
// ANIMACIONES DE SCROLL
// ==========================================
const observerOptions = {
  threshold: 0.3,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observar todas las secciones con animaciones
document.querySelectorAll('.slide-up, .fade-in').forEach(el => {
  observer.observe(el);
});

// ==========================================
// CARRUSEL
// ==========================================
const discoverBtn = document.getElementById('discoverBtn');
const carouselSection = document.getElementById('carouselSection');
const closeCarousel = document.getElementById('closeCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');

let currentSlide = 0;
const totalSlides = 4;
let autoPlayInterval;

// Mostrar carrusel
discoverBtn.addEventListener('click', () => {
  carouselSection.classList.remove('hidden');
  carouselSection.classList.add('visible');
  document.body.style.overflow = 'hidden';
  setTimeout(() => startAutoPlay(), 1000);
});

// Cerrar carrusel
closeCarousel.addEventListener('click', () => {
  carouselSection.classList.remove('visible');
  carouselSection.classList.add('hidden');
  document.body.style.overflow = 'auto';
  stopAutoPlay();
});

// Función para actualizar slide
function updateSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.remove('active');
    if (i === index) {
      dot.classList.add('active');
    }
  });

  currentSlide = index;
}

// Navegación
prevBtn.addEventListener('click', () => {
  stopAutoPlay();
  const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlide(newIndex);
  setTimeout(startAutoPlay, 3000);
});

nextBtn.addEventListener('click', () => {
  stopAutoPlay();
  const newIndex = (currentSlide + 1) % totalSlides;
  updateSlide(newIndex);
  setTimeout(startAutoPlay, 3000);
});

// Dots
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    stopAutoPlay();
    const slideIndex = parseInt(dot.getAttribute('data-slide'));
    updateSlide(slideIndex);
    setTimeout(startAutoPlay, 3000);
  });
});

// Auto-play
function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    const newIndex = (currentSlide + 1) % totalSlides;
    updateSlide(newIndex);
  }, 3500);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

// ==========================================
// EFECTOS ADICIONALES
// ==========================================

// Parallax suave en el scroll
const scrollContainer = document.getElementById('scrollContainer');
scrollContainer.addEventListener('scroll', () => {
  const scrolled = scrollContainer.scrollTop;
  const hearts = document.querySelectorAll('.heart-float');
  hearts.forEach((heart, index) => {
    const speed = 0.5 + (index * 0.2);
    heart.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Prevenir scroll cuando el carrusel está abierto
carouselSection.addEventListener('wheel', (e) => {
  e.preventDefault();
}, { passive: false });

carouselSection.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchstart', () => {
    if (audioPlayer && audioPlayer.paused) {
      audioPlayer.play().catch(()=>{});
    }
  }, { once: true });