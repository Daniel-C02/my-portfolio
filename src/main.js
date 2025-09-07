
// Project styles entry point
import "./assets/scss/main.scss";

// Bootstrap
import "bootstrap";

// AlpineJS
import "./js/dependancies/alpinejs.js"

// GSAP
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Project router initialization
import(`./js/router.js`).then(async (module) => await module.init());

// Project component loader.
// Top-level await - all code from this point will execute only after components have been loaded.
const loader = await import('./js/component-loader.js');
await loader.init();

// Modules
import('./js/modules');

// Animations
import('./js/animations');

// Run Vite Development Configuration (file watchers, scroll restoration, etc.)
import "./js/vite-dev-config.js";
