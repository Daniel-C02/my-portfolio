// Project styles entry point
import "./assets/scss/main.scss";

// Bootstrap
import "bootstrap";

// AlpineJS
import Alpine from "alpinejs";

// GSAP
import gsap from "gsap";

// Start AlpineJS
window.Alpine = Alpine;
Alpine.start();

// Project Router initialization
import(`./js/router.js`).then(async (module) => await module.init());

// main.js
import('./js/component-loader.js').then(async (module) => await module.init());

