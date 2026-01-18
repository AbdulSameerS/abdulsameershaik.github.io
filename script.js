// Update mouse position for spotlight effect
const root = document.documentElement;

document.addEventListener('mousemove', (e) => {
    root.style.setProperty('--mouse-x', e.clientX + "px");
    root.style.setProperty('--mouse-y', e.clientY + "px");
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

console.log("UX/DX Theme Loaded");
