const scene = new THREE.Scene();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(
    75,     // fov - Camera frustum vertical field of view
    window.innerWidth / window.innerHeight, // aspect - Camera frustum aspect ratio
    0.1,   // near - Camera frustum near plane
    5000 // far - Camera frustum far plane
);

// Settings
const skyBoxScale = 2500,
    floorScale = 500,
    floorRepeats = 100,
    cactusSpreadRadius = 250,
    tumbleWeedSpreadRadius = 100,
    flamingoStartPosition = -20,
    flamingoEndPosition = 20,
    hayBaleScale = 0.2;

const light = new THREE.DirectionalLight(0xdddddd, 5);
light.position.set(2, 4, 1);
scene.add(light);

camera.position.x = 50;  // Move right from center of scene
camera.position.y = 20;  // Move up from center of scene
camera.position.z = 50;  // Move camera away from center of scene

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new THREE.GLTFLoader();
const animationMixers = [];

const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.noKeys = true;
orbitControls.maxDistance = 20;

const textureSand = textureLoader.load('assets/sand.jpg');
textureSand.wrapS = textureSand.wrapT = THREE.RepeatWrapping;
textureSand.repeat.set(floorRepeats, floorRepeats);
const textureCactus = textureLoader.load('assets/cactus.jpg');
const materialSand = new THREE.MeshBasicMaterial({map: textureSand});
const materialCactus = new THREE.MeshBasicMaterial({map: textureCactus});

