// Make Vite watch HTML partials for hot reloads.
import.meta.glob("./pages/**/*.html", { eager: true, query: '?raw' });
import.meta.glob("./components/**/*.html", { eager: true, query: '?raw' });

// This code only runs in development and is removed from production builds.
if (import.meta.hot) {
    // Save scroll position
    const saveScrollPos = () => sessionStorage.setItem('scrollPosition', window.scrollY);

    // Save scroll position right before the page reloads.
    import.meta.hot.on('vite:beforeFullReload', saveScrollPos);
    window.addEventListener("beforeunload", saveScrollPos);

    // Restore scroll position after the page has reloaded.
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {

        // Delay scroll to wait for the page content to render.
        setTimeout(() => {
            const html = document.documentElement;
            html.style.scrollBehavior = "auto"; // turn off smooth scroll
            void html.offsetHeight; // force a reflow so browser applies it immediately
            window.scrollTo(0, parseInt(scrollPosition)); // now jump
        }, 190);

        // Clean up the stored value after use.
        sessionStorage.removeItem('scrollPosition');
    }
}