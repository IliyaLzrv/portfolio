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
        // Make hero section visible immediately
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('visible');
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all sections except hero
        document.querySelectorAll('section:not(.hero)').forEach(section => {
            observer.observe(section);
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
            this.filterMessage.classList.remove('show');
            
            // Smooth reveal of all cards
            this.projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('hidden');
                }, index * 30);
            });
        } else {
            // Apply filter
            this.activeFilter = tech;
            this.skillTags.forEach(t => t.classList.remove('active'));
            clickedTag.classList.add('active');
            
            // Count matching projects FIRST (synchronously)
            let visibleCount = 0;
            const matchingCards = [];
            
            this.projectCards.forEach((card) => {
                const cardTechs = card.getAttribute('data-tech').split(',');
                const hasTech = cardTechs.some(t => t.trim() === tech);
                
                if (hasTech) {
                    visibleCount++;
                    matchingCards.push(card);
                }
            });

            // Now apply animations with correct count
            this.projectCards.forEach((card, index) => {
                const cardTechs = card.getAttribute('data-tech').split(',');
                const hasTech = cardTechs.some(t => t.trim() === tech);
                
                // Stagger animations for smooth reveal
                setTimeout(() => {
                    if (hasTech) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }, index * 50);
            });

            // Show filter message with ARIA live region for screen readers
            this.filterMessage.setAttribute('role', 'status');
            this.filterMessage.setAttribute('aria-live', 'polite');
            
            // Show message with correct count (after a short delay for smooth animation)
            setTimeout(() => {
                if (visibleCount === 0) {
                    this.filterMessage.textContent = `No projects found using ${tech}.`;
                    this.filterMessage.classList.add('show');
                } else {
                    this.filterMessage.textContent = `Showing ${visibleCount} project(s) using ${tech}.`;
                    this.filterMessage.classList.add('show');
                }
            }, 100);

            // Scroll to projects section
            document.getElementById('projects').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Active navigation — highlight current section
class ActiveNav {
    static init() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        const setActive = () => {
            const scrollY = window.scrollY;
            const viewportMid = scrollY + window.innerHeight * 0.35;

            let current = null;
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (viewportMid >= top && viewportMid < top + height) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === '#' + current) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', setActive);
        setActive();
    }
}

// Hero atmosphere — fade glow when user scrolls down
class HeroAtmosphere {
    static init() {
      const hero = document.querySelector('.hero');
      const atmosphere = document.querySelector('.hero-atmosphere'); 
      if (!hero || !atmosphere) return; 
  
      const fadeAtmosphere = () => {
        const rect = hero.getBoundingClientRect();
        const heroBottom = rect.bottom;
        const windowHeight = window.innerHeight;
  
        if (heroBottom < windowHeight * 0.5) {
          hero.classList.add('atmosphere-faded');
        } else {
          const ratio = Math.max(0, 1 - (windowHeight - heroBottom) / (windowHeight * 0.6));
          hero.classList.toggle('atmosphere-faded', ratio < 0.3);
        }
      };
  
      const followSections = () => {
        const windowHeight = window.innerHeight;
        const sections = document.querySelectorAll('section');
  
        let currentSection = null;
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
            currentSection = section;
          }
        });
  
        if (currentSection) {
          const rect = currentSection.getBoundingClientRect();
          const sectionCenterY = rect.top + rect.height / 2;
          const offsetY = (sectionCenterY - windowHeight / 2) * 0.02;
  
          atmosphere.style.transform = `translateY(${offsetY}px)`; 
        }
      };
  
      window.addEventListener('scroll', () => {
        fadeAtmosphere();
        followSections();
      });
  
      fadeAtmosphere();
      followSections();
    }
  }
  

// Subtle System Grid — parallax and optional mouse reaction (almost subconscious)
class SubtleSystemGrid {
    static init() {
        const hero = document.querySelector('.hero');
        const layerSoft = document.querySelector('.hero-dots-layer--soft');
        const layerMid = document.querySelector('.hero-dots-layer--mid');
        if (!hero || !layerSoft || !layerMid) return;

        let scrollY = 0;
        let mouseX = 0;
        let mouseY = 0;
        let rafId = null;

        const update = () => {
            const parallaxSoft = scrollY * 0.06;
            const parallaxMid = scrollY * 0.03;
            const mouseOffset = 1.5;
            const mx = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2) * mouseOffset;
            const my = (mouseY - window.innerHeight / 2) / (window.innerHeight / 2) * mouseOffset;

            layerSoft.style.transform = `translate3d(${mx}px, ${parallaxSoft + my}px, 0)`;
            layerMid.style.transform = `translate3d(${-mx * 0.5}px, ${parallaxMid - my * 0.5}px, 0)`;
            rafId = null;
        };

