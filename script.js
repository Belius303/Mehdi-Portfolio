// Sélection des éléments du DOM
const header = document.querySelector('header');
const workSection = document.getElementById('work-section');
const logoContainer = document.querySelector('.logo-container');

let lastScrollTop = 0;

// Gestion du scroll pour la navbar
function handleNavbarScroll() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 50) {
        // Scroll vers le bas
        header.classList.add('hidden');
    } else {
        // Scroll vers le haut
        header.classList.remove('hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Défilement fluide vers la section des projets
function scrollToProjects() {
    if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Gestion du clic sur le logo et "Mehdi Imani"
logoContainer.addEventListener('click', scrollToProjects);

// Défilement fluide vers la section des projets pour le lien "Projets"
const projectsLink = document.querySelector('a[href="#work-section"]');
if (projectsLink) {
    projectsLink.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToProjects();
    });
}

// Gestion de la navigation active
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if ((currentPath.includes('index.html') || currentPath === '/') && link.getAttribute('href') === '#work-section') {
            link.classList.add('active');
        } else if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }

        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Fonctionnalité d'agrandissement des images
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.getElementById('close-modal');
    const zoomableImages = document.querySelectorAll('.zoomable-image');

    if (modal && modalImg && closeBtn) {
        zoomableImages.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'block';
                modalImg.src = img.src;
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

// Ajout de l'effet de fondu pour les changements de page
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('target') !== '_blank' && !this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const href = this.getAttribute('href');
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });
});

// Effet de fondu à l'entrée de la page
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.body.style.opacity = '0';
    }
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
});

function animateHeadings() {
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach(heading => {
        const text = heading.textContent;
        heading.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${i * 0.1}s`;
            if (char === ' ') {
                span.style.width = '0.3em';
                span.style.display = 'inline-block';
            }
            heading.appendChild(span);
        });
    });
}

// Call animateHeadings on DOMContentLoaded
document.addEventListener('DOMContentLoaded', animateHeadings);

// Add scroll event listener to window
window.addEventListener('scroll', handleNavbarScroll);

// Add this function to handle responsive navigation
function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.classList.add('mobile-nav-toggle');
    mobileNavToggle.innerHTML = '&#9776;'; // Hamburger icon
    mobileNavToggle.addEventListener('click', toggleMobileNav);
    
    const navbar = document.querySelector('.navbar');
    navbar.insertBefore(mobileNavToggle, navbar.firstChild);
});


// Define colors for each video
const videoColors = {
    1: '#253f4b', // Orange rougeâtre
    2: '#5d455f', // Bleu
    3: '#804040', // Rose
    5: '#8f8b66',  // Violet
    5: '#537d90',
    6:'#5d455f',
    7:'#253f4b'
};

// Function to change background and navbar color based on visible video
function changeColors() {
    const videos = document.querySelectorAll('.work-item');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    const navbar = document.querySelector('header');

    videos.forEach(videoItem => {
        const rect = videoItem.getBoundingClientRect();
        if (rect.top < scrollPosition && rect.bottom > scrollPosition) {
            const videoId = videoItem.getAttribute('data-id');
            const color = videoColors[videoId];
            if (color) {
                document.body.style.backgroundColor = color;
                navbar.style.backgroundColor = color;
                // Adjust text color for better contrast
                if (isColorLight(color)) {
                    document.body.style.color = '#000';
                    navbar.style.color = '#000';
                } else {
                    document.body.style.color = '#fff';
                    navbar.style.color = '#fff';
                }
            }
        }
    });
}

// Helper function to determine if a color is light or dark
function isColorLight(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
}

// Add scroll event listener to change colors
window.addEventListener('scroll', changeColors);

// Initialize colors on page load
document.addEventListener('DOMContentLoaded', () => {
    // Existing DOMContentLoaded code...

    // Initialize colors
    if (window.location.pathname !== '/profil.html') {
        changeColors();
    }
});



