/**
 * Load all components
 */
export const init = async () => {
   await loadComponent("#navbar", "/partials/navbar.html");
   await loadComponent("#footer", "/partials/footer.html");
};

/**
 * Load a specific component
 * @param {string} selector  - The CSS selector of where to insert HTML
 * @param {string} url       - The path to the HTML file
 */
async function loadComponent(selector, url) {
   try {
      const container = document.querySelector(selector);
      if (!container) return;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      document.querySelector(selector).innerHTML = await response.text();
   } catch (error) {
      console.error(`Error loading component ${url}:`, error);
   }
}
