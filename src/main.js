
// Project styles entry point
import('@scss/main.scss');

// Bootstrap
import('bootstrap');

// AlpineJS
import('./js/alpine/index.js');

// GSAP
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Project router initialization
import(`./js/router.js`).then(async (module) => await module.init());

// Run Vite Development Configuration (file watchers, scroll restoration, etc.)
import('./js/vite-dev-config.js');
