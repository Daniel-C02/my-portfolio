
// -----------------------------------------------------------------------------------------------------------------
// --- Scroll Lock Functions ---
const html = document.documentElement;
const body = document.body;

// A function to apply scroll-locking styles
export const lockScroll = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.paddingRight = `${scrollbarWidth}px`;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
};

// A function to remove scroll-locking styles
export const unlockScroll = () => {
    html.style.overflow = '';
    body.style.overflow = '';
    body.style.paddingRight = '';
};
