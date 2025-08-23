
export const init = () => {
    const targets = document.querySelectorAll('.js-hover-target');
    targets.forEach(target => {
        console.log('each target');
        let timeout;
        target.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => target.classList.add('hover'), 100);
        });
        target.addEventListener('mouseleave', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => target.classList.remove('hover'), 100);
        });
    });
}
