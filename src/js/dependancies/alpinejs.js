// Import AlpineJs from node modules
import Alpine from "alpinejs";

// Import required project data to assign to AlpineJs
import {homeSkillCards} from "@js/data/home-skill-cards.js";
import {homeAboutCards} from "@js/data/home-about-cards.js";
import {projects} from "@js/data/projects.js";
import {devSkills} from "@js/data/skills.js";
import {insideScoop} from "@js/data/inside-scoop.js";
import {copyEmail} from "@js/utilities/copy_email.js";
import {aboutTimeline} from "@js/data/about-timeline.js";
import ScrollTrigger from "gsap/ScrollTrigger";

// Assign Alpine to the window object
window.Alpine = Alpine;

// Initialise project data inside AlpineJs.
// AlpineJs appData gets set on the body of the project
Alpine.data("appData", () => ({
    // Gsap ScrollTrigger plugin
    ScrollTrigger,

    // Home page data
    homeAboutCards,
    homeSkillCards,
    insideScoop,

    // Projects
    projects,
    featuredProjects: projects.filter(p => p.isFeatured),

    // Developer skills
    devSkills,

    // About page data
    aboutTimeline,

    // Utility methods
    copyEmail,
}));

// Start AlpineJs
Alpine.start();