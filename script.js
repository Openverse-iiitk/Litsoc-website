// Initialize Three.js components
const scene = new THREE.Scene();
scene.background = null; // To make it transparent
// Set scene background to black

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Renderer setup with alpha for transparency
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Instead of appending to body, use the container div
document.getElementById('model-container').appendChild(renderer.domElement);


// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(1, 1, 1);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1);
scene.add(directionalLight2);

// Model loading
const loader = new THREE.GLTFLoader();
let model;

loader.load(
  'model.glb',  // Your model path
  (gltf) => {
    document.getElementById('loading').style.display = 'none';
    model = gltf.scene;

    // Center and scale model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const size = box.getSize(new THREE.Vector3()).length();
    const targetSize = 6; // Desired size of the model
    model.scale.multiplyScalar(targetSize / size);

    scene.add(model);
  },
  (xhr) => {
    const percentLoaded = (xhr.loaded / xhr.total * 100).toFixed(2);
    document.getElementById('loading').textContent = `Loading model... ${percentLoaded}%`;
  },
  (error) => {
    console.error('Error loading model:', error);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').textContent = `Failed to load model: ${error.message}`;

    // Add fallback cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  }
);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y = mouseX * Math.PI * 0.5;
    model.rotation.x = mouseY * Math.PI * 0.2;
  }

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
