import ScrollTrigger from "gsap/ScrollTrigger";

export const aboutTimeline = [
    {
        timeline: ['Feb 2024', 'Current'],
        logo: '/assets/images/about/timeline/cubezoo.svg',
        position: 'Software Engineer',
        company: 'CubeZoo',
        description: [
            "Joined CubeZoo as a full-stack Laravel developer, delivering 9+ large-scale projects across industries.",
            "Recognized with a 'Remarkable Achievement' award for exceptional problem-solving, leadership, and project delivery.",
            "Specialized in Laravel, Livewire, Alpine.js, and frontend animation, while leading teams and managing direct client communication."
        ],
    },
    {
        timeline: ['Feb 2021', 'Nov 2023'],
        logo: '/assets/images/about/timeline/uj.jpg',
        position: 'BSc Computer & Mathematical Sciences',
        company: 'University of Johannesburg',
        description: [
            "Graduated with a Bachelor of Science in Computer Science & Mathematical Sciences, achieving multiple distinctions in mathematics, statistics, and computer science.",
            "Built a strong foundation in algorithms, data structures, and problem-solving, later applied to professional software engineering projects.",
            "Completed the degree with a consistent record of academic excellence."
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
