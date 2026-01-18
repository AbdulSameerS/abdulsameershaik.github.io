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


// --- Three.js Earth Animation ---
const initEarth = () => {
    const container = document.getElementById('earth-container');
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 20; // Zoom out to see whole globe
    camera.position.y = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Dotted Sphere (The "Earth")
    const geometry = new THREE.IcosahedronGeometry(8, 2); // Radius 8, Detail 2
    const material = new THREE.PointsMaterial({
        color: 0x666666, // Cool Grey
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    const earthPoints = new THREE.Points(geometry, material);
    globeGroup.add(earthPoints);

    // 2. Inner Core (Solid black/dark sphere to block background stars)
    const coreGeometry = new THREE.SphereGeometry(7.8, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x030303 }); // Match bg
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(core);

    // 3. Atmosphere Glow (Subtle)
    const atmGeometry = new THREE.SphereGeometry(8.2, 32, 32);
    const atmMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.02,
        side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmGeometry, atmMaterial);
    globeGroup.add(atmosphere);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotation
        globeGroup.rotation.y += 0.001; // Slow spin
        globeGroup.rotation.x = 0.2; // Tilt

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', initEarth);
