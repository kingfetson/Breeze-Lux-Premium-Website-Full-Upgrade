// Breeze Lux Cleaners - Main JavaScript
// Handles mobile navigation, before/after slider, form submission, and UI interactions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initBeforeAfterSlider();
    initFormHandlers();
    initWhatsAppPanel();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            // Optional: change icon when menu is open
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

// Before/After Interactive Comparison Slider
function initBeforeAfterSlider() {
    const slider = document.getElementById('beforeAfterSlider');
    const afterImg = document.getElementById('afterImage');
    const handle = document.getElementById('sliderHandle');
    const sliderBtn = document.querySelector('.slider-button');
    
    if (!slider || !afterImg || !handle) return;
    
    let isDragging = false;
    
    const moveSlider = (clientX) => {
        const rect = slider.getBoundingClientRect();
        let positionPercentage = ((clientX - rect.left) / rect.width) * 100;
        
        // Clamp values between 0 and 100
        positionPercentage = Math.max(0, Math.min(100, positionPercentage));
        
        afterImg.style.width = `${positionPercentage}%`;
        handle.style.left = `${positionPercentage}%`;
        
        if (sliderBtn) {
            sliderBtn.style.left = `${positionPercentage}%`;
        }
    };
    
    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });
    
    // Touch events for mobile
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    window.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        moveSlider(touch.clientX);
    });
    
    // Click to jump to position
    slider.addEventListener('click', (e) => {
        moveSlider(e.clientX);
    });
}

// Estimate Calculator for Booking Form
function calculateEstimate() {
    const sizeSelect = document.getElementById('serviceSize');
    const tierDisplay = document.getElementById('estimatedTier');
    
    if (!sizeSelect || !tierDisplay) return;
    
    const selectedSize = sizeSelect.value;
    
    if (selectedSize.includes('Compact') || selectedSize.includes('Small')) {
        tierDisplay.textContent = 'Single-Item Rate';
    } else if (selectedSize.includes('Medium') || selectedSize.includes('Family')) {
        tierDisplay.textContent = 'Standard Package Rate';
    } else if (selectedSize.includes('Large') || selectedSize.includes('Premium')) {
        tierDisplay.textContent = 'Elite Estate Rate';
    } else {
        tierDisplay.textContent = 'Standard Package';
    }
}

// Form Submission Handler (WhatsApp Integration)
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('clientName')?.value || '';
    const phone = document.getElementById('clientPhone')?.value || '';
    const service = document.getElementById('serviceType')?.value || '';
    const size = document.getElementById('serviceSize')?.value || '';
    const notes = document.getElementById('clientNotes')?.value || '';
    const tier = document.getElementById('estimatedTier')?.textContent || 'Standard Package';
    
    // Validate required fields
    if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
    }
    
    // Build WhatsApp message
    const message = `Booking Request%0A%0A*Name*: ${name}%0A*Phone*: ${phone}%0A*Service*: ${service}%0A*Size/Scale*: ${size}%0A*Estimate Tier*: ${tier}%0A*Special Instructions*: ${notes || 'None'}%0A%0AThank you! Please confirm availability.`;
    
    // WhatsApp number (Kenya format)
    const whatsappNumber = '254758966762';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Floating WhatsApp Panel Toggle
function toggleWhatsappPanel() {
    const panel = document.getElementById('whatsappPanel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

// Initialize form event listeners
function initFormHandlers() {
    const quoteForm = document.getElementById('quoteForm');
    const serviceType = document.getElementById('serviceType');
    const serviceSize = document.getElementById('serviceSize');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (serviceType) {
        serviceType.addEventListener('change', calculateEstimate);
    }
    
    if (serviceSize) {
        serviceSize.addEventListener('change', calculateEstimate);
    }
    
    // Initial calculation
    calculateEstimate();
}

// Initialize WhatsApp Panel (close on outside click)
function initWhatsAppPanel() {
    const panel = document.getElementById('whatsappPanel');
    const whatsappBtn = document.querySelector('.fixed.bottom-6.right-6 button');
    
    if (panel && whatsappBtn) {
        // Close panel when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsidePanel = panel.contains(event.target);
            const isClickOnButton = whatsappBtn.contains(event.target);
            
            if (!isClickInsidePanel && !isClickOnButton && !panel.classList.contains('hidden')) {
                panel.classList.add('hidden');
            }
        });
    }
}

// Smooth scroll for anchor links with offset (handles fixed header)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (targetId === '#' || targetId === '') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            const offset = 80; // Adjust for fixed header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Export functions for global access (for inline event handlers)
window.calculateEstimate = calculateEstimate;
window.handleFormSubmit = handleFormSubmit;
window.toggleWhatsappPanel = toggleWhatsappPanel;
