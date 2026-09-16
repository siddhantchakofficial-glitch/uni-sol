 // 1. Reactive Scroll Controller Engine (Hides Top Bar Smoothly)
        const header = document.getElementById('mainHeader');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });

        // 2. Continuous Structural Hover Matrix Engine For Desktop Screens
        document.querySelectorAll('.navbar-nav .dropdown').forEach(function(dropdownElement) {
            
            dropdownElement.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 992) {
                    let toggleBtn = this.querySelector('.dropdown-toggle');
                    let menuInstance = this.querySelector('.dropdown-menu');
                    
                    toggleBtn.classList.add('show');
                    toggleBtn.setAttribute('aria-expanded', 'true');
                    menuInstance.classList.add('show');
                }
            });

            dropdownElement.addEventListener('mouseleave', function() {
                if (window.innerWidth >= 992) {
                    let toggleBtn = this.querySelector('.dropdown-toggle');
                    let menuInstance = this.querySelector('.dropdown-menu');
                    
                    toggleBtn.classList.remove('show');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                    menuInstance.classList.remove('show');
                }
            });
        });

        // hero switcher engine
        document.addEventListener("DOMContentLoaded", function () {
            const words = document.querySelectorAll(".text-switcher-container .word");
            let currentIndex = 0;

            setInterval(() => {
                const currentWord = words[currentIndex];
                currentWord.classList.remove("visible");
                currentWord.classList.add("hidden");

                currentIndex = (currentIndex + 1) % words.length;

                const nextWord = words[currentIndex];
                nextWord.classList.remove("hidden");
                nextWord.classList.add("visible");
            }, 3000);
        });



        // about us stats

        document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.count-number');
    const animationDuration = 2000; // Total animation time in milliseconds (2 seconds)

    const startCounting = (entry, observer) => {
        // Only trigger if the element is visible on screen
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const targetValue = parseFloat(element.getAttribute('data-target'));
        const hasDecimal = targetValue % 1 !== 0;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);

            // Ease Out Quad mathematical formula for a premium deceleration effect
            const easeProgress = progress * (2 - progress);
            const currentValue = easeProgress * targetValue;

            // Format appropriately based on integer vs decimal values
            element.innerText = hasDecimal ? currentValue.toFixed(1) : Math.floor(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.innerText = targetValue; // Force exact final value at the end
            }
        };

        requestAnimationFrame(updateNumber);
        observer.unobserve(element); // Stop observing once the animation runs once
    };

    // Configuration for the scroll boundary listener
    const observerOptions = {
        root: null, // relative to viewport
        threshold: 0.1 // triggers when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => startCounting(entry, observer));
    }, observerOptions);

    // Attach observer to each element containing a data-target
    counters.forEach(counter => observer.observe(counter));
});