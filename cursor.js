// cursor.js - Custom mouse cursor for ThunderGits Website
(function() {
    // Only initialize on desktop devices with a fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    // Read theme color from CSS variable (auto-updates with theme)
    const rgb = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-rgb').trim() || '220, 38, 38';

    // Inject CSS styles dynamically — colors read from theme variable
    const style = document.createElement('style');
    style.innerHTML = `
        /* Hide default cursor on desktop for main elements */
        @media (pointer: fine) {
            html, body, a, button, [role="button"], .cursor-pointer {
                cursor: none !important;
            }
            input, textarea, select, option {
                cursor: auto !important;
            }
        }

        .custom-cursor-dot {
            width: 8px;
            height: 8px;
            background-color: rgba(${rgb}, 1);
            border-radius: 50%;
            position: fixed;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999999;
            opacity: 0;
            transition: width 0.2s ease, height 0.2s ease, background-color 0.2s ease, opacity 0.3s ease;
            box-shadow: 0 0 8px rgba(${rgb}, 0.6);
        }

        .custom-cursor-circle {
            width: 36px;
            height: 36px;
            border: 1.5px solid rgba(${rgb}, 0.5);
            border-radius: 50%;
            position: fixed;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999998;
            opacity: 0;
            transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
        }

        /* Hover states on interactive elements */
        .custom-cursor-dot.hover {
            width: 6px;
            height: 6px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(255, 255, 255, 1);
        }

        .custom-cursor-circle.hover {
            width: 52px;
            height: 52px;
            border-color: rgba(${rgb}, 0.9);
            background-color: rgba(${rgb}, 0.12);
            box-shadow: 0 0 15px rgba(${rgb}, 0.25);
        }

        /* Click feedback */
        .custom-cursor-dot.click {
            transform: translate(-50%, -50%) scale(1.4);
            background-color: rgba(${rgb}, 0.8);
        }

        .custom-cursor-circle.click {
            transform: translate(-50%, -50%) scale(0.8);
            border-color: rgba(${rgb}, 1);
            background-color: rgba(${rgb}, 0.1);
        }
    `;
    document.head.appendChild(style);

    // Create cursor DOM elements
    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';

    const circle = document.createElement('div');
    circle.className = 'custom-cursor-circle';

    document.body.appendChild(dot);
    document.body.appendChild(circle);

    // Position variables
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let dotX = mouseX;
    let dotY = mouseY;

    let circleX = mouseX;
    let circleY = mouseY;

    let isVisible = false;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            dot.style.opacity = '1';
            circle.style.opacity = '1';
            isVisible = true;
        }
    });

    // Animate cursor smooth lag (linear interpolation)
    function animateCursor() {
        // Dot follows fast (high speed factor)
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;

        // Circle follows slower for a premium elastic lag effect
        circleX += (mouseX - circleX) * 0.12;
        circleY += (mouseY - circleY) * 0.12;

        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        circle.style.left = `${circleX}px`;
        circle.style.top = `${circleY}px`;

        requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);

    // Handle mouse enter/leave browser viewport
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        circle.style.opacity = '0';
        isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        circle.style.opacity = '1';
        isVisible = true;
    });

    // Click effects
    document.addEventListener('mousedown', () => {
        dot.classList.add('click');
        circle.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
        dot.classList.remove('click');
        circle.classList.remove('click');
    });

    // Dynamic hover effects and hiding on inputs
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        if (!target) return;

        // Hide custom cursor on text inputs to allow default text selection cursor
        const isInputField = target.closest('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="search"], textarea, select');
        if (isInputField) {
            dot.style.opacity = '0';
            circle.style.opacity = '0';
            return;
        } else {
            if (isVisible) {
                dot.style.opacity = '1';
                circle.style.opacity = '1';
            }
        }

        // Add hover styles on interactive elements
        const isHoverable = target.closest('a, button, input[type="submit"], input[type="button"], .cursor-pointer, [role="button"], iframe');
        if (isHoverable) {
            dot.classList.add('hover');
            circle.classList.add('hover');
        } else {
            dot.classList.remove('hover');
            circle.classList.remove('hover');
        }
    });
})();
