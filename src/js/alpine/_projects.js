export const projects = [
    {
        id: 1,
        isFeatured: true,
        title: "High Five Videos (Hive Platform)",
        timeline: "Aug 2024 – Dec 2024",
        image: null,
        intro: "Subscription-platform connecting video editors, companies, and customers with intuitive workflows, content discovery, and flexible subscription management.",
        tags: ["Laravel", "Livewire", "Subscription", "Video Platform"],
        projectType: "Web Application",
        category: "Client Work",
        categoryIcon: "bi-briefcase",
        sourceCodeUrl: null,
        accomplishments: [
            "Built multiple user roles (customers, video editors, admins) each with distinct dashboards and UX paths.",
            "Implemented complex subscription & payout systems, content upload, and performance tracking for editors.",
            "Optimised UI/UX for content discovery and improved usability across devices."
        ]
    },
    {
        id: 2,
        isFeatured: true,
        title: "Hartree Data Platform",
        timeline: "Sept 2024 – Nov 2024",
        image: null,
        intro: "Data-driven React platform for global commodities trading; real-time analytics, custom dashboards and flexible, backend-agnostic component library.",
        tags: ["React", "Data Visualisation", "Dashboards"],
        projectType: "Web Application",
        category: "Client Work",
        categoryIcon: "bi-briefcase",
        sourceCodeUrl: null,
        accomplishments: [
            "Designed and built a modular component library using React & Storybook to allow flexible UI elements for data analytics.",
            "Created customisable dashboards supporting real-time data visualisation, filters, and reports.",
            "Ensured UX flows that handle large, complex datasets while maintaining clarity and responsiveness."
        ]
    },
    {
        id: 3,
        isFeatured: true,
        title: "CrackerJack Job-Match Discovery Platform",
        timeline: "Jun 2025 – Present",
        image: null,
        intro: "AI-powered job matching platform that connects job seekers with companies, optimising discovery and matching workflows.",
        tags: ["Laravel", "Livewire", "AI", "Matches"],
        projectType: "Web Application",
        category: "Client Work",
        categoryIcon: "bi-briefcase",
        sourceCodeUrl: null,
        accomplishments: [
            "Built matching algorithm integration using OpenAI to improve job-to-candidate relevance.",
            "Created roles and flows for employers and job seekers: searching, applying, reviewing matches.",
            "Developed interactive front-end widgets and dashboards to enhance user engagement."
        ]
    },
    {
        id: 4,
        isFeatured: false,
        title: "Portfolio Website",
        timeline: "2025-ongoing",
        image: null,
        intro: "Personal portfolio built using only HTML, JS, Alpine.js and related utilities. Showcases skills, projects, achievements with minimal dependencies.",
        tags: ["HTML", "JavaScript", "Alpine.js", "Personal"],
        projectType: "Web Application",
        category: "Personal Project",
        categoryIcon: "bi-person-badge",
        sourceCodeUrl: "https://github.com/Daniel-C02/my-portfolio",
        accomplishments: [
            "Designed and built layout from scratch without a framework, focusing on performance and minimal dependencies.",
            "Demonstrated clean code structure and responsive design across devices.",
            "Showcased projects, skills, and timeline in a dynamic and easily maintainable way."
        ]
    },
    {
        id: 5,
        isFeatured: false,
        title: "Like-a-Tourist Booking Platform",
        timeline: "May 2024 – Aug 2024",
        image: null,
        intro: "Laravel + Livewire + Filament app for advanced booking, with integrations for Stripe, Meilisearch, and nightsbridge. Heavy backend work. (Private repo)",
        tags: ["Laravel", "Livewire", "Filament", "Payment Integration"],
        projectType: "Web Application",
        category: "Client Work",
        categoryIcon: "bi-briefcase",
        sourceCodeUrl: null,
        accomplishments: [
            "Implemented full booking journey with payment gateway (Stripe) and nightsbridge integration.",
            "Built search functionality using Meilisearch for fast, relevant results.",
            "Took over majority of codebase, delivering over 75% of feature set during heavy backend load."
        ]
    },
    {
        id: 6,
        isFeatured: false,
        title: "HICO Group Website Redesign",
        timeline: "2024-08 – 2025-03",
        image: null,
        intro: "Redesigned the website of HICO Group — an AI & data consultancy — to showcase expertise, improve UX, integrate with Odoo via a custom frontend, and elevate their digital presence.",
        tags: ["HTML", "SCSS", "JavaScript", "Odoo Integration", "UX/UI"],
        projectType: "Web Application",
        category: "Client Work",
        categoryIcon: "bi-briefcase",
        sourceCodeUrl: null,
        accomplishments: [
            "Built custom frontend using raw HTML, SCSS, and JavaScript to ensure compatibility with Odoo and client’s internal systems.",
            "Designed an intricate UI with complex design elements (irregular borders, custom shapes, animations), while enforcing consistency via a style guide.",
            "Restructured information architecture to improve content discoverability, defined clear navigation/user flows (‘For Who’, ‘How We Work’), and added dynamic forms to improve conversion paths."
        ]
    },
    {
        id: 7,
        isFeatured: false,
        title: "CubeZoo Website Revamp",
        timeline: "Mar 2025 – May 2025",
        image: null,
        intro: "Full-screen redesign of the CubeZoo website with enhanced animation, feature-rich front end, stronger Alpine.js usage to improve interactivity and user engagement.",
        tags: ["Laravel", "Alpine.js", "Frontend Animation", "Responsive Design", "UX enhancements"],
        projectType: "Web Application",
        category: "Client Work",
        categoryIcon: "bi-briefcase",
        sourceCodeUrl: null,
        accomplishments: [
            "Implemented immersive animation and interactive features using Alpine.js to provide a modern, engaging homepage and browsing experience.",
            "Upgraded frontend architecture for improved performance and maintainability, optimizing assets, layout rendering, and responsiveness across devices.",
            "Revamped site layout and content presentation to better showcase portfolio, services, and projects with clarity and visual impact."
        ]
    }
]


