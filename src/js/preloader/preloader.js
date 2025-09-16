import {lockScroll, unlockScroll} from "@js/utilities/scroll_helpers.js";

// Get the preloader element from the DOM
const preloader = document.getElementById('s_preloader');

// Function to show the preloader
export const showPreloader = () => {
    if (preloader) {
        lockScroll();
        preloader.classList.remove('hidden');
    }
};

// Function to hide the preloader
export const hidePreloader = () => {
    if (preloader) {
        unlockScroll();
        preloader.classList.add('hidden');
    }
};