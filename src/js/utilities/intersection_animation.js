export function intersectionAnimation($el, threshold = 10) {
    return {
        timeout: null,

        init() {
            // --- Intersection Observer Setup ---
            // Options define when the observer's callback should fire.
            // -10% from the top and -10% from the bottom of the viewport.
            const options = {
                rootMargin: `-${threshold}% 0px -${threshold}% 0px`,
                threshold: 0 // A threshold of 0 means the callback runs as soon as one pixel is visible.
            };

            const observer = new IntersectionObserver(entries => {
                // The observer callback receives a list of entries. We're only observing one.
                const entry = entries[0];

                if (entry.isIntersecting) {
                    // 1. Element is entering the viewport.

                    // Clear any pending timeout that was set to remove the class.
                    // This prevents the class from being removed if the user scrolls out and back in quickly.
                    clearTimeout(this.timeout);

                    // Add the 'animate' class to trigger the CSS transition.
                    $el.classList.add('animate');

                } else {
                    // 2. Element is leaving the viewport.

                    // Set a timeout to remove the 'animate' class after 1 second (1000 milliseconds).
                    this.timeout = setTimeout(() => {
                        $el.classList.remove('animate');
                    }, 1000);
                }
            }, options);

            // Start observing the current element ($el).
            observer.observe($el);
        },
    }
}