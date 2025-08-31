// Import AlpineJs from node modules
import Alpine from "alpinejs";

// Import required project data to assign to AlpineJs
import {homeSkillCards} from "@js/data/home-skill-cards.js";
import {homeAboutCards} from "@js/data/home-about-cards.js";
import {projects} from "@js/data/projects.js";
import {devSkills} from "@js/data/skills.js";
import {insideScoop} from "@js/data/inside-scoop.js";

// Assign Alpine to the window object
window.Alpine = Alpine;

// Initialise project data inside AlpineJs.
// AlpineJs appData gets set on the body of the project
Alpine.data("appData", () => ({
    homeAboutCards,
    homeSkillCards,

    projects,
    featuredProjects: projects.filter(p => p.isFeatured),

    devSkills,
    insideScoop,
}));

// Start AlpineJs
Alpine.start();