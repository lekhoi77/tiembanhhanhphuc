// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

let currentCard = 0;
const totalCards = 3;
let isInCardSection = false;

// Function to animate to specific card
function animateToCard(cardIndex) {
    gsap.to(".cardscroll", {
        x: `-${cardIndex * 100}vw`,
        duration: 0.8,
        ease: "power2.inOut"
    });
}

function handleCardScroll(e) {
    // Only handle scroll if we're in the card section
    if (!isInCardSection || isScrolling) return;
    
    // Prevent default scroll behavior
    e.preventDefault();
    
    isScrolling = true;
    
    if (e.deltaY > 0) {
        // Scroll down - next card
        if (currentCard < totalCards - 1) {
            currentCard++;
            animateToCard(currentCard);
        } else {
            // If at last card, allow normal scroll to continue
            isInCardSection = false;
            window.removeEventListener('wheel', handleCardScroll, { passive: false });
        }
    } else {
        // Scroll up - previous card
        if (currentCard > 0) {
            currentCard--;
            animateToCard(currentCard);
        }
    }
    
    // Prevent rapid scrolling
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// Handle wheel events for discrete scrolling
let isScrolling = false;

function initCardScroll() {
    // Get the cardscroll section
    const cardScrollSection = document.querySelector('.aboutus');
    
    if (!cardScrollSection) return;

    // Set initial position to show first card
    gsap.set(".cardscroll", { x: 0 });

    // Create scroll trigger for the aboutus section
    ScrollTrigger.create({
        trigger: cardScrollSection,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
            isInCardSection = true;
            currentCard = 0; // Reset to first card
            animateToCard(0);
            window.addEventListener('wheel', handleCardScroll, { passive: false });
        },
        onLeave: () => {
            isInCardSection = false;
            window.removeEventListener('wheel', handleCardScroll, { passive: false });
        },
        onEnterBack: () => {
            isInCardSection = true;
            window.addEventListener('wheel', handleCardScroll, { passive: false });
        },
        onLeaveBack: () => {
            isInCardSection = false;
            currentCard = 0; // Reset to first card when leaving back
            animateToCard(0);
            window.removeEventListener('wheel', handleCardScroll, { passive: false });
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for GSAP to be ready
    setTimeout(() => {
        console.log('Initializing card scroll...');
        
        // Check if elements exist
        const cardscroll = document.querySelector('.cardscroll');
        const aboutus = document.querySelector('.aboutus');
        
        if (cardscroll) {
            console.log('Cardscroll element found');
            // Force initial position
            gsap.set(cardscroll, { x: 0 });
            console.log('Initial position set to 0');
        } else {
            console.error('Cardscroll element not found');
        }
        
        if (aboutus) {
            console.log('Aboutus section found');
        } else {
            console.error('Aboutus section not found');
        }
        
        initCardScroll();
    }, 500); // Increased delay
}); 