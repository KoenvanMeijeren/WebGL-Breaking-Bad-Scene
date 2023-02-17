// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
    75,     // fov - Camera frustum vertical field of view
    window.innerWidth / window.innerHeight, // aspect - Camera frustum aspect ratio
    0.1,   // near - Camera frustum near plane
    10000); // far - Camera frustum far plane

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define texture loader
const textureLoader = new THREE.TextureLoader();

// Create geometry
const geometry = new THREE.BoxGeometry(1000, 1, 1000);

// Define material
const texture = textureLoader.load('sand.jpg');
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 100, 100);
const material = new THREE.MeshBasicMaterial({map: texture});

// Create skybox
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( 'yonder_ft.jpg');
let texture_bk = new THREE.TextureLoader().load( 'yonder_bk.jpg');
let texture_up = new THREE.TextureLoader().load( 'yonder_up.jpg');
let texture_dn = new THREE.TextureLoader().load( 'yonder_dn.jpg');
let texture_rt = new THREE.TextureLoader().load( 'yonder_rt.jpg');
let texture_lf = new THREE.TextureLoader().load( 'yonder_lf.jpg');

materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;

let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
scene.add( skybox );

// Create mesh
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create RV
const loader = new THREE.GLTFLoader();
loader.load("rv.glb", function(gltf) {
    scene.add(gltf.scene);
});

// Define light
const light = new THREE.DirectionalLight(0xdddddd, 1);
light.position.set(0, 0, 1);
scene.add(light);

// Move camera from center
camera.position.x = 2;  // Move right from center of scene
camera.position.y = 2;  // Move up from center of scene
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
