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

// Define material
const textureSand = textureLoader.load('sand.jpg');
textureSand.wrapS = textureSand.wrapT = THREE.RepeatWrapping;
textureSand.repeat.set( 100, 100);
const textureCactus = textureLoader.load('cactus.jpg');
const materialSand = new THREE.MeshBasicMaterial({map: textureSand});
const materialCactus = new THREE.MeshBasicMaterial({map: textureCactus});

// Create skybox
let materialArray = [];
let texture_ft = textureLoader.load( 'sky/sky_ft.jpg');
let texture_bk = textureLoader.load( 'sky/sky_bk.jpg');
let texture_up = textureLoader.load( 'sky/sky_up.jpg');
let texture_dn = textureLoader.load( 'sky/sky_dn.jpg');
let texture_rt = textureLoader.load( 'sky/sky_rt.jpg');
let texture_lf = textureLoader.load( 'sky/sky_lf.jpg');

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

// Create geometry
const geometry = new THREE.BoxGeometry(1000, 1, 1000);
const cube = new THREE.Mesh(geometry, materialSand);
scene.add(cube);

// Create cactus function
const cactusStem = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 7);
const cactusStemMesh = new THREE.Mesh(cactusStem, materialCactus)
cactusStemMesh.position.x = 5;
cactusStemMesh.position.y = 1.2;

const cactusTop = new THREE.IcosahedronGeometry(0.2, 1)
const cactusTopMesh = new THREE.Mesh(cactusTop, materialCactus)
cactusTopMesh.position.x = 5;
cactusTopMesh.position.y = 1.95;

scene.add(cactusStemMesh);
scene.add(cactusTopMesh);

function createCactus(x,z) {
    const cactusStem = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 7);
    const cactusStemMesh = new THREE.Mesh(cactusStem, materialCactus)
    cactusStemMesh.position.x = x;
    cactusStemMesh.position.y = 1.2;
    cactusStemMesh.position.z = z;

    const cactusTop = new THREE.IcosahedronGeometry(0.2, 1)
    const cactusTopMesh = new THREE.Mesh(cactusTop, materialCactus)
    cactusTopMesh.position.x = x;
    cactusTopMesh.position.y = 1.95;
    cactusTopMesh.position.z = z;

    scene.add(cactusStemMesh);
    scene.add(cactusTopMesh);
}

function spreadCactus() {
    for(var i = -500; i < 500; i = i + 25) {
        for(var j = -500; j < 500; j = j + 25) {
                let randomNum = Math.random() * 20 - 10;
            let randomNum2 = Math.random() * 20 - 10;
            createCactus(i + randomNum,j + randomNum2);
        }
    }
}

// Add RV
const loader = new THREE.GLTFLoader();
loader.load("rv.glb", function(gltf) {
    gltf.scene.position.y = 0.5;
    scene.add(gltf.scene);
});

// Add Walter
loader.load("walter.glb", function(gltf) {
    gltf.scene.scale.set(2,2,2);
    gltf.scene.rotation.x = 3.1
    gltf.scene.position.y = 0.65;
    gltf.scene.position.z = 5;
    scene.add(gltf.scene);
});

// Define light
const light = new THREE.DirectionalLight(0xdddddd, 5);
light.position.set(2, 4, 1);
scene.add(light);

// Move camera from center
camera.position.x = 0;  // Move right from center of scene
camera.position.y = 3;  // Move up from center of scene
camera.position.z = 100;  // Move camera away from center of scene

// Import camera control and rotation library
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.noKeys = true;
controls.maxDistance = 50;

const render = function() {
    requestAnimationFrame(render);

    controls.update();

    renderer.render(scene, camera);
}

render();
spreadCactus();
