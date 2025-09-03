export const copyEmail = (text, btn) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            // change the tooltip text to 'Copied!'
            const tooltipInner = document.querySelector('.tooltip.copy-email-tooltip .tooltip-inner');
            tooltipInner.innerText = 'Copied!';
            // Reset after 1.5s
            setTimeout(() => {
                // reset tooltip text
                tooltipInner.innerText = 'Copy';
                // remove focus from the button
                btn.blur();
            }, 1500);
        })
        .catch(err => console.error('Failed to copy: ', err));
}