export function projectsAlpine() {
    return {
        activeTag: null,
        is_grid: true,
        searchQuery: '', // This will hold the value of the search input

        filterTags: [
            'All Projects',
            // This will be dynamically populated with project types
        ],

        // This is a computed property that reactively filters projects based on the active tag and search query.
        get filteredProjects() {
            // Start with the full list of projects.
            let projectsToShow = projects;

            // 1. Filter projects based on the selected 'activeTag'.
            // We check if a tag is selected and it's not 'All Projects'.
            if (this.activeTag && this.activeTag !== 'All Projects') {
                projectsToShow = projectsToShow.filter(
                    project => project.projectType === this.activeTag
                );
            }

            // 2. Filter the already-tagged projects based on the 'searchQuery'.
            // We proceed only if the search query is not empty.
            if (this.searchQuery.trim() !== '') {
                // Convert the search query to lowercase for case-insensitive matching.
                const query = this.searchQuery.toLowerCase().trim();
                projectsToShow = projectsToShow.filter(project => {
                    // Create a single string of all searchable project data.
                    // This makes it easy to check if the query exists anywhere in the project's details.
                    const searchableContent = `
                        ${project.title}
                        ${project.timeline}
                        ${project.into}
                        ${project.tags.join(' ')}
                        ${project.projectType}
                        ${project.category}
                        ${project.accomplishments.join(' ')}
                    `.toLowerCase();

                    // Return true if the searchable content includes the query.
                    return searchableContent.includes(query);
                });
            }

            return projectsToShow;
        },

        init() {
            // Dynamically create filter tags from project types.
            const projectTypes = [...new Set(this.projects.map(p => p.projectType))];
            this.filterTags.push(...projectTypes);

            // Set the initial active tag to 'All Projects'.
            this.activeTag = this.filterTags[0];
        }
    }
}