/**
 * Load all components
 */
export const init = async () => {
   // partials
   await loadComponent('navbar', "/partials/navbar.html");
   await loadComponent('footer', "/partials/footer.html");

   // sections
   await loadComponent('home-hero', "/components/home/hero.html");
   await loadComponent('home-about', "/components/home/about.html");
   await loadComponent('home-showcase', "/components/home/showcase.html");
   await loadComponent('home-featured', "/components/home/featured.html");
   await loadComponent('home-contact', "/components/home/contact.html");

   await loadComponent('about-hero', "/components/about/hero.html");
   await loadComponent('about-counters', "/components/about/counters.html");
   await loadComponent('about-skills', "/components/about/skills.html");


   // section or page specific components | Organisms or Molecules
   await loadComponent('home-showcase-card-cta', "/components/home/x/showcase-card-cta.html");
   await loadComponent('home-showcase-card-skills', "/components/home/x/showcase-card-skills.html");

   await loadComponent('input-field', "/components/contact/input.html");
   await loadComponent('textarea-field', "/components/contact/textarea.html");

   // reusable components | Molecules
   await loadComponent('tag-title-text', "/components/molecules/tag-title-text.html");

   // reusable components | Atoms
   await loadComponent('logo', "/components/atoms/logo.html");

   await loadComponent('btn-arrow', "/components/atoms/buttons/arrow.html");
   await loadComponent('btn-primary', "/components/atoms/buttons/primary.html");
   await loadComponent('tag-primary', "/components/atoms/tags/primary.html");
};

/**
 * Load a specific component
 * @param {string} selector  - The CSS selector of where to insert HTML
 * @param {string} url       - The path to the HTML file
 */
async function loadComponent(selector, url) {
   try {
      const containers = document.querySelectorAll(`[slot="${selector}"]`);
      if (containers.length === 0) return;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const responseText = await response.text();

      containers.forEach((container) => {
         container.innerHTML = responseText;
      });
   } catch (error) {
      console.error(`Error loading component ${url}:`, error);
   }
}
