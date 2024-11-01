document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-image");
    const videoModal = document.getElementById("video-modal");
    const modalVideo = document.getElementById("modal-video");
    const closeBtns = document.querySelectorAll(".close-modal");
    const zoomableImages = document.querySelectorAll(".zoomable-image");
    const logo = document.querySelector(".logo");
    const downloadBtn = document.getElementById("download-btn");
    const cvContainer = document.querySelector(".cv-container");
    const aboutMeContainer = document.querySelector(".about-me-container");
    const prismContainer = document.querySelector(".prism-container");
    const prisms = document.querySelectorAll(".prism");
  
    function getRadius() {
      if (window.innerWidth >= 1024) return 220;
      if (window.innerWidth >= 768) return 150;
      return 100;
    }
  
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
      element.style.display = "flex";
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
  
    async function toggleView() {
      if (
        prismContainer.style.display === "none" ||
        prismContainer.style.display === ""
      ) {
        await Promise.all([fadeOut(cvContainer), fadeOut(aboutMeContainer)]);
        setTimeout(showPrisms, 500);
      } else {
        await hidePrisms();
        await Promise.all([fadeIn(cvContainer), fadeIn(aboutMeContainer)]);
      }
    }
  
    logo.addEventListener("click", toggleView);
  
    function showPrisms() {
      prismContainer.style.display = "block";
      const angles = [0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5];
      const radius = 220;
  
      prisms.forEach((prism, index) => {
        const angle = angles[index] * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
  
        prism.style.setProperty("--translateX", `${x}px`);
        prism.style.setProperty("--translateY", `${y}px`);
        prism.style.setProperty("--rotation", `${angles[index]}deg`);
  
        setTimeout(() => {
          prism.classList.add("active");
          prism.classList.remove("inactive");
          prism.querySelector("video").play();
        }, index * 100);
      });
    }
  
    function hidePrisms() {
      return new Promise((resolve) => {
        prisms.forEach((prism, index) => {
          setTimeout(() => {
            prism.classList.remove("active");
            prism.classList.add("inactive");
            prism.querySelector("video").pause();
          }, index * 100);
        });
  
        setTimeout(
          () => {
            prismContainer.style.display = "none";
            resolve();
          },
          prisms.length * 100 + 500,
        );
      });
    }
  
    zoomableImages.forEach((img) => {
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src;
        if (img.classList.contains("cv-image")) {
          downloadBtn.style.display = "block";
          downloadBtn.href = img.src;
        } else {
          downloadBtn.style.display = "none";
        }
      });
    });
  
    prisms.forEach((prism) => {
      prism.addEventListener("click", (e) => {
        e.stopPropagation();
        const video = prism.querySelector("video");
        videoModal.style.display = "block";
        modalVideo.src = video.src;
        modalVideo.play();
      });
    });
  
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.style.display = "none";
        videoModal.style.display = "none";
        modalVideo.pause();
      });
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
      if (e.target === videoModal) {
        videoModal.style.display = "none";
        modalVideo.pause();
      }
    });
  
    // Page transition effect
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 50);
  });
  