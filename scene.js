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

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Move camera from center
camera.position.x = 2; // move right from center of scene
camera.position.y = 1; // move up from center of scene
camera.position.z = 5; // move camera away from center of scene

renderer.render(scene, camera);

const clock = new THREE.Clock();

const render = function () {
    requestAnimationFrame(render);
    const delta = clock.getDelta();

    cube.rotation.x += 3.2 * delta;
    cube.rotation.y += 3.2 * delta;

    renderer.render(scene, camera);
};

render();
