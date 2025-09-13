import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

export const init = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
}

