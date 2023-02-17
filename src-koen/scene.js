// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
    75,     // fov - Camera frustum vertical field of view
    window.innerWidth / window.innerHeight, // aspect - Camera frustum aspect ratio
    0.1,   // near - Camera frustum near plane
    1000   // far - Camera frustum far plane
);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const sceneContainer = document.getElementsByClassName('scene-container')[0];
sceneContainer.innerHTML = "";
sceneContainer.appendChild( renderer.domElement );

const materials = [];
materials.push(new THREE.MeshNormalMaterial());
materials.push(new THREE.MeshBasicMaterial({ color: 0xad0000 }));
materials.push(new THREE.MeshPhongMaterial({ color: 0xad0000 , shininess: 100 }));
materials.push(new THREE.MeshLambertMaterial({color: 0xad0000, shininess: 100 }));
materials.push(new THREE.MeshBasicMaterial({ color: 0xad0000, transparent: true, opacity:.2 }));
materials.push(new THREE.MeshBasicMaterial({ color: 0xad0000, wireframe: true }));

const geometry = new THREE.BoxGeometry(1,1,1);
const cube = new THREE.Mesh(geometry, materials[0]);
scene.add(cube);

// Move camera from center
camera.position.x = 2; // move right from center of scene
camera.position.y = 1; // move up from center of scene
camera.position.z = 5; // move camera away from center of scene

renderer.render(scene, camera);

const clock = new THREE.Clock();

const rotateCube = function () {
    requestAnimationFrame(rotateCube);
    const delta = clock.getDelta();

    cube.rotation.x += 3.2 * delta;
    cube.rotation.y += 3.2 * delta;

    renderer.render(scene, camera);
}

const changeCubeMaterial = function (index) {
    cube.material = materials[index];
    renderer.render(scene, camera);
}

const addLight = function () {
    const light = new THREE.DirectionalLight(0xdddd00, 1);
    light.position.set(0, 0, 1 );
    scene.add(light);
    renderer.render(scene, camera);
}

const resetScene = function () {
    window.location.reload();
}