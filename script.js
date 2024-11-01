document.addEventListener("DOMContentLoaded", () => {
  const projectsImage = document.querySelector(".projects-image");
  const cvLinkImage = document.querySelector(".cv-link-image");
  const aboutMeModal = document.querySelector(".about-me-modal");
  const cvModal = document.querySelector(".cv-modal");
  const closeButtons = document.querySelectorAll(".close-btn");
  const modals = document.querySelectorAll(".modal");
  const logo = document.querySelector(".logo");
  const videoCarousel = document.querySelector(".video-carousel");
  const videoContainer = document.querySelector(".video-container");
  let projectsMode = false;

  // Amélioration de la fermeture des modales
  function closeModal(modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }

  // Gestionnaire de clic pour le logo (about me)
  logo.addEventListener("click", () => {
    aboutMeModal.style.display = "flex";
    aboutMeModal.classList.add("active");
  });

  // Gestionnaire de clic pour le CV
  cvLinkImage.addEventListener("click", () => {
    cvModal.style.display = "flex";
    cvModal.classList.add("active");
  });

  // Fermeture améliorée avec les boutons X
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      closeModal(modal);
    });
  });

  // Fermeture améliorée en cliquant sur l'arrière-plan
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Configuration améliorée du carrousel de vidéos
  function setupVideoCarousel() {
    const videos = document.querySelectorAll(".video-item");
    let currentIndex = 0;
    const totalVideos = videos.length;

    function updateCarousel() {
      videos.forEach((video, index) => {
        const offset = index - currentIndex;
        const theta = (offset / totalVideos) * 2 * Math.PI;
        const radius = 800;
        
        const x = Math.sin(theta) * radius;
        const z = (Math.cos(theta) * radius) - radius;
        
        const scale = index === currentIndex ? 1.2 : 0.7;
        const zIndex = index === currentIndex ? 10 : 1;

        video.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale})`;
        video.style.zIndex = zIndex;

        // Gestion améliorée de la lecture vidéo
        const videoElement = video.querySelector("video");
        
        if (index === currentIndex) {
            video.classList.add("active");
            // S'assurer que la vidéo est chargée avant de la lire
            if (videoElement.readyState >= 2) {
                videoElement.play().catch(err => {
                    console.log("Erreur de lecture:", err);
                    // Tentative de relecture après un court délai
                    setTimeout(() => videoElement.play(), 100);
                });
            } else {
                videoElement.addEventListener('loadeddata', () => {
                    videoElement.play().catch(err => console.log("Erreur de lecture après chargement:", err));
                });
            }
        } else {
            video.classList.remove("active");
            videoElement.pause();
            videoElement.currentTime = 0;
        }
      });
    }

    // Navigation améliorée
    function nextVideo() {
      currentIndex = (currentIndex + 1) % totalVideos;
      updateCarousel();
    }

    function prevVideo() {
      currentIndex = (currentIndex - 1 + totalVideos) % totalVideos;
      updateCarousel();
    }

    // Gestionnaires d'événements pour la navigation
    document.addEventListener("keydown", (e) => {
      if (projectsMode) {
        if (e.key === "ArrowRight") nextVideo();
        if (e.key === "ArrowLeft") prevVideo();
      }
    });

    // Navigation par clic
    videos.forEach((video, index) => {
      video.addEventListener("click", () => {
        if (index !== currentIndex) {
          currentIndex = index;
          updateCarousel();
        }
      });
    });

    // Navigation tactile améliorée
    let touchStartX = 0;
    let touchStartTime = 0;
    
    videoCarousel.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    }, { passive: true });

    videoCarousel.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndTime = Date.now();
      
      const diff = touchStartX - touchEndX;
      const timeDiff = touchEndTime - touchStartTime;
      
      // Vérification de la vitesse et de la distance du swipe
      if (Math.abs(diff) > 50 && timeDiff < 300) {
        if (diff > 0) nextVideo();
        else prevVideo();
      }
    }, { passive: true });

    // Ajout de la navigation à la souris
    let isDragging = false;
    let startX = 0;
    
    videoCarousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
    });

    videoCarousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextVideo();
        else prevVideo();
        isDragging = false;
      }
    });

    videoCarousel.addEventListener("mouseup", () => {
      isDragging = false;
    });

    videoCarousel.addEventListener("mouseleave", () => {
      isDragging = false;
    });

    // Initialisation du carrousel
    updateCarousel();
  }

  // Ajoutons une fonction pour précharger toutes les vidéos
  function preloadVideos() {
    const videoElements = document.querySelectorAll('.video-item video');
    videoElements.forEach(video => {
      video.load();
    });
  }

  // Gestionnaire pour Mes Projets
  projectsImage.addEventListener("click", async () => {
    if (!projectsMode) {
      projectsMode = true;
      // Précharger les vidéos avant d'afficher le carrousel
      preloadVideos();
      
      await Promise.all([
        fadeOut(cvLinkImage.parentElement),
        fadeOut(logo.parentElement),
        fadeOut(projectsImage.parentElement),
      ]);

      videoCarousel.style.display = "flex";
      setupVideoCarousel();
    } else {
      projectsMode = false;
      videoCarousel.style.display = "none";

      await Promise.all([
        fadeIn(cvLinkImage.parentElement),
        fadeIn(logo.parentElement),
        fadeIn(projectsImage.parentElement),
      ]);
    }
  });

  function fadeOut(element) {
    return new Promise((resolve) => {
      element.style.opacity = "1";
      (function fade() {
        if ((element.style.opacity -= 0.02) < 0) {
          element.style.display = "none";
          resolve();
        } else {
          requestAnimationFrame(fade);
        }
      })();
    });
  }

  function fadeIn(element) {
    element.style.opacity = "0";
    // Correction du display pour le container du logo
    if (element.classList.contains('logo-container')) {
        element.style.display = "flex";
    } else {
        element.style.display = element.tagName === "DIV" ? "block" : "flex";
    }
    
    return new Promise((resolve) => {
        (function fade() {
            var val = parseFloat(element.style.opacity);
            if (!((val += 0.02) > 1)) {
                element.style.opacity = val;
                requestAnimationFrame(fade);
            } else {
                resolve();
            }
        })();
    });
  }

  // Effet de transition de page
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 50);

  // Ajout des gestionnaires pour la flèche de retour
  const returnArrow = document.querySelector(".return-arrow");
  returnArrow.addEventListener("click", async () => {
    projectsMode = false;
    videoCarousel.style.display = "none";

    await Promise.all([
      fadeIn(cvLinkImage.parentElement),
      fadeIn(logo.parentElement),
      fadeIn(projectsImage.parentElement),
    ]);
  });

  // Gestion du plein écran des vidéos
  const videoFullscreenModal = document.querySelector(".video-fullscreen-modal");
  const fullscreenVideo = videoFullscreenModal.querySelector("video");
  const fullscreenClose = document.querySelector(".video-fullscreen-close");

  // Ouvrir la vidéo en plein écran
  document.querySelectorAll(".video-item").forEach(item => {
    item.addEventListener("click", () => {
      const video = item.querySelector("video");
      fullscreenVideo.src = video.src;
      videoFullscreenModal.style.display = "flex";
      fullscreenVideo.play();
    });
  });

  // Fermer la vidéo plein écran
  function closeFullscreenVideo() {
    videoFullscreenModal.style.display = "none";
    fullscreenVideo.pause();
    fullscreenVideo.src = "";
  }

  fullscreenClose.addEventListener("click", closeFullscreenVideo);
  videoFullscreenModal.addEventListener("click", (e) => {
    if (e.target === videoFullscreenModal) {
      closeFullscreenVideo();
    }
  });
});
