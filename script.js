// ===== PORTFOLIO CONFIGURATION =====
// Update your experience years here - it will automatically update throughout the website
const PORTFOLIO_CONFIG = {
    experienceYears: 16,
    currentYear: new Date().getFullYear(),
    startYear: 2008
};

// Function to update experience years dynamically
function updateExperienceYears() {
    // Update elements with data-experience-years attribute
    const yearElements = document.querySelectorAll('[data-experience-years]');
    yearElements.forEach(element => {
        if (element.tagName === 'TITLE') {
            element.textContent = element.textContent.replace(/\d+\+?\s*Years?\s*Experience/gi, `${PORTFOLIO_CONFIG.experienceYears}+ Years Experience`);
        } else if (element.hasAttribute('content')) {
            element.setAttribute('content', element.getAttribute('content').replace(/\d+\+?\s*Years?\s*Experience/gi, `${PORTFOLIO_CONFIG.experienceYears}+ Years Experience`));
        } else {
            element.textContent = element.textContent.replace(/\d+\+?\s*years?/gi, `${PORTFOLIO_CONFIG.experienceYears}+ years`);
        }
    });

    // Update elements with data-experience-text attribute
    const experienceElements = document.querySelectorAll('[data-experience-text]');
    experienceElements.forEach(element => {
        if (element.hasAttribute('content')) {
            element.setAttribute('content', element.getAttribute('content').replace(/\d+\+?\s*years?\s*experience/gi, `${PORTFOLIO_CONFIG.experienceYears}+ years experience`));
        } else if (element.hasAttribute('alt')) {
            element.setAttribute('alt', element.getAttribute('alt').replace(/\d+\+?\s*years?\s*experience/gi, `${PORTFOLIO_CONFIG.experienceYears}+ years experience`));
        } else {
            element.innerHTML = element.innerHTML.replace(/\d+\+?\s*years?\s*(?:of\s+)?experience/gi, `${PORTFOLIO_CONFIG.experienceYears}+ years experience`);
        }
    });

    // Update JSON-LD structured data
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
        let jsonContent = jsonLdScript.textContent;
        jsonContent = jsonContent.replace(/\d+\+?\s*years?\s*of\s*experience/gi, `${PORTFOLIO_CONFIG.experienceYears}+ years of experience`);
        jsonLdScript.textContent = jsonContent;
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        // Special handling for home link
        if (targetId === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const handleNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
};

window.addEventListener('scroll', debounce(handleNavbarScroll, 10));

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const handleActiveNavigation = () => {
    let current = '';
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    // Check if we're at the top of the page
    if (window.scrollY < 100) {
        current = 'home';
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Only highlight links that point to sections on the current page
        if (link.getAttribute('href') === `#${current}` && current !== '') {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', debounce(handleActiveNavigation, 50));

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category-card, .role-card, .experience-card');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! I\'ll get back to you soon.');
        contactForm.reset();
    });
}

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update experience years throughout the site
    updateExperienceYears();

    // Set active navigation state based on current page
    setActiveNavigation();
});

// Function to set active navigation based on current page
function setActiveNavigation() {
    // Set home as active by default
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
}

