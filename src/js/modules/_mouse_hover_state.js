import {isMobile} from "@js/utilities/is_mobile.js";

export const init = () => {
    const targets = document.querySelectorAll('.js-hover-target');

    // Check if the user is on a mobile device
    if (isMobile()) {
        // MOBILE LOGIC: Observe the 1px center tracker
        const triggerTop = 26;
        const triggerBottom = 35;

        const observerOptions = {
            root: null, // Use the viewport as the container
            // This margin creates a "trigger zone" in the middle 20% of the screen.
            // -x% from the top and -x% from the bottom.
            rootMargin: `-${triggerTop}% 0px -${triggerBottom}% 0px`,
            // Since our tracker is only 1px tall, a threshold of 1 means
            // the callback fires the moment the entire tracker is inside the zone.
            threshold: 1.0
        };

        const observer = (parent) => {
            return new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Add/remove the 'hover' class on the PARENT
                    parent.classList.toggle('hover', entry.isIntersecting);
                });
            }, observerOptions);
        }

        // Tell the observer to watch each tracker element
        targets.forEach(target => {
            const tracker = target.querySelector('.center-tracker');
            tracker ? observer(target).observe(tracker) : null;
        });

    } else {
        // DESKTOP LOGIC: Use the mouse hover behavior
        targets.forEach(target => {
            let timeout;
            target.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => target.classList.add('hover'), 100);
            });
            target.addEventListener('mouseleave', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => target.classList.remove('hover'), 100);
            });
        });
    }
}
