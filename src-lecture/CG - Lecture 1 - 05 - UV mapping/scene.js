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

// Define the positions, normals and uvs of the faces
// See also: https://threejsfundamentals.org/threejs/lessons/threejs-custom-buffergeometry.html
positions = [
    0, 0, 0,
    1, 0, 0,
    1, 1, 0];
normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1];
uvs = [
    0, 0,
    1, 0,
    0, 1];  // has to be 1,1

// Create geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(positions), 3));
geometry.setAttribute('normal',
    new THREE.BufferAttribute(new Float32Array(normals), 3));
geometry.setAttribute('uv',
    new THREE.BufferAttribute(new Float32Array(uvs), 2));
    
// Define material
const material = new THREE.MeshBasicMaterial({map: textureLoader.load("Yellobrk.bmp")});

// Create mesh
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Define light
const light = new THREE.DirectionalLight(0xdddddd, 1);
light.position.set(0, 0, 1);
scene.add(light);

camera.position.x = .5;
camera.position.y = .5;
camera.position.z = 1;

const render = function() {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
}

render();