let skyBoxMaterials = [];
skyBoxMaterials.push(new THREE.MeshBasicMaterial({map: textureLoader.load('assets/sky/sky_ft.jpg'), side: THREE.BackSide}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({map: textureLoader.load('assets/sky/sky_bk.jpg'), side: THREE.BackSide}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({map: textureLoader.load('assets/sky/sky_up.jpg'), side: THREE.BackSide}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({map: textureLoader.load('assets/sky/sky_dn.jpg'), side: THREE.BackSide}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({map: textureLoader.load('assets/sky/sky_rt.jpg'), side: THREE.BackSide}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({map: textureLoader.load('assets/sky/sky_lf.jpg'), side: THREE.BackSide}));

let skyboxGeometry = new THREE.BoxGeometry(skyBoxScale, skyBoxScale, skyBoxScale);
let skybox = new THREE.Mesh(skyboxGeometry, skyBoxMaterials);
scene.add(skybox);

const floorGeometry = new THREE.BoxGeometry(floorScale, 1, floorScale);
const floor = new THREE.Mesh(floorGeometry, materialSand);
scene.add(floor);

function createCactus(x, z) {
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
    for (let xPositionIndex = -cactusSpreadRadius; xPositionIndex < cactusSpreadRadius; xPositionIndex = xPositionIndex + 25) {
        for (let yPositionIndex = -cactusSpreadRadius; yPositionIndex < cactusSpreadRadius; yPositionIndex = yPositionIndex + 25) {
            let randomNum = Math.random() * 20 - 10;
            let randomNum2 = Math.random() * 20 - 10;
            createCactus(xPositionIndex + randomNum, yPositionIndex + randomNum2);
        }
    }
}

gltfLoader.load("assets/models/rv.glb", function (gltf) {
    gltf.scene.position.y = 0.5;
    scene.add(gltf.scene);
});

gltfLoader.load("assets/models/walter.glb", function (gltf) {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.rotation.x = 3.1
    gltf.scene.position.y = 0.65;
    gltf.scene.position.z = 5;
    scene.add(gltf.scene);
});

var flamingo = null;
gltfLoader.load('assets/models/Flamingo.glb', function (gltf) {
    flamingo = gltf.scene.children[0];

    const scale = 0.01;
    flamingo.scale.set(scale, scale, scale);
    flamingo.position.x = 3;
    flamingo.position.y = 6;
    flamingo.position.z = 0;
    flamingo.rotation.y = 1.5;
    scene.add(flamingo);

    const mixer = new THREE.AnimationMixer(flamingo);
    mixer.clipAction(gltf.animations[0]).setDuration(1).play();
    animationMixers.push(mixer);
});

let hasFlamingoReachedEnd = false, hasFlamingoReachedStart = false;
function animateFlyingFlamingo() {
    if (flamingo == null) {
        return;
    }

    if (!hasFlamingoReachedEnd && flamingo.position.x < flamingoEndPosition) {
        flamingo.position.x += 0.2;
    }

    if (flamingo.position.x > flamingoEndPosition) {
        hasFlamingoReachedEnd = true;
        flamingo.rotation.y = -1.5;
    }

    if (hasFlamingoReachedEnd && flamingo.position.x > flamingoStartPosition) {
        flamingo.position.x -= 0.2;
    }

    if (flamingo.position.x < flamingoStartPosition) {
        hasFlamingoReachedStart = true;
        flamingo.rotation.y = 1.5;
    }

    if (hasFlamingoReachedStart && hasFlamingoReachedEnd) {
        hasFlamingoReachedStart = false;
        hasFlamingoReachedEnd = false;
    }
}

function createTumbleweed(x, z) {
    const geometry = new THREE.SphereGeometry(hayBaleScale, 12, 12);
    const colorMap = textureLoader.load("assets/tumbleweed.png");
    const material  = new THREE.MeshBasicMaterial({ map: colorMap });

    const tumbleweed = new THREE.Mesh(geometry, material);
    tumbleweed.position.x = x;
    tumbleweed.position.y = 0.7;
    tumbleweed.position.z = z;
    scene.add(tumbleweed);
}

function spreadTumbleweeds() {
    for (let xPositionIndex = -tumbleWeedSpreadRadius; xPositionIndex < tumbleWeedSpreadRadius; xPositionIndex = xPositionIndex + 10) {
        for (let yPositionIndex = -tumbleWeedSpreadRadius; yPositionIndex < tumbleWeedSpreadRadius; yPositionIndex = yPositionIndex + 10) {
            let randomNum = Math.random() * 20 - 10;
            let randomNum2 = Math.random() * 20 - 10;
            createTumbleweed(xPositionIndex + randomNum, yPositionIndex + randomNum2);
        }
    }
}

function createBuilding() {
    let houseGroup = new THREE.Group(); //Creating group
    houseGroup.position.set(-10, 0, -8); // set position of group (x-axis, y-axis, z-axis).
// To add bricks for home
    let geometry = new THREE.BoxGeometry(10,5,3); // To draw cube shape geometry.
    let mesh = new THREE.MeshBasicMaterial({color: 0x6e638a}); // Add color of cube for appearance of cube.
    let cube = new THREE.Mesh(geometry, mesh); //With mesh adding appearance of cube over it.
    let edgeLine = new THREE.BoxBufferGeometry( 10, 5, 3 );
    let edges = new THREE.EdgesGeometry( edgeLine ); // To have border of cube.
    let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) ); // Adding border around bricks
    cube.position.set(0,0,4);
    line.position.copy(cube.position); //Copy of cube position since border need to be added around cube.
    // Adding line and brick to house group
    houseGroup.add(line);
    houseGroup.add(cube);
    scene.add(houseGroup); //Adding housegroup to scene

    // Note: Need to be added above renderer.render(scene, camera);
    //To add roof for home
    let roof = new THREE.ConeGeometry(6,5,0);
    let roofMaterial = new THREE.MeshBasicMaterial({color: 0xd1d665});
    let roofMesh = new THREE.Mesh(roof, roofMaterial);
    roofMesh.position.set(-1.3, 5, 1);
    houseGroup.add(roofMesh);

    // Need to be added after code for roof of house.
    //To add door for home
    let door = new THREE.PlaneBufferGeometry(2,3,2);
    let doorMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    let doorMesh = new THREE.Mesh(door, doorMaterial);
    doorMesh.position.set(1,-0.75,7);
    houseGroup.add(doorMesh);
}

createBuilding();

const render = function () {
    requestAnimationFrame(render);
    orbitControls.update();

    // Run the animations.
    animateFlyingFlamingo();
    const delta = clock.getDelta();
    for (let index = 0; index < animationMixers.length; index++) {
        animationMixers[index].update(delta);
    }

    renderer.render(scene, camera);
}

render();
spreadCactus();
spreadTumbleweeds();
