import gsap from "gsap";

export function navbarAlpine() {
    return {
        // Navbar navigation links
        navLinks: [
            { name: 'Home', route: '/' },
            { name: 'About', route: '/about' },
            { name: 'Projects', route: '/projects' },
            { name: 'Resume', route: '/resume' },
            { name: 'Contact', route: '/contact' },
        ],
        // Current route path
        locationPath: window.location.pathname,
        // Navbar toggle state
        collapseOpen: false,
        animatable: false,

        /*
         * Navbar collapse mobile animation
         */
        toggleCollapse() {
            this.collapseOpen = !this.collapseOpen;
            this.animatable = true;

            if (this.collapseOpen) {
                let tl = gsap.timeline();

                // inner nav links animate in staggered
                tl.fromTo('.navbar-collapse .nav-link span',
                    { opacity: 0.6, y: 24, rotateX: -90 },
                    { opacity: 1, y: 0, rotateX: 0, stagger: 0.08, duration: 0.4, delay: 0.6, ease: 'back.out(1.7)' },
                    "-=0.2" // overlaps a little with the container expansion
                );
            } else {
                let tl = gsap.timeline();

                // nav links out
                tl.to('.navbar-collapse .nav-link span',
                    { opacity: 0.6, y: -24, rotateX: 90, stagger: 0.05, duration: 0.3, ease: 'power2.in' }
                );
            }
        },

        /*
         * Scroll logic properties
         */
        lastScroll: 0,
        thresholdBottom: 40,
        thresholdTop: 40,
        scrolledDown: false,
        scrolledUp: false,
        scrolledDownValue: 0,
        scrolledUpValue: 0,

        init() {
            /*
             * Scroll logic functionality
             */
            (() => {
                // set the threshold
                this.thresholdBottom = window.innerHeight * 0.02; // 2% of window height
                this.thresholdTop = window.innerHeight * 0.24; // 24% of window height

                // Scroll listener
                window.addEventListener('scroll', () => {
                    const currentScroll = window.scrollY;

                    // If at the very top of the page, force the navbar to be visible.
                    if (currentScroll <= 0) {
                        this.scrolledUp = true;
                        this.scrolledDown = false;
                        this.lastScroll = 0; // Reset last scroll position for accuracy
                        return; // Exit early
                    }

                    const delta = currentScroll - this.lastScroll;

                    if (delta !== 0) {
                        if (delta > 0) {
                            this.scrolledUpValue = 0;
                            this.scrolledDownValue += delta;
                            if (this.scrolledDownValue >= this.thresholdBottom) {
                                this.scrolledDown = true;
                                this.scrolledUp = false;
                            }
                        } else {
                            this.scrolledDownValue = 0;
                            this.scrolledUpValue += Math.abs(delta);
                            if (this.scrolledUpValue >= this.thresholdTop) {
                                this.scrolledUp = true;
                                this.scrolledDown = false;
                            }
                        }
                    }

                    this.lastScroll = currentScroll;
                });
            })();
        }
    }
}