/* js/birds.js — 首頁 logo 蝴蝶特效 */
(() => {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    // Prevent multiple initializations during PJAX
    if (heroContent.querySelector('.butterflies-container')) return;

    const container = document.createElement('div');
    container.className = 'butterflies-container';
    // Position exactly in the center of the hero section
    container.style.position = 'absolute';
    container.style.top = '40%';
    container.style.left = '50%';
    container.style.width = '0';
    container.style.height = '0';
    container.style.zIndex = '1'; // Behind the logo text
    container.style.pointerEvents = 'none';
    heroContent.appendChild(container);

    const numButterflies = 6; // Number of butterflies at any time

    function spawnButterfly() {
        if (!document.querySelector('.butterflies-container')) return; // Safety check if page changed

        const butterfly = document.createElement('div');
        butterfly.classList.add('butterfly');
        // Randomize wing-flap speed per butterfly (read by ::before/::after animation)
        butterfly.style.setProperty('--flap-duration', (0.55 + Math.random() * 0.45).toFixed(2) + 's');

        // Spawn around the logo
        const angle = Math.random() * Math.PI * 2;
        const radiusX = 150 + Math.random() * 250;
        const radiusY = 100 + Math.random() * 150;

        const startX = Math.cos(angle) * radiusX;
        const startY = Math.sin(angle) * radiusY;

        // Drift across and gently upwards
        const directionX = Math.random() > 0.5 ? 1 : -1;
        const endX = startX + (directionX * (150 + Math.random() * 200));
        const endY = startY - (80 + Math.random() * 120);

        // Custom scale for distance parallax (0.5 to 1.1)
        const scale = 0.5 + Math.random() * 0.6;

        // Duration 12 to 20 seconds for a slow, drifting flight
        const duration = 12000 + Math.random() * 8000;

        // Fluttering, meandering path instead of a straight line
        const wobbleAmp = 14 + Math.random() * 12;
        const wobbleWaves = 2 + Math.random() * 2;
        const phase = Math.random() * Math.PI * 2;
        const tilt = directionX * (6 + Math.random() * 8);

        const steps = 10;
        const frames = [];
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = startX + (endX - startX) * t
                + Math.sin(t * Math.PI * wobbleWaves + phase) * wobbleAmp;
            const y = startY + (endY - startY) * t
                - Math.sin(t * Math.PI) * 40
                + Math.sin(t * Math.PI * wobbleWaves * 2 + phase) * wobbleAmp * 0.5;
            const opacity = Math.max(Math.min(Math.sin(t * Math.PI) * 1.6, 0.85), 0);
            const rock = Math.sin(t * Math.PI * wobbleWaves + phase) * 6;
            frames.push({
                transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${tilt + rock}deg)`,
                opacity: opacity
            });
        }

        container.appendChild(butterfly);

        const anim = butterfly.animate(frames, {
            duration: duration,
            easing: 'linear'
        });

        anim.onfinish = () => {
            butterfly.remove();
            spawnButterfly(); // Spawn a new one to maintain population
        };
    }

    // Cascade spawning so they don't appear all at once
    for (let i = 0; i < numButterflies; i++) {
        setTimeout(spawnButterfly, Math.random() * 8000);
    }
})();
