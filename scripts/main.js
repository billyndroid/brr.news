
/**
 * Brr News - Main JavaScript File
 * Handles smooth scrolling and scroll-triggered animations
 */

// Smooth scrolling utility function
function enableSmoothScrolling() {
    document.documentElement.style.scrollBehavior = "smooth";
}

// Initialize smooth scrolling on page load
document.addEventListener('DOMContentLoaded', enableSmoothScrolling);

// Scroll-triggered animation observer
// Based on https://coolcssanimation.com/how-to-trigger-a-css-animation-on-scroll/
class ScrollAnimationManager {
    constructor() {
        this.initializeScrollAnimations();
    }

    initializeScrollAnimations() {
        const wrapper = document.getElementById("scroll-animation-wrapper");
        const className = "in-view";

        if (!wrapper) {
            console.warn('Scroll animation wrapper not found');
            return;
        }

        // Reset the class to ensure clean state
        wrapper.classList.remove(className);

        // Create intersection observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        wrapper.classList.add(className);
                    } else {
                        wrapper.classList.remove(className);
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of element is visible
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
            }
        );

        observer.observe(wrapper);
    }
}

// Navigation enhancement
class NavigationManager {
    constructor() {
        this.initializeNavigation();
    }

    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
    }

    handleSmoothScroll(event) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Card interaction enhancement
class CardManager {
    constructor() {
        this.initializeCards();
    }

    initializeCards() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('click', this.handleCardClick.bind(this));
            card.addEventListener('keydown', this.handleCardKeydown.bind(this));
            card.setAttribute('tabindex', '0'); // Make cards focusable
        });
    }

    handleCardClick(event) {
        const card = event.currentTarget;
        const countryName = card.querySelector('.country-name').textContent;
        
        // Enhanced functionality - show detailed inflation data
        this.showInflationDetails(countryName);
        
        // Add visual feedback
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    handleCardKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleCardClick(event);
        }
    }

    showInflationDetails(country) {
        // Placeholder for detailed inflation data display
        const detailsData = {
            'United Kingdom': { rate: '6.1%', trend: 'Decreasing', lastUpdate: 'Oct 2025' },
            'European Union': { rate: '3.8%', trend: 'Stable', lastUpdate: 'Oct 2025' },
            'United States': { rate: '4.2%', trend: 'Increasing', lastUpdate: 'Oct 2025' },
            'Global': { rate: '4.7%', trend: 'Mixed', lastUpdate: 'Oct 2025' }
        };

        const data = detailsData[country];
        if (data) {
            alert(`${country} Inflation Data:\nRate: ${data.rate}\nTrend: ${data.trend}\nLast Updated: ${data.lastUpdate}`);
        }
    }
}

// Inflation Calculator
class InflationCalculator {
    constructor() {
        this.initializeCalculator();
    }

    initializeCalculator() {
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', this.calculateInflation.bind(this));
        }

        // Auto-calculate on input change
        const inputs = document.querySelectorAll('.calculator-form input');
        inputs.forEach(input => {
            input.addEventListener('input', this.calculateInflation.bind(this));
        });

        // Initial calculation
        this.calculateInflation();
    }

    calculateInflation() {
        const initialAmount = parseFloat(document.getElementById('initial-amount')?.value || 10000);
        const inflationRate = parseFloat(document.getElementById('inflation-rate')?.value || 3.5);
        const years = parseInt(document.getElementById('years')?.value || 10);

        if (isNaN(initialAmount) || isNaN(inflationRate) || isNaN(years)) {
            return;
        }

        // Calculate future value considering inflation
        const futureValue = initialAmount * Math.pow(1 + inflationRate / 100, years);
        const purchasingPowerLost = ((futureValue - initialAmount) / initialAmount) * 100;

        // Update display
        const futureValueElement = document.getElementById('future-value');
        const powerLostElement = document.getElementById('power-lost');

        if (futureValueElement) {
            futureValueElement.textContent = `$${futureValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        if (powerLostElement) {
            powerLostElement.textContent = `${purchasingPowerLost.toFixed(1)}%`;
        }
    }
}

// Expert Quote Carousel
class ExpertQuoteCarousel {
    constructor() {
        this.currentQuote = 0;
        this.quotes = document.querySelectorAll('.expert-quote');
        this.initializeCarousel();
    }

    initializeCarousel() {
        if (this.quotes.length > 1) {
            setInterval(() => {
                this.nextQuote();
            }, 5000); // Change quote every 5 seconds
        }
    }

    nextQuote() {
        this.quotes[this.currentQuote].classList.remove('active');
        this.currentQuote = (this.currentQuote + 1) % this.quotes.length;
        this.quotes[this.currentQuote].classList.add('active');
    }
}

// News Ticker Animation Control
class NewsTickerManager {
    constructor() {
        this.initializeTicker();
    }

    initializeTicker() {
        const ticker = document.querySelector('.ticker-content');
        if (ticker) {
            // Pause animation on hover
            ticker.addEventListener('mouseenter', () => {
                ticker.style.animationPlayState = 'paused';
            });

            ticker.addEventListener('mouseleave', () => {
                ticker.style.animationPlayState = 'running';
            });
        }
    }
}

// Enhanced News Cards Interaction
class NewsManager {
    constructor() {
        this.initializeNewsCards();
    }

    initializeNewsCards() {
        const newsCards = document.querySelectorAll('.news-card');
        
        newsCards.forEach(card => {
            card.addEventListener('click', this.handleNewsCardClick.bind(this));
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.handleNewsCardClick(event);
                }
            });
        });
    }

    handleNewsCardClick(event) {
        const card = event.currentTarget;
        const title = card.querySelector('.news-title')?.textContent;
        const category = card.querySelector('.news-category')?.textContent;
        
        // Placeholder for news article expansion or navigation
        console.log(`Opening news article: ${title} (${category})`);
        
        // Add click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
}

// Educational Cards Enhancement
class EducationManager {
    constructor() {
        this.initializeEducationCards();
    }

    initializeEducationCards() {
        const learnMoreLinks = document.querySelectorAll('.learn-more');
        
        learnMoreLinks.forEach(link => {
            link.addEventListener('click', this.handleLearnMore.bind(this));
        });
    }

    handleLearnMore(event) {
        event.preventDefault();
        const card = event.target.closest('.education-card');
        const topic = card.querySelector('h3')?.textContent;
        
        // Placeholder for educational content expansion
        alert(`Learn more about: ${topic}\n\nThis would typically open a detailed educational page or modal with comprehensive information about ${topic.toLowerCase()}.`);
    }
}

// Performance optimization: Use requestAnimationFrame for smooth animations
class PerformanceManager {
    constructor() {
        this.initializePerformanceOptimizations();
    }

    initializePerformanceOptimizations() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Scroll-based optimizations can be added here
            }, 16); // ~60fps
        }, { passive: true });

        // Preload critical images
        this.preloadCriticalImages();
    }

    preloadCriticalImages() {
        const criticalImages = [
            'assets/logo.png',
            'assets/bar-chart.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// Initialize all managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimationManager();
    new NavigationManager();
    new CardManager();
    new PerformanceManager();
    new InflationCalculator();
    new ExpertQuoteCarousel();
    new NewsTickerManager();
    new NewsManager();
    new EducationManager();
    
    console.log('Brr News fully initialized with all features!');
    
    // Add some startup animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
