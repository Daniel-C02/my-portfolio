import createGlobe from 'cobe';

export const init = () => {

    const canvas = document.getElementById('cobe-canvas');
    if (!canvas) return;

    let width = 0;
    let currentPhi = 0;
    let currentTheta = 0.3;
    const doublePi = Math.PI * 2;
    const onResize = () => canvas && (width = canvas.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();

    // --- State variables for interaction ---
    let isDragging = false;
    let pointerStart = { x: 0, y: 0 };
    let rotationStart = { phi: 0, theta: 0 };
    let focusPoint = [-1.87, -0.34]; // Target angles [phi, theta]

    // --- NEW: State variables for inertia ---
    let velocity = { x: 0, y: 0 };
    let lastMove = { x: 0, y: 0 };
    const dampingFactor = 0.95; // Determines how quickly the globe slows down

    const locationToAngles = (lat, long) => {
        return [
            Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
            (lat * Math.PI) / 180
        ];
    };

    const globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 3,
        mapSamples: 16000,
        mapBrightness: 1.2,
        baseColor: [0.4, 0.65, 1],
        markerColor: [0.4, 0.8, 1],
        glowColor: [0.27, 0.57, 0.89],
        markers: [
            { location: [-26.2041, 28.0473], size: 0.1 },
            { location: [51.5072, -0.1276], size: 0.1 },
        ],
        onRender: (state) => {
            if (!isDragging) {
                // If not dragging, apply inertia or animate to focus point
                if (Math.abs(velocity.x) > 0 || Math.abs(velocity.y) > 0) {
                    // --- Apply inertia ---
                    currentPhi += velocity.x / 200;
                    currentTheta += velocity.y / 200;
                    velocity.x *= dampingFactor;
                    velocity.y *= dampingFactor;

                    // Stop when velocity is negligible
                    if (Math.abs(velocity.x) < 0.001) velocity.x = 0;
                    if (Math.abs(velocity.y) < 0.001) velocity.y = 0;

                    // Keep focus point updated to the current spinning position
                    focusPoint = [currentPhi, currentTheta];
                } else {
                    // --- Animate to a clicked location ---
                    const [focusPhi, focusTheta] = focusPoint;
                    const distPositive = (focusPhi - currentPhi + doublePi) % doublePi;
                    const distNegative = (currentPhi - focusPhi + doublePi) % doublePi;

                    if (distPositive < distNegative) {
                        currentPhi += distPositive * 0.08;
                    } else {
                        currentPhi -= distNegative * 0.08;
                    }
                    currentTheta = currentTheta * 0.92 + focusTheta * 0.08;
                }
            }

            state.phi = currentPhi;
            state.theta = currentTheta;
            state.width = width * 2;
            state.height = width * 2;
        }
    });

    setTimeout(() => (canvas.style.opacity = '1'), 500);

    const onPointerDown = (e) => {
        isDragging = true;
        canvas.style.cursor = 'grabbing';
        pointerStart.x = e.clientX;
        pointerStart.y = e.clientY;
        rotationStart.phi = currentPhi;
        rotationStart.theta = currentTheta;
        // Reset velocity and set last move position
        velocity = { x: 0, y: 0 };
        lastMove = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
    };

    const onPointerMove = (e) => {
        if (isDragging) {
            const deltaX = e.clientX - pointerStart.x;
            const deltaY = e.clientY - pointerStart.y;

            currentPhi = rotationStart.phi + deltaX / 200;
            currentTheta = rotationStart.theta + deltaY / 200;

            // Calculate velocity based on the change since the last move
            velocity.x = e.clientX - lastMove.x;
            velocity.y = e.clientY - lastMove.y;
            lastMove = { x: e.clientX, y: e.clientY };
        }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerout', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);

    const setFocus = (location) => {
        // Kill any existing inertia when a button is clicked
        velocity = { x: 0, y: 0 };
        focusPoint = locationToAngles(...location);
    };

    document.getElementById('btn-sa').onclick = () => setFocus([-26.2041, 28.0473]);
    document.getElementById('btn-uk').onclick = () => setFocus([51.5072, -0.1276]);

}