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
   window.addEventListener("popstate", router);

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
   } catch (err) {
      document.getElementById("app").innerHTML = `<h1>Page not found</h1>`;
   }
};