// Optimized parallax effect for hero section
const handleParallax = () => {
    // Disable parallax on mobile devices for better performance
    if (window.innerWidth <= 768) return;
    
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            // Reduced parallax effect and use transform3d for hardware acceleration
            hero.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0)`;
        });
    }
};

// Use passive listener for better performance
window.addEventListener('scroll', debounce(handleParallax, 8), { passive: true });

// Language translations
const translations = {
    en: {
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-skills': 'Skills',
        'nav-past-skills': 'Past Skills',
        'nav-experience': 'Experience',
        'nav-projects': 'Projects',
        'nav-contact': 'Contact',
        'hero-greeting': 'Hi, I\'m',
        'hero-title': 'Solution Architect & Software Engineer',
        'hero-bio': `${PORTFOLIO_CONFIG.experienceYears}+ years experience in building Scalable System, Cloud Native, Micro-Services, Big data, OpenSource LLM model, Machine learning Apps, Building large scale product, Enterprise grade DevOps practices, Driving 10 Scrum Teams, Security and Database`,
        'hero-description': 'Passionate about building scalable systems and leading engineering teams to deliver exceptional software solutions.',
        'btn-work': 'View My Work',
        'btn-contact': 'Get In Touch',
        'section-about': 'About Me',
        'section-skills': 'Current Skills',
        'section-past-skills': 'Past Skills',
        'contact-title': 'Get In Touch',
        'contact-subtitle': 'Let\'s work together',
        'contact-description': 'I\'m always interested in discussing new opportunities, innovative projects, and ways to create impactful software solutions.',
        'form-name': 'Your Name',
        'form-email': 'Your Email',
        'form-message': 'Your Message',
        'form-submit': 'Send Message'
    },
    fr: {
        'nav-home': 'Accueil',
        'nav-about': 'À propos',
        'nav-skills': 'Compétences',
        'nav-past-skills': 'Anciennes Compétences',
        'nav-experience': 'Expérience',
        'nav-projects': 'Projets',
        'nav-contact': 'Contact',
        'hero-greeting': 'Salut, je suis',
        'hero-title': 'Architecte de Solutions & Ingénieur Logiciel',
        'hero-bio': `${PORTFOLIO_CONFIG.experienceYears}+ années d\'expérience dans la construction de Systèmes Évolutifs, Cloud Native, Micro-Services, Big Data, modèles LLM OpenSource, applications d\'apprentissage automatique, construction de produits à grande échelle, pratiques DevOps de niveau entreprise, direction de 10 équipes Scrum, sécurité et base de données`,
        'hero-description': 'Passionné par la construction de systèmes évolutifs et la direction d\'équipes d\'ingénierie pour fournir des solutions logicielles exceptionnelles.',
        'btn-work': 'Voir Mon Travail',
        'btn-contact': 'Entrer en Contact',
        'section-about': 'À Propos de Moi',
        'section-skills': 'Compétences Actuelles',
        'section-past-skills': 'Anciennes Compétences',
        'contact-title': 'Entrer en Contact',
        'contact-subtitle': 'Travaillons ensemble',
        'contact-description': 'Je suis toujours intéressé à discuter de nouvelles opportunités, de projets innovants et de moyens de créer des solutions logicielles percutantes.',
        'form-name': 'Votre Nom',
        'form-email': 'Votre Email',
        'form-message': 'Votre Message',
        'form-submit': 'Envoyer le Message'
    },
    it: {
        'nav-home': 'Home',
        'nav-about': 'Chi Sono',
        'nav-skills': 'Competenze',
        'nav-past-skills': 'Competenze Passate',
        'nav-experience': 'Esperienza',
        'nav-projects': 'Progetti',
        'nav-contact': 'Contatto',
        'hero-greeting': 'Ciao, sono',
        'hero-title': 'Architetto di Soluzioni & Ingegnere Software',
        'hero-bio': `${PORTFOLIO_CONFIG.experienceYears}+ anni di esperienza nella costruzione di Sistemi Scalabili, Cloud Native, Micro-Servizi, Big Data, modelli LLM OpenSource, applicazioni di machine learning, costruzione di prodotti su larga scala, pratiche DevOps di livello enterprise, gestione di 10 team Scrum, sicurezza e database`,
        'hero-description': 'Appassionato di costruire sistemi scalabili e guidare team di ingegneria per fornire soluzioni software eccezionali.',
        'btn-work': 'Vedi il Mio Lavoro',
        'btn-contact': 'Mettiti in Contatto',
        'section-about': 'Chi Sono',
        'section-skills': 'Competenze Attuali',
        'section-past-skills': 'Competenze Passate',
        'contact-title': 'Mettiti in Contatto',
        'contact-subtitle': 'Lavoriamo insieme',
        'contact-description': 'Sono sempre interessato a discutere nuove opportunità, progetti innovativi e modi per creare soluzioni software di impatto.',
        'form-name': 'Il Tuo Nome',
        'form-email': 'La Tua Email',
        'form-message': 'Il Tuo Messaggio',
        'form-submit': 'Invia Messaggio'
    },
    hi: {
        'nav-home': 'होम',
        'nav-about': 'के बारे में',
        'nav-skills': 'कौशल',
        'nav-past-skills': 'पुराने कौशल',
        'nav-experience': 'अनुभव',
        'nav-projects': 'प्रोजेक्ट्स',
        'nav-contact': 'संपर्क',
        'hero-greeting': 'नमस्ते, मैं हूँ',
        'hero-title': 'समाधान आर्किटेक्ट और सॉफ्टवेयर इंजीनियर',
        'hero-bio': `${PORTFOLIO_CONFIG.experienceYears}+ वर्षों का अनुभव स्केलेबल सिस्टम, क्लाउड नेटिव, माइक्रो-सर्विसेज, बिग डेटा, ओपनसोर्स LLM मॉडल, मशीन लर्निंग ऐप्स, बड़े पैमाने के उत्पाद निर्माण, एंटरप्राइज़ ग्रेड DevOps प्रथाओं, 10 स्क्रम टीमों का नेतृत्व, सुरक्षा और डेटाबेस में`,
        'hero-description': 'स्केलेबल सिस्टम बनाने और असाधारण सॉफ्टवेयर समाधान प्रदान करने के लिए इंजीनियरिंग टीमों का नेतृत्व करने के बारे में भावुक।',
        'btn-work': 'मेरा काम देखें',
        'btn-contact': 'संपर्क में रहें',
        'section-about': 'मेरे बारे में',
        'section-skills': 'वर्तमान कौशल',
        'section-past-skills': 'पुराने कौशल',
        'contact-title': 'संपर्क में रहें',
        'contact-subtitle': 'आइए मिलकर काम करें',
        'contact-description': 'मैं हमेशा नए अवसरों, नवाचार परियोजनाओं और प्रभावशाली सॉफ्टवेयर समाधान बनाने के तरीकों पर चर्चा करने में रुचि रखता हूं।',
        'form-name': 'आपका नाम',
        'form-email': 'आपका ईमेल',
        'form-message': 'आपका संदेश',
        'form-submit': 'संदेश भेजें'
    }
};

