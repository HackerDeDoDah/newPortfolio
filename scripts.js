// Mobile menu functionality
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Scroll position tracking and active section highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    if (section.id) {
        observer.observe(section);
    }
});

// Animate on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.pack-item, .project-card').forEach(item => {
    animateOnScroll.observe(item);
});

// Enhanced quote system with better error handling and fallback quotes
const fallbackQuotes = [
    "The layout is intuitive and organized.",
    "You captured our brand perfectly.",
    "It works perfectly on mobile!"
];

function fetchQuotes() {
    const quoteElement = document.getElementById('quote');
    
    fetch('quotes.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const quotes = data.split('\n')
                .map(quote => quote.trim())
                .filter(quote => quote !== '' && !quote.startsWith('//'));
            if (quotes.length === 0) {
                throw new Error('No valid quotes found in file');
            }
            const randomQuote = getRandomQuote(quotes);
            updateQuote(randomQuote);
        })
        .catch(error => {
            console.error('Error fetching the quotes:', error);
            // Use fallback quote if fetch fails
            const fallbackQuote = getRandomQuote(fallbackQuotes);
            updateQuote(fallbackQuote);
        });
}

function getRandomQuote(quotes) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function updateQuote(quote) {
    const quoteElement = document.getElementById('quote');
    quoteElement.style.opacity = '0';
    
    setTimeout(() => {
        quoteElement.textContent = quote;
        quoteElement.style.opacity = '1';
    }, 500);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchQuotes();
    
    // Auto refresh quote every 10 seconds
    setInterval(fetchQuotes, 10000);
});