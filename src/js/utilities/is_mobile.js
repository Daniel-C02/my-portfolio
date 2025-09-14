
export function isMobile() {
    // Check for a coarse pointer (e.g., a finger) and no hover capability
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const hasNoHover = window.matchMedia('(hover: none)').matches;

    return hasCoarsePointer && hasNoHover;
}
