import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export const homeAboutCards = [
    {
        bsIconClass: 'bi bi-braces',
        title: 'Full-Stack Development',
        text: 'Experienced in delivering high-quality projects using Laravel, React, and modern frontend technologies like Alpine.js.'
    },
    {
        bsIconClass: 'bi bi-calculator',
        title: 'Mathematical Problem-Solving',
        text: 'Applying a strong analytical foundation from my BSc in Mathematical and Computer Sciences to build optimized solutions.'
    },
    {
        bsIconClass: 'bi bi-robot',
        title: 'Data Science & AI',
        text: 'Passionate about exploring opportunities in data-related fields, including AI, software engineering, and advanced statistics.'
    },
];

export function homeAboutAlpine($el) {
    return {
        init() {
            // Give the browser a moment to render everything before running GSAP
            this.$nextTick(() => { setTimeout(() => {
                // Select all your cards
                const cards = gsap.utils.toArray($el.querySelectorAll('.my_card'));

                cards.forEach((card, i) => {
                    // Use gsap.from() to animate FROM a starting state
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'restart none none reverse',
                        },
                        x: -50,
                        opacity: 0,
                        duration: 0.6,
                        delay: i * 0.2,
                        ease: 'power3.out'
                    });
                });
            }, 600); });
        }
    }
}