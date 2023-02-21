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
    roadLength = 1000,
    floorScale = 1000,
    floorRepeats = 200,
    cactusSpreadRadius = 500,
    tumbleWeedSpreadRadius = 500,
    flamingoStartPosition = -20,
    flamingoEndPosition = 20,
    hayBaleScale = 0.2;

const light = new THREE.DirectionalLight(0xdddddd, 5);
light.position.set(2, 4, 1);
scene.add(light);

camera.position.x = 10;  // Move right from center of scene
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
orbitControls.maxPolarAngle = Math.PI / 2 - 0.15;
orbitControls.minDistance = 4;
orbitControls.maxDistance = 20;

const textureSand = textureLoader.load('assets/sand.jpg');
textureSand.wrapS = textureSand.wrapT = THREE.RepeatWrapping;
textureSand.repeat.set(floorRepeats, floorRepeats);
const textureCactus = textureLoader.load('assets/cactusNew.jpg');
const materialSand = new THREE.MeshBasicMaterial({map: textureSand});
const materialCactus = new THREE.MeshBasicMaterial({map: textureCactus});

let skyBoxMaterials = [];
skyBoxMaterials.push(new THREE.MeshBasicMaterial({
    map: textureLoader.load('assets/sky/sky_ft.jpg'),
    side: THREE.BackSide
}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({
    map: textureLoader.load('assets/sky/sky_bk.jpg'),
    side: THREE.BackSide
}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({
    map: textureLoader.load('assets/sky/sky_up.jpg'),
    side: THREE.BackSide
}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({
    map: textureLoader.load('assets/sky/sky_dn.jpg'),
    side: THREE.BackSide
}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({
    map: textureLoader.load('assets/sky/sky_rt.jpg'),
    side: THREE.BackSide
}));
skyBoxMaterials.push(new THREE.MeshBasicMaterial({
    map: textureLoader.load('assets/sky/sky_lf.jpg'),
    side: THREE.BackSide
}));

let skyboxGeometry = new THREE.BoxGeometry(skyBoxScale, skyBoxScale, skyBoxScale);
let skybox = new THREE.Mesh(skyboxGeometry, skyBoxMaterials);
scene.add(skybox);

const floorGeometry = new THREE.BoxGeometry(floorScale, 1, floorScale);
const floor = new THREE.Mesh(floorGeometry, materialSand);
scene.add(floor);

const textureRoad = textureLoader.load('assets/road.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, roadLength);
});
const materialRoad = new THREE.MeshBasicMaterial({map: textureRoad});
const roadGeometry = new THREE.BoxGeometry(2, 0.1, roadLength);
const road = new THREE.Mesh(roadGeometry, materialRoad);
road.position.x = 5;
road.position.y = 0.5;
road.position.z = 10;
scene.add(road);

function createCactus(x, z, rotation) {
    const cactusStem = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 7);
    const cactusStemMesh = new THREE.Mesh(cactusStem, materialCactus)
    cactusStemMesh.position.x = 0;
    cactusStemMesh.position.y = 1.2;
    cactusStemMesh.position.z = 0;

    const cactusTop = new THREE.SphereGeometry(0.205, 7,7)
    const cactusTopMesh = new THREE.Mesh(cactusTop, materialCactus)
    cactusTopMesh.position.x = 0;
    cactusTopMesh.position.y = 2;
    cactusTopMesh.position.z = 0;
    cactusTopMesh.rotation.y = 0.67;

    const cactusBranch = new THREE.CylinderGeometry(0.13, 0.13, 1, 7);
    const cactusBranchMesh = new THREE.Mesh(cactusBranch, materialCactus)
    cactusBranchMesh.position.x = 0;
    cactusBranchMesh.position.y = 1.3;
    cactusBranchMesh.position.z = 0.25;
    cactusBranchMesh.rotation.x = 0.5;

    const cactusBranchTop = new THREE.ConeGeometry(0.13, 0.1, 7)
    const cactusBranchTopMesh = new THREE.Mesh(cactusBranchTop, materialCactus)
    cactusBranchTopMesh.position.x = 0;
    cactusBranchTopMesh.position.y = 1.781;
    cactusBranchTopMesh.position.z = 0.515;
    cactusBranchTopMesh.rotation.x = 0.5;

    cactusObject = new THREE.Object3D();
    cactusObject.add(cactusStemMesh);
    cactusObject.add(cactusTopMesh);
    cactusObject.add(cactusBranchMesh);
    cactusObject.add(cactusBranchTopMesh);

    cactusObject.position.x = x;
    cactusObject.position.z = z;
    cactusObject.rotation.y = rotation;
    scene.add(cactusObject);
}

function spreadCactus() {
    for (let xPositionIndex = -cactusSpreadRadius; xPositionIndex < cactusSpreadRadius; xPositionIndex = xPositionIndex + 25) {
        for (let zPositionIndex = -cactusSpreadRadius; zPositionIndex < cactusSpreadRadius; zPositionIndex = zPositionIndex + 25) {
            let randomX = Math.random() * 20 - 10;
            let randomZ = Math.random() * 20 - 10;
            let randomRotation = Math.random() * 6;
            createCactus(xPositionIndex + randomX, zPositionIndex + randomZ , randomRotation);
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

gltfLoader.load("assets/models/billboard.glb", function (gltf) {
    gltf.scene.position.x = 10;
    gltf.scene.position.y = 0;
    gltf.scene.position.z = -100;
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
        flamingo.position.x += 0.1;
    }

    if (flamingo.position.x > flamingoEndPosition) {
        hasFlamingoReachedEnd = true;
        flamingo.rotation.y = -1.5;
    }

    if (hasFlamingoReachedEnd && flamingo.position.x > flamingoStartPosition) {
        flamingo.position.x -= 0.1;
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
    const material = new THREE.MeshBasicMaterial({map: colorMap});

    const tumbleweed = new THREE.Mesh(geometry, material);
    tumbleweed.position.x = x;
    tumbleweed.position.y = 0.7;
    tumbleweed.position.z = z;
    scene.add(tumbleweed);
}

function spreadTumbleweeds() {
    for (let xPositionIndex = -tumbleWeedSpreadRadius; xPositionIndex < tumbleWeedSpreadRadius; xPositionIndex = xPositionIndex + 25) {
        for (let yPositionIndex = -tumbleWeedSpreadRadius; yPositionIndex < tumbleWeedSpreadRadius; yPositionIndex = yPositionIndex + 25) {
            let randomNum = Math.random() * 20 - 10;
            let randomNum2 = Math.random() * 20 - 10;
            createTumbleweed(xPositionIndex + randomNum, yPositionIndex + randomNum2);
        }
    }
}

window.addEventListener('resize', handleWindowResize, false);
function handleWindowResize() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    render();
}

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

// TEMPORARY
camera.position.x = -6;  // Move right from center of scene
camera.position.y = 2;  // Move up from center of scene
camera.position.z = 6;  // Move camera away from center of scene

render();
spreadCactus();
spreadTumbleweeds();
