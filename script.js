// Navigation and Smooth Scrolling
class Navigation {
    static init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    static init() {
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section');
            sections.forEach((section) => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (sectionTop < windowHeight * 0.75) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }
            });
        });
    }
}

// Tech Stack Filter
class TechStackFilter {
    constructor() {
        this.activeFilter = null;
        this.skillTags = document.querySelectorAll('.skill-tag[data-tech]');
        this.projectCards = document.querySelectorAll('.project-card[data-tech]');
        this.filterMessage = document.getElementById('filterMessage');
        this.init();
    }

    init() {
        this.skillTags.forEach(tag => {
            // Make tags keyboard accessible
            tag.setAttribute('tabindex', '0');
            tag.setAttribute('role', 'button');
            tag.setAttribute('aria-label', `Filter projects by ${tag.getAttribute('data-tech')}`);
            
            tag.addEventListener('click', () => {
                const tech = tag.getAttribute('data-tech');
                this.filterProjects(tech, tag);
            });
            
            tag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tech = tag.getAttribute('data-tech');
                    this.filterProjects(tech, tag);
                }
            });
        });
    }

    filterProjects(tech, clickedTag) {
        // Toggle active state
        if (this.activeFilter === tech) {
            // Reset filter
            this.activeFilter = null;
            this.skillTags.forEach(t => t.classList.remove('active'));
            this.projectCards.forEach(card => card.classList.remove('hidden'));
            this.filterMessage.classList.remove('show');
        } else {
            // Apply filter
            this.activeFilter = tech;
            this.skillTags.forEach(t => t.classList.remove('active'));
            clickedTag.classList.add('active');
            
            let visibleCount = 0;
            this.projectCards.forEach(card => {
                const cardTechs = card.getAttribute('data-tech').split(',');
                const hasTech = cardTechs.some(t => t.trim() === tech);
                
                if (hasTech) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            // Show filter message with ARIA live region for screen readers
            this.filterMessage.setAttribute('role', 'status');
            this.filterMessage.setAttribute('aria-live', 'polite');
            if (visibleCount === 0) {
                this.filterMessage.textContent = `No projects found using ${tech}.`;
                this.filterMessage.classList.add('show');
            } else {
                this.filterMessage.textContent = `Showing ${visibleCount} project(s) using ${tech}.`;
                this.filterMessage.classList.add('show');
            }

            // Scroll to projects section
            document.getElementById('projects').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    ScrollAnimations.init();
    new TechStackFilter();
});