        const scheduleUpdate = () => {
            if (rafId == null) rafId = requestAnimationFrame(update);
        };

        const onScroll = () => {
            scrollY = window.scrollY;
            scheduleUpdate();
        };

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            scheduleUpdate();
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        update();
    }
}

// Animated role line — smooth word swap
class AnimatedRole {
    static init() {
        const roleWord = document.querySelector('.role-word');
        if (!roleWord) {
            return;
        }

        const wordsAttr = roleWord.getAttribute('data-words');
        let words = ['UX/UI', 'Full Stack', 'Mobile'];
        
        if (wordsAttr) {
            try {
                words = JSON.parse(wordsAttr);
            } catch (e) {
                words = ['UX/UI', 'Full Stack', 'Mobile'];
            }
        }

        if (!Array.isArray(words) || words.length === 0) {
            return;
        }

        // Set initial word
        let currentIndex = 0;
        roleWord.textContent = words[0];
        roleWord.style.transition = 'opacity 0.4s ease-out';
        roleWord.style.opacity = '1';
        roleWord.style.display = 'inline-block';

        const swapWord = () => {
            roleWord.style.opacity = '0';
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % words.length;
                roleWord.textContent = words[currentIndex];
                roleWord.style.opacity = '1';
            }, 400);
        };

        // Start animation after 2 seconds, then swap every 3 seconds
        setTimeout(() => {
            swapWord();
            setInterval(swapWord, 3000);
        }, 2000);
    }
}

// Photo tilt on mouse movement
class PhotoTilt {
    static init() {
        const photoLink = document.querySelector('.hero-photo-link');
        if (!photoLink) return;

        const handleMouseMove = (e) => {
            const rect = photoLink.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) / rect.width;
            const deltaY = (e.clientY - centerY) / rect.height;
            const rotateX = deltaY * -8;
            const rotateY = deltaX * 8;

            photoLink.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const handleMouseLeave = () => {
            photoLink.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        };

        photoLink.addEventListener('mousemove', handleMouseMove);
        photoLink.addEventListener('mouseleave', handleMouseLeave);
    }
}

// Tech chips magnetize effect (subtle attraction to cursor)
class TechMagnetize {
    static init() {
        const skillTags = document.querySelectorAll('.skill-tag');
        if (skillTags.length === 0) return;

        skillTags.forEach(tag => {
            tag.addEventListener('mousemove', (e) => {
                const rect = tag.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.08;
                const deltaY = (e.clientY - centerY) * 0.08;

                tag.style.setProperty('--magnet-x', `${deltaX}px`);
                tag.style.setProperty('--magnet-y', `${deltaY}px`);
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.setProperty('--magnet-x', '0px');
                tag.style.setProperty('--magnet-y', '0px');
            });
        });
    }
}

// Copy email functionality
class CopyEmail {
    static init() {
        const copyButtons = document.querySelectorAll('.btn-copy-email');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const email = btn.getAttribute('data-email');
                navigator.clipboard.writeText(email).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.style.background = 'var(--accent-secondary)';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                    }, 2000);
                });
            });
        });
    }
}

// Easter Egg — click name to show tooltip
class EasterEgg {
    static init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    static start() {
        const heroName = document.getElementById('hero-name-easter-egg');
        if (!heroName) {
            console.warn('EasterEgg: hero-name-easter-egg not found');
            return;
        }

        let tooltip = document.createElement('div');
        tooltip.className = 'hero-name-easter-egg-tooltip';
        tooltip.textContent = 'Built with HTML/CSS/JS ✨';
        heroName.appendChild(tooltip);

        let timeoutId = null;

        const showTooltip = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            tooltip.classList.add('show');
            
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                tooltip.classList.remove('show');
            }, 2000);
        };

        heroName.addEventListener('click', showTooltip);
        heroName.addEventListener('touchstart', showTooltip);
        heroName.style.cursor = 'pointer';
    }
}

// Make pinned cards more interactive (they're already links, just enhance hover)
class PinnedCards {
    static init() {
        const pinnedCards = document.querySelectorAll('.pinned-card');
        pinnedCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    ScrollAnimations.init();
    new TechStackFilter();
    ActiveNav.init();
    HeroAtmosphere.init();
    SubtleSystemGrid.init();
    AnimatedRole.init();
    PhotoTilt.init();
    TechMagnetize.init();
    CopyEmail.init();
    PinnedCards.init();
});
