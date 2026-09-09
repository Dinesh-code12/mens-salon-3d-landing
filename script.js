// Three.js 3D Scene Setup
let scene, camera, renderer;
let barbershopChair;
let particles = [];

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.Fog(0x1a1a1a, 100, 1000);

    // Camera
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer
    const container = document.getElementById('canvas-container');
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd4af37, 1);
    pointLight.position.set(5, 5, 5);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-5, 8, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create 3D Objects
    createBarberChair();
    createScissors();
    createFloatingParticles();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createBarberChair() {
    const chairGroup = new THREE.Group();

    // Base
    const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6, roughness: 0.4 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0;
    base.castShadow = true;
    base.receiveShadow = true;
    chairGroup.add(base);

    // Pedestal
    const pedestalGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32);
    const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x2d2d2d, metalness: 0.8, roughness: 0.2 });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.position.y = 0.85;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    chairGroup.add(pedestal);

    // Seat
    const seatGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.7 });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.scale.y = 0.6;
    seat.position.y = 2;
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);

    // Backrest
    const backrestGeometry = new THREE.BoxGeometry(1, 1.2, 0.3);
    const backrest = new THREE.Mesh(backrestGeometry, seatMaterial);
    backrest.position.set(0, 2.8, -0.6);
    backrest.castShadow = true;
    backrest.receiveShadow = true;
    chairGroup.add(backrest);

    // Armrests
    const armrestGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.8);
    const armrestMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.5, roughness: 0.5 });
    
    const leftArmrest = new THREE.Mesh(armrestGeometry, armrestMaterial);
    leftArmrest.position.set(-0.8, 2, 0);
    leftArmrest.castShadow = true;
    leftArmrest.receiveShadow = true;
    chairGroup.add(leftArmrest);

    const rightArmrest = new THREE.Mesh(armrestGeometry, armrestMaterial);
    rightArmrest.position.set(0.8, 2, 0);
    rightArmrest.castShadow = true;
    rightArmrest.receiveShadow = true;
    chairGroup.add(rightArmrest);

    chairGroup.position.set(0, 0, 0);
    scene.add(chairGroup);
    barbershopChair = chairGroup;
}

function createScissors() {
    const scissorsGroup = new THREE.Group();

    // Blade 1
    const blade1Geometry = new THREE.BoxGeometry(0.1, 1.5, 0.05);
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 });
    const blade1 = new THREE.Mesh(blade1Geometry, bladeMaterial);
    blade1.position.set(-0.2, 3.5, 2);
    blade1.rotation.z = 0.5;
    blade1.castShadow = true;
    scissorsGroup.add(blade1);

    // Blade 2
    const blade2 = new THREE.Mesh(blade1Geometry, bladeMaterial);
    blade2.position.set(0.2, 3.5, 2);
    blade2.rotation.z = -0.5;
    blade2.castShadow = true;
    scissorsGroup.add(blade2);

    scissorsGroup.position.z = -1;
    scene.add(scissorsGroup);
}

function createFloatingParticles() {
    const particleCount = 50;
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37 });

    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 15,
            Math.random() * 8,
            (Math.random() - 0.5) * 10
        );

        particle.velocity = {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        };

        particles.push(particle);
        scene.add(particle);
    }
}

function updateParticles() {
    particles.forEach(particle => {
        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y;
        particle.position.z += particle.velocity.z;

        // Bounce off boundaries
        if (Math.abs(particle.position.x) > 7.5) particle.velocity.x *= -1;
        if (particle.position.y > 8 || particle.position.y < 0) particle.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 5) particle.velocity.z *= -1;
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate chair
    if (barbershopChair) {
        barbershopChair.rotation.y += 0.003;
    }

    // Update particles
    updateParticles();

    // Render scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Initialize when page loads
window.addEventListener('load', initThreeJS);

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}