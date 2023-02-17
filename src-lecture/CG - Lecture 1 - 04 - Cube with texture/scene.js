// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
    75,     // fov - Camera frustum vertical field of view
    window.innerWidth / window.innerHeight, // aspect - Camera frustum aspect ratio
    0.1,   // near - Camera frustum near plane
    1000); // far - Camera frustum far plane

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define texture loader
const textureLoader = new THREE.TextureLoader();

// Create geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Define material
const material = new THREE.MeshBasicMaterial({map: textureLoader.load('Yellobrk.bmp')});

// Create mesh
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Define light
const light = new THREE.DirectionalLight(0xdddddd, 1);
light.position.set(0, 0, 1);
scene.add(light);

// Move camera from center
camera.position.x = 2;  // Move right from center of scene
camera.position.y = 1;  // Move up from center of scene
camera.position.z = 5;  // Move camera away from center of scene

// Import camera control and rotation library
const controls = new THREE.OrbitControls(camera, renderer.domElement); 
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.noKeys = true;

const render = function() {
    requestAnimationFrame(render);

    controls.update();

    renderer.render(scene, camera);
}

render();
