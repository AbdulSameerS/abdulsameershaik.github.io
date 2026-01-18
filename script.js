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


// --- Three.js Realistic Earth Animation ---
const initEarth = () => {
    const container = document.getElementById('earth-container');
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 18; // Optimal distance
    camera.position.y = 2; // Slight Top/Down view

    // Renderer (Alpha for transparency)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Group to hold everything
    const group = new THREE.Group();
    scene.add(group);

    // Load Textures (Solar System Scope - High Quality)
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/2/22/Earth_Western_Hemisphere_transparent_background.png'); // Fallback or use solid jpg
    // Better source:
    const realEarthMap = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Aurora_as_seen_from_space_during_a_geomagnetic_storm.jpg/1280px-Aurora_as_seen_from_space_during_a_geomagnetic_storm.jpg');

    // Let's use a standard "Blue Marble" style map which is safer for "Exact Earth"
    // Using a reliable CDN for a dark-themed earth or standard earth.
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const earthSpecular = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
    const earthNormal = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');

    // Earth Sphere
    const geometry = new THREE.SphereGeometry(7, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        specularMap: earthSpecular,
        normalMap: earthNormal,
        specular: new THREE.Color(0x333333),
        shininess: 5 // Matte earth
    });

    // Adjust material to fit "Dark Studio" theme (Desaturate slightly via color)
    material.color = new THREE.Color(0xaaaaaa); // Dim it slightly

    const earth = new THREE.Mesh(geometry, material);
    group.add(earth);

    // Atmosphere Glow
    const atmGeometry = new THREE.SphereGeometry(7.2, 64, 64);
    const atmMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmGeometry, atmMaterial);
    group.add(atmosphere);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // General soft light
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(20, 10, 20); // Sun position
    scene.add(sunLight);

    // Stars Particles
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const posArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 80; // Spread stars
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);


    // Animation
    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.0015; // Realistic day spin
        atmosphere.rotation.y += 0.0015;
        stars.rotation.y -= 0.0002;
        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', initEarth);
