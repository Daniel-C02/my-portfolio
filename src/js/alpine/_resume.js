
export function resumeAlpine() {
    return {
        activeFilter: null,

        filters: [
            { name: 'Skills', iconClass: 'bi-lightning-fill' },
            { name: 'Education', iconClass: 'bi-mortarboard-fill' },
            { name: 'Experience', iconClass: 'bi-briefcase-fill' },
            { name: 'Certifications', iconClass: 'bi-award-fill' }
        ],

        toggleFilter(filterName) {
            this.activeFilter = filterName;
            window.dispatchEvent(new CustomEvent('filter-toggle', { detail: {
                filter: this.activeFilter,
            }}));
        },

        init() {
            this.$nextTick(() => {
                this.activeFilter = this.filters[0].name;
            });
        }
    }
}
export const certifications = [
    {
        name: 'The Data Science Course: Complete Data Science Bootcamp 2024',
        institution: 'Udemy',
        date: 'June 2024',
        tags: ['Python', 'Data Analysis', 'Machine Learning', 'Statistics'],
        credentialId: null,
    },
    {
        name: 'Bootstrap 5 From Scratch | Build 5 Modern Websites',
        institution: 'Udemy',
        date: 'March 2024',
        tags: ['Bootstrap', 'Frontend Development', 'Responsive Design'],
        credentialId: null,
    },
    {
        name: 'The Complete 2023 Web Development Bootcamp',
        institution: 'Udemy',
        date: 'May 2023',
        tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React', 'Databases'],
        credentialId: null,
    },
    {
        name: 'Django 3 – Full Stack Websites with Python Web Development',
        institution: 'Udemy',
        date: 'May 2020',
        tags: ['Python', 'Django', 'Web Development'],
        credentialId: null,
    },
    {
        name: 'The Complete Python Bootcamp: From Zero to Hero',
        institution: 'Udemy',
        date: 'January 2020',
        tags: ['Python', 'Programming Fundamentals', 'Problem Solving'],
        credentialId: null,
    },
];

export const educationItems = [
    {
        degreeType: 'Bachelor of Science',
        degreeName: 'Mathematical Sciences in Computer Science & Mathematics',
        institution: 'University of Johannesburg',
        courses: [
            'Data Structures & Algorithms',
            'Database Systems & SQL',
            'Operating Systems & Computer Architecture',
            'Software Engineering & Project Management',
            'Artificial Intelligence & Machine Learning Basics',
            'Programming Fundamentals (Python, Java, C++)',
            'Web Development (Frontend & Backend)',
            'Mathematical Analysis & Calculus',
            'Linear Algebra & Abstract Algebra',
            'Applied Mathematics & Numerical Methods',
            'Probability Theory & Statistics',
            'Mathematical Modelling & Optimization'
        ],
        timeline: '2021 – 2023',
        location: 'Johannesburg, South Africa',
        status: 'Completed with multiple distinctions',
    },
];

export const experienceItems = [
    {
        name: 'Software Engineer',
        type: 'CubeZoo',
        intro: 'Full-stack Laravel developer, delivering large-scale web applications across industries with a focus on performance, scalability, and clean code.',
        timeline: 'Feb 2024 – Present',
        responsibilities: [
            'Delivered 9+ major client projects using Laravel, Livewire, Alpine.js, and React.',
            'Led development teams, managed direct client communication, and ensured project success under tight deadlines.',
            'Built feature-rich, animation-heavy frontends and optimized backends for performance and maintainability.',
            'Awarded CubeZoo’s "Remarkable Achievement" award in 2024 for outstanding contributions and leadership.',
        ],
    },
    {
        name: 'Freelance Developer',
        type: 'Self-employed',
        intro: 'Worked independently on personal and client projects, showcasing versatility and continuous learning.',
        timeline: '2020 – Present',
        responsibilities: [
            'Developed a forex social media platform in Django and Python, deployed across AWS and Azure.',
            'Built and maintained personal projects including a portfolio website using pure HTML, JS, and Alpine.js.',
            'Took on freelance web projects, strengthening adaptability and client collaboration skills.',
        ],
    },
];

export const primarySkills = [
    {
        title: 'Full-Stack Development',
        text: 'Deep expertise in Laravel, Livewire, and Alpine.js with strong frontend and backend integration skills.',
        iconClass: 'bi-code-slash',
    },
    {
        title: 'Frontend Engineering',
        text: 'Proficient in JavaScript, Bootstrap, Tailwind, GSAP, and React, delivering responsive, feature-rich user interfaces.',
        iconClass: 'bi-window-stack',
    },
    {
        title: 'Backend Engineering',
        text: 'Experienced in database design and API development with MySQL, MariaDB, and Dockerized environments.',
        iconClass: 'bi-database',
    },
    {
        title: 'Problem Solving & Optimization',
        text: 'Knack for debugging, performance optimization, and delivering efficient, maintainable code under pressure.',
        iconClass: 'bi-lightbulb',
    },
];

export const softSkills = [
    {
        title: 'Problem Solving',
        text: 'Breaks down complex challenges into structured, practical solutions.',
    },
    {
        title: 'Leadership',
        text: 'Proven team leader, guiding colleagues and making quick decisions under pressure.',
    },
    {
        title: 'Adaptability',
        text: 'Learns and applies new technologies quickly to meet project needs.',
    },
    {
        title: 'Communication',
        text: 'Explains technical concepts clearly to both technical and non-technical stakeholders.',
    },
    {
        title: 'Competitiveness',
        text: 'Brings a driven, competitive edge from sports into professional growth and project delivery.',
    },
    {
        title: 'Collaboration',
        text: 'Works well across teams while maintaining harmony and pushing towards shared goals.',
    },
];