// Language switcher functionality
let currentLanguage = 'en';

function initLanguageSwitcher() {
    const languageBtn = document.getElementById('languageBtn');
    const languageOptions = document.getElementById('languageOptions');
    const languageOptionElements = document.querySelectorAll('.language-option');

    // Toggle dropdown
    languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageOptions.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        languageOptions.classList.remove('show');
    });

    // Handle language selection
    languageOptionElements.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedLang = option.getAttribute('data-lang');
            changeLanguage(selectedLang);
            languageOptions.classList.remove('show');
        });
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;

    // Update current language display
    const currentLangElement = document.getElementById('currentLang');
    const langMap = { en: 'EN', fr: 'FR', it: 'IT', hi: 'हि' };
    currentLangElement.textContent = langMap[lang];

    // Update active state
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });

    // Translate all elements
    translatePage(lang);

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

function translatePage(lang) {
    // Translate text content
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Translate placeholders
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
}

// Initialize language switcher on page load
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(savedLang);
});

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);
// Audi
o Player Functionality
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('aboutMeAudio');
    const playBtn = document.getElementById('audioPlayBtn');
    const playIcon = document.getElementById('playIcon');
    const audioControls = document.getElementById('audioControls');
    const progressBar = document.getElementById('audioProgress');
    const progressContainer = document.querySelector('.audio-progress-bar-small');
    const currentTimeSpan = document.getElementById('currentTime');
    const totalTimeSpan = document.getElementById('totalTime');
    // Removed volume slider for small player

    let isPlaying = false;

    // Initialize audio player
    if (audio) {
        // Set initial volume
        audio.volume = 0.7;

        // Play/Pause functionality
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        });

        // Audio play event
        audio.addEventListener('play', () => {
            isPlaying = true;
            playIcon.className = 'fas fa-pause';
            audioControls.style.display = 'flex';
        });

        // Audio pause event
        audio.addEventListener('pause', () => {
            isPlaying = false;
            playIcon.className = 'fas fa-play';
        });

        // Audio ended event
        audio.addEventListener('ended', () => {
            isPlaying = false;
            playIcon.className = 'fas fa-play';
            progressBar.style.width = '0%';
            audioControls.style.display = 'none';
        });

        // Update progress bar and time
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = progress + '%';

                currentTimeSpan.textContent = formatTime(audio.currentTime);
                totalTimeSpan.textContent = formatTime(audio.duration);
            }
        });

        // Load metadata to get duration
        audio.addEventListener('loadedmetadata', () => {
            totalTimeSpan.textContent = formatTime(audio.duration);
        });

        // Progress bar click functionality
        progressContainer.addEventListener('click', (e) => {
            if (audio.duration) {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const clickTime = (clickX / width) * audio.duration;
                audio.currentTime = clickTime;
            }
        });

        // Error handling
        audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            playBtn.disabled = true;
            playBtn.style.opacity = '0.5';
        });
    }

    // Format time helper function
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
});