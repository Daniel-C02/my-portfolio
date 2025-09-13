// Import AlpineJs from node modules
import Alpine from "alpinejs";

// Import project Packages for use inside AlpineJs
import ScrollTrigger from "gsap/ScrollTrigger";

// Import required project data to assign to AlpineJs
import {homeAboutCards} from "@js/alpine/home/_about_cards.js";
import {homeSkillCards} from "@js/alpine/home/_skill_cards.js";
import {insideScoop} from "@js/alpine/home/_inside_scoop.js";
import {aboutTimeline} from "@js/alpine/about/_timeline.js";
import {projects} from "@js/alpine/_projects.js";
import {devSkills} from "@js/alpine/_skills.js";
import {socialLinks} from "@js/alpine/_social_links.js";
import {copyEmail} from "@js/utilities/copy_email.js";
import {footerAlpine, prettyCircles} from "@js/alpine/_footer.js";

// Assign Alpine to the window object
window.Alpine = Alpine;

// Initialise project data inside AlpineJs.
// AlpineJs appData gets set on the body of the project
Alpine.data("appData", () => ({
    /*
     * Gsap ScrollTrigger plugin
     */

    ScrollTrigger,

    /*
     * Section specific data
     */

    // Home page data
    homeAboutCards,
    homeSkillCards,
    insideScoop,

    // About page data
    aboutTimeline,

    // Projects
    projects,
    featuredProjects: projects.filter(p => p.isFeatured),

    // Developer skills
    devSkills,

    // Socials
    socialLinks,

    /*
     * Section specific functionality
     */

    // Footer
    footerAlpine,
    prettyCircles,

    // Other
    copyEmail,
}));

// Start AlpineJs
Alpine.start();