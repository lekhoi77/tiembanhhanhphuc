// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

let currentCard = 0;
const totalCards = 3;
let isInCardSection = false;

// Function to animate to specific card
function animateToCard(cardIndex) {
    // Animate cards horizontally
    gsap.to(".cardscroll", {
        x: `-${cardIndex * 100}vw`,
        duration: 0.8,
        ease: "power2.inOut"
    });
    
    // Animate heading vertically from bottom to current position
    const headingY = cardIndex === 0 ? 150 : 
                     cardIndex === 1 ? 75 : 
                     cardIndex === 2 ? 0 : 200;
    
    gsap.to(".aboutus .heading", {
        y: headingY,
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
            // At last card - next scroll will unpin and continue normal scrolling
            console.log('At last card - next scroll will unpin section');
            // Don't manually exit, let ScrollTrigger handle the unpinning
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
    
    // Set initial position for heading (start from bottom)
    gsap.set(".aboutus .heading", { y: 200 });

        // Create scroll trigger to pin section and force horizontal scrolling
    ScrollTrigger.create({
        trigger: cardScrollSection,
        start: "top top-20", // Pin khi section cách đầu màn hình 20px
        end: "+=1002", // Pin trong khoảng scroll vừa đủ để xem hết 3 cards (400px mỗi card)
        pin: true, // Khóa section tại chỗ
        pinSpacing: true, // Tạo khoảng trống để không đè lên section sau
        onEnter: () => {
            console.log('Section pinned - activating horizontal scroll');
            isInCardSection = true;
            currentCard = 0;
            animateToCard(0);
            window.addEventListener('wheel', handleCardScroll, { passive: false });
        },
        onLeave: () => {
            console.log('Section unpinned - normal scroll resumed');
            isInCardSection = false;
            window.removeEventListener('wheel', handleCardScroll, { passive: false });
        },
        onEnterBack: () => {
            console.log('Section pinned again - activating horizontal scroll');
            isInCardSection = true;
            window.addEventListener('wheel', handleCardScroll, { passive: false });
        },
        onLeaveBack: () => {
            console.log('Section unpinned back - normal scroll resumed');
            isInCardSection = false;
            currentCard = 0;
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