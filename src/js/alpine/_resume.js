
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