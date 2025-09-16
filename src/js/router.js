import { reinitializeScripts } from './post-navigation.js';
import {hidePreloader, showPreloader} from "@js/preloader/preloader.js";

/**
 * Call on page load
 */
export const init = async () => {
   // Initialize router first
   await router();

   // Navigate to the page
   const navigateTo = (url) => {
      history.pushState(null, null, url);
      router();
   };

   // Listen for browser navigation
   // window.addEventListener("popstate", router);

   // Intercept link clicks
   document.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
         e.preventDefault();
         navigateTo(e.target.href);
      }
   });
};

/**
 * Project Router
 */
const router = async () => {
   // --- SHOW PRELOADER ---
   // Show the preloader as soon as navigation starts.
   showPreloader();

   // --- DEFINE PROMISES ---

   // 1. A promise that resolves after a minimum delay of 2.2 seconds.
   const minimumDelayPromise = new Promise(resolve => setTimeout(resolve, 2200));

   // 2. An async IIFE (Immediately Invoked Function Expression) that loads the
   //    page content and returns a promise that resolves when it's done.
   const loadContentPromise = (async () => {
      const routes = [
         { path: "/", view: "/pages/home.html" },
         { path: "/about", view: "/pages/about.html" },
         { path: "/projects", view: "/pages/projects.html" },
         { path: "/resume", view: "/pages/resume.html" },
         { path: "/contact", view: "/pages/contact.html" },
         { path: "/test", view: "/pages/test.html" },
      ];

      // Match route or default to home
      const match = routes.find((r) => r.path === location.pathname) || routes[0];

      try {
         const html = await fetch(match.view).then((res) => res.text());
         document.getElementById("app").innerHTML = html;

         // Call the re-initialization function
         await reinitializeScripts();
      } catch (err) {
         console.error("Failed to load page:", err);
         document.getElementById("app").innerHTML = `<h1>Page not found</h1>`;
      }
   })();

   // --- WAIT FOR BOTH TO COMPLETE ---
   // Promise.all waits for every promise in the array to resolve.
   await Promise.all([minimumDelayPromise, loadContentPromise]);

   // --- HIDE PRELOADER ---
   // This code will only execute after at least 3 seconds have passed AND
   // the content has been successfully fetched and rendered.
   hidePreloader();
};
