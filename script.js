// Sélection des éléments du DOM
const header = document.querySelector('header');
const workSection = document.getElementById('work-section');
const workDetail = document.getElementById('work-detail');
const workItems = document.querySelectorAll('.work-item');
const workDetailTitle = workDetail.querySelector('.work-detail-title');
const workDetailDescription = workDetail.querySelector('.work-detail-description');
const workDetailContent = workDetail.querySelector('.work-content');
const prevProjectBtn = workDetail.querySelector('.prev-project');
const nextProjectBtn = workDetail.querySelector('.next-project');
const logoContainer = document.querySelector('.logo-container');

let currentProjectId = 0;
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

// Fonction pour afficher un projet avec animation
function showProject(id) {
    currentProjectId = id;
    const project = workItems[id - 1];
    const video = project.querySelector('video');

    workDetail.style.opacity = '0';
    setTimeout(() => {
        workDetailTitle.textContent = project.querySelector('.work-title').textContent;
        workDetailDescription.textContent = 'Description de la vidéo ' + id + '. Remplacez ce texte par la description réelle de chaque vidéo.';

        const videoClone = video.cloneNode(true);
        videoClone.controls = true;
        workDetailContent.innerHTML = '';
        workDetailContent.appendChild(videoClone);

        updateNavigationButtons();
        workDetail.style.opacity = '1';
    }, 300);
}

// Fermeture du détail du projet avec animation
function closeProjectDetail() {
    workDetail.style.opacity = '0';
    setTimeout(() => {
        workDetail.style.display = 'none';
        workSection.style.display = 'block';
        workSection.style.opacity = '0';
        setTimeout(() => {
            workSection.style.opacity = '1';
        }, 50);
        window.removeEventListener('scroll', handleNavbarScroll);
    }, 300);
}

// Ajout des écouteurs d'événements pour chaque élément de travail
workItems.forEach(item => {
    item.addEventListener('click', () => {
        const projectId = parseInt(item.dataset.id);
        workSection.style.opacity = '0';
        setTimeout(() => {
            workSection.style.display = 'none';
            workDetail.style.display = 'block';
            showProject(projectId);
            window.addEventListener('scroll', handleNavbarScroll);
        }, 300);
    });
});

// Mise à jour des boutons de navigation
function updateNavigationButtons() {
    if (currentProjectId === 1) {
        prevProjectBtn.style.display = 'none';
        nextProjectBtn.style.display = 'block';
        nextProjectBtn.classList.add('single');
    } else if (currentProjectId === workItems.length) {
        prevProjectBtn.style.display = 'block';
        nextProjectBtn.style.display = 'none';
        prevProjectBtn.classList.remove('single');
    } else {
        prevProjectBtn.style.display = 'block';
        nextProjectBtn.style.display = 'block';
        nextProjectBtn.classList.remove('single');
    }
}

// Gestion des clics sur les boutons de navigation
prevProjectBtn.addEventListener('click', () => {
    if (currentProjectId > 1) {
        showProject(currentProjectId - 1);
    }
});

nextProjectBtn.addEventListener('click', () => {
    if (currentProjectId < workItems.length) {
        showProject(currentProjectId + 1);
    }
});

// Défilement fluide vers la section des projets et fermeture du détail
function scrollToProjects() {
    closeProjectDetail();
    setTimeout(() => {
        workSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// Gestion du clic sur le logo et "Mehdi Imani"
logoContainer.addEventListener('click', scrollToProjects);

// Défilement fluide vers la section des projets pour le lien "Projets"
document.querySelector('a[href="#work-section"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToProjects();
});

// Gestion de la navigation active
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath === '/' && link.getAttribute('href') === '#work-section')) {
            link.classList.add('active');
        }

        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Fermeture du détail du projet avec la touche Echap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && workDetail.style.display === 'block') {
        closeProjectDetail();
    }
});

// Ajout de l'effet de fondu pour les changements de page
document.querySelectorAll('a, .logo-container').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('target') !== '_blank' && 
            (this.tagName === 'A' && !this.getAttribute('href').startsWith('#')) || 
            this.classList.contains('logo-container')) {
            e.preventDefault();
            const href = this.getAttribute('href') || 'index.html';
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

// Modify the handleNavbarScroll function
function handleNavbarScroll() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 50) {
        // Scroll down
        header.classList.add('hidden');
    } else {
        // Scroll up
        header.classList.remove('hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Add scroll event listener to window
window.addEventListener('scroll', handleNavbarScroll);

// Remove the workDetail scroll event listener and use the global one instead
workDetail.removeEventListener('scroll', handleWorkDetailScroll);