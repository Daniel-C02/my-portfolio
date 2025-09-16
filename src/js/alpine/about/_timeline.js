import ScrollTrigger from "gsap/ScrollTrigger";

export const aboutTimeline = [
    {
        timeline: ['Feb 2024', 'Current'],
        logo: '/assets/images/about/timeline/cubezoo.svg',
        position: 'Software Engineer',
        company: 'CubeZoo',
        description: [
            "My journey in programming began with an interest in solving complex problems. This led me to explore various programming languages and technologies, with a focus on web development and artificial intelligence.",
        ],
    },
    {
        timeline: ['Feb 2021', 'Oct 2023'],
        logo: '/assets/images/about/timeline/uj.jpg',
        position: 'Computer Science',
        company: 'University of Johannesburg',
        description: [
            "My journey in programming began with an interest in solving complex problems. This led me to explore various programming languages and technologies, with a focus on web development and artificial intelligence.",
            "When I'm not coding, I enjoy exploring new technologies, solving algorithmic problems, contributing to open-source projects and playing video games.\n"
        ],
    },
];

export function timelineProgressAlpine($el) {
    return {
        progress: 0,
        init() {
            // Define the resize handler function
            const handleResize = () => {
                ScrollTrigger.refresh();
            };

            // Ensure Alpine finishes rendering and any nested components are mounted
            this.$nextTick(() => {
                ScrollTrigger.create({
                    trigger: $el,
                    start: 'top 56%',
                    end: 'bottom 56%',
                    onUpdate: self => {
                        this.progress = Math.round(self.progress * 100);
                    }
                });
                setTimeout(() => ScrollTrigger.refresh(), 1200);
            });

            // Add the event listener to the window object
            window.addEventListener('resize', handleResize);
        },
    }
}

export function timelineBoxActivationAlpine($el) {
    return {
        passed: false,
        init() {
            this.$nextTick(() => {
                ScrollTrigger.create({
                    trigger: $el,
                    start: 'bottom 68%',
                    onEnter: () => this.passed = true,
                    onLeaveBack: () => this.passed = false
                });
            });
        }
    }
}
