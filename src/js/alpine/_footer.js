import gsap from "gsap";

export function footerAlpine() {
    return {
        currentYear: new Date().getFullYear(),
    }
}

/**
 * Creates and controls a set of generative, interactive circle animations within a given element.
 * This function is designed to be used with a component-based approach (e.g., Alpine.js).
 *
 * @param {HTMLElement} $el - The root element containing the circle SVG and DOM structure.
 * @returns {object} An object with methods to initialize and control the animations.
 */
export function prettyCircles($el) {
    return {
        playing: true,
        accentAnims: [], // Stores the GSAP animation instances for later control

        /**
         * Initializes the animation component.
         */
        init() {
            $el.classList.toggle('playing', this.playing);
            this.setupAnimations();
        },

        /**
         * Sets up and starts all the GSAP animations.
         */
        setupAnimations() {
            // Clean up any previous animations on these elements to prevent conflicts
            gsap.killTweensOf($el.querySelectorAll(".ring, .core .dot, .accent, .accents"));

            // Animate the subtle pulsing and fading of the background rings
            gsap.to($el.querySelector(".ring.r1"), {
                scale: 1.14, opacity: 0.72,
                duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
            gsap.to($el.querySelector(".ring.r2"), {
                scale: 1.14, opacity: 0.72,
                duration: 1.25, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.08
            });
            gsap.fromTo($el.querySelector(".ring.r3"),
                { scale: 0.4, opacity: 0.6 },
                { scale: 1.6, opacity: 0, duration: 3.6, repeat: -1, ease: "power2.out", delay: 0.35 }
            );

            // Create a "heartbeat" effect for the central core dot
            gsap.to($el.querySelector(".core .dot"), {
                scale: 1.28, duration: 0.6, repeat: -1, yoyo: true, ease: "power1.inOut"
            });

            // --- Accent Orbit & Pulse Logic ---
            this.accentAnims = [];
            const accents = $el.querySelectorAll(".accent");
            const orbitRadius = parseFloat($el.dataset.orbitRadius);
            const orbitRadiusDiff = parseFloat($el.dataset.orbitRadiusDiff);

            // Define the starting angles for the accents based on their visual positions (top, right, bottom)
            const startAngles = [-Math.PI / 2, 0, Math.PI / 2];

            // Force all accents to the center. This overrides their static CSS positioning for JS control.
            gsap.set(accents, { top: '50%', left: '50%', xPercent: -50, yPercent: -50 });

            // Animate each accent's orbit and pulse in a single, more efficient loop.
            accents.forEach((accent, i) => {
                // --- 1. Orbit Animation ---
                // This logic calculates the circular path for each accent.
                const trigConst = orbitRadius - ((accents.length - 1 - i) * orbitRadiusDiff);
                const proxy = { angle: startAngles[i] || 0 }; // A proxy object to animate the angle property.

                const anim = gsap.to(proxy, {
                    angle: proxy.angle + (2 * Math.PI), // Animate a full 360-degree rotation (2π radians).
                    duration: 5 + i * 2.5, // Each accent gets a different speed for variety.
                    repeat: -1,
                    ease: "linear",
                    onUpdate: () => {
                        // On each frame, calculate the x/y position from the angle and radius.
                        const x = Math.cos(proxy.angle) * trigConst;
                        const y = Math.sin(proxy.angle) * trigConst;
                        // Apply the calculated position to the accent element.
                        gsap.set(accent, { x: x, y: y });
                    }
                });
                this.accentAnims.push(anim);

                // --- 2. Pulse Animation ---
                // This creates a more visible pulsing effect by animating from a smaller/faded
                // state to a larger/opaque state.
                gsap.fromTo(accent,
                    { scale: 0.9, opacity: 0.6 }, // Starting state
                    {
                        scale: 1.2, // End state (larger and more noticeable)
                        opacity: 1,
                        duration: 1.4,
                        repeat: -1,
                        yoyo: true, // Yoyo makes the animation reverse back and forth smoothly.
                        ease: "sine.inOut",
                        delay: i * 0.12 // Stagger the start of each pulse animation slightly.
                    }
                );
            });
        },

        /**
         * Handles the mouse move event to create a parallax effect.
         * @param {MouseEvent} e - The mouse event.
         */
        onMove(e) {
            // Calculate the mouse position relative to the element's center (-0.5 to 0.5)
            const rect = $el.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;

            // Move the entire ".stage" to create a parallax "magnet" effect
            gsap.to($el.querySelector(".stage"), {
                x: nx * 25,
                y: ny * 25,
                duration: 0.26,
                ease: "power2.out"
            });
        },

        /**
         * Resets the parallax effect when the mouse leaves the element.
         */
        reset() {
            // Return the ".stage" to its original position
            gsap.to($el.querySelector(".stage"), {
                x: 0,
                y: 0,
                duration: 0.26,
                ease: "power2.out"
            });
        }
    }
}
