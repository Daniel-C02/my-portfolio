
export const init = () => {
    // Select all buttons that match your specific classes
    const delayedButtons = document.querySelectorAll('a.btn.btn-arrow');

    delayedButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Immediately prevent the default action (like navigating or submitting a form)
            event.preventDefault();

            // Wait for 150 milliseconds (the animation duration)
            setTimeout(() => {
                // Resume the original action
                if (button.tagName === 'A') {
                    // If the button is a link, navigate to its href
                    window.location.href = button.href;
                }
            }, 150);
        });
    });
}