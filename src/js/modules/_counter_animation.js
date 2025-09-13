/**
 * Counter Animation Script
 *
 * This script finds all elements with the class '.counter-animation'
 * and animates them, counting up from 0 to a target number when
 * they become visible in the viewport.
 *
 * Required HTML Structure:
 * <div class="counter-animation" data-value="100">0</div>
 *
 * - class="counter-animation": Required for the script to find the element.
 * - data-value="100":       The number the counter will animate to.
 *
 * The CSS for the sliding digit effect is required for the visual animation.
 */

export const init = () => {

    // Select all elements with the counter-animation class
    const counterElements = document.querySelectorAll('.counter-animation');

    // If no counters are found, exit the script
    if (counterElements.length === 0) {
        return;
    }

    /**
     * This function updates the visual display of a single counter element
     * with the sliding digit effect.
     * @param {HTMLElement} containerElement - The counter element to update.
     * @param {number} newValue - The new number to display.
     */
    const updateCounterDisplay = (containerElement, newValue) => {
        const newValueStr = String(newValue);
        const numDigits = newValueStr.length;

        // Ensure the number of digit slots matches the number of digits
        let renderedSlots = containerElement.querySelectorAll('.digit-slot');
        while (renderedSlots.length < numDigits) {
            const slot = document.createElement('div');
            slot.className = 'digit-slot';
            containerElement.appendChild(slot);
            renderedSlots = containerElement.querySelectorAll('.digit-slot');
        }
        while (renderedSlots.length > numDigits && renderedSlots.length > 1) {
            containerElement.removeChild(renderedSlots[0]);
            renderedSlots = containerElement.querySelectorAll('.digit-slot');
        }

        // Update each digit slot with the new digit
        const finalSlots = containerElement.querySelectorAll('.digit-slot');
        for (let i = 0; i < numDigits; i++) {
            const slot = finalSlots[i];
            const newDigitChar = newValueStr[i];

            const currentDigitElement = slot.querySelector('.digit.visible');
            const currentDigitChar = currentDigitElement ? currentDigitElement.textContent : null;

            // Only update if the digit has changed
            if (newDigitChar !== currentDigitChar) {
                // Mark the old digit for removal
                if (currentDigitElement) {
                    currentDigitElement.classList.remove('visible');
                    currentDigitElement.classList.add('slide-out');
                    currentDigitElement.addEventListener('transitionend', () => {
                        currentDigitElement.remove();
                    }, { once: true });
                }

                // Create and insert the new digit
                const newDigitElement = document.createElement('span');
                newDigitElement.className = 'digit slide-in';
                newDigitElement.textContent = newDigitChar;
                slot.appendChild(newDigitElement);

                // Trigger the transition by forcing a reflow
                void newDigitElement.offsetHeight;

                // Animate the new digit into view
                newDigitElement.classList.remove('slide-in');
                newDigitElement.classList.add('visible');
            }
        }
    };

    /**
     * The core animation function using requestAnimationFrame.
     * @param {HTMLElement} element - The counter element to animate.
     * @param {number} endValue - The final number.
     * @param {number} duration - The animation duration in milliseconds.
     */
    const animateCountUp = (element, endValue, duration) => {
        let startTime = null;
        let lastDisplayedValue = -1;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Use linear progress for a steady count, which works better for integers.
            const currentValue = Math.floor(progress * endValue);

            if (currentValue !== lastDisplayedValue) {
                updateCounterDisplay(element, currentValue);
                lastDisplayedValue = currentValue;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Ensure the final value is always displayed at the end.
                updateCounterDisplay(element, endValue);
            }
        };

        requestAnimationFrame(step);
    };

    /**
     * The callback function for the IntersectionObserver.
     * @param {IntersectionObserverEntry[]} entries - The entries being observed.
     * @param {IntersectionObserver} observer - The observer instance.
     */
    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const targetValue = parseInt(counterElement.dataset.value, 10) || 0;

                // Dynamically calculate duration for a consistent counting speed.
                // - timePerIncrement: Milliseconds per number increment.
                // - minDuration: Ensures the animation is visible for small numbers.
                // - maxDuration: Prevents excessively long animations for large numbers.
                const timePerIncrement = 200; // ms per number
                const minDuration = 400;     // 0.4s minimum
                const maxDuration = 2100;    // 2.1s maximum

                let duration = targetValue * timePerIncrement;
                duration = Math.max(minDuration, Math.min(duration, maxDuration));

                animateCountUp(counterElement, targetValue, duration);
                observer.unobserve(counterElement);
            }
        });
    };

    // Create a single IntersectionObserver to watch all counter elements
    const observer = new IntersectionObserver(handleIntersection, {
        root: null, // Observe against the viewport
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the element is visible
    });

    // Start observing each counter element
    counterElements.forEach(counter => {
        // Initialize the display to 0 before observing
        updateCounterDisplay(counter, 0);
        observer.observe(counter);
    });
}
