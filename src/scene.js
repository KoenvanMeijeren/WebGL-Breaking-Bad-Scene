// General settings
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(
    75,     // fov - Camera frustum vertical field of view
    window.innerWidth / window.innerHeight, // aspect - Camera frustum aspect ratio
    0.1,   // near - Camera frustum near plane
    5000 // far - Camera frustum far plane
);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

camera.position.x = 10;  // Move right from center of scene
camera.position.y = 20;  // Move up from center of scene
camera.position.z = 50;  // Move camera away from center of scene

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new THREE.GLTFLoader();
const animationMixers = [];

// Settings
const skyBoxScale = 2500,
    roadLength = 1000,
    shadowMapSize = 2048,
    shadowDistance = 50,
    floorScale = 1000,
    floorRepeats = 1000,
    cactusSpreadRadius = 500,
    tumbleWeedSpreadRadius = 500,
    flamingoStartPosition = -20,
    flamingoEndPosition = 20,
    hayBaleScale = 0.2,
    zoomMinDistance = 4,
    zoomMaxDistance = 20;

// Light
const light = new THREE.DirectionalLight(0xdddddd, 5);
light.position.set(-1, 1.75, 1);
light.position.multiplyScalar(30);
light.castShadow = true;
light.shadow.mapSize.width = shadowMapSize;
light.shadow.mapSize.height = shadowMapSize;
light.shadow.camera.left = -shadowDistance;
light.shadow.camera.right = shadowDistance;
light.shadow.camera.top = shadowDistance;
light.shadow.camera.bottom = -shadowDistance;
light.shadow.camera.far = 3500;
light.shadow.bias = -0.0001;
scene.add(light);

const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.noKeys = true;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.15;
orbitControls.minDistance = zoomMinDistance;
orbitControls.maxDistance = zoomMaxDistance;

// GROUND
const textureSand = textureLoader.load('assets/sand.jpg');
textureSand.wrapS = textureSand.wrapT = THREE.RepeatWrapping;
textureSand.repeat.set(floorRepeats, floorRepeats);
const materialSand = new THREE.MeshBasicMaterial({map: textureSand});

const floorGeometry = new THREE.BoxGeometry(floorScale, 0, floorScale);
const floor = new THREE.Mesh(floorGeometry, materialSand);
scene.add(floor);

const groundShadowGeometry = new THREE.PlaneGeometry(floorScale, floorScale);
const groundShadowMaterial = new THREE.ShadowMaterial();
const groundShadow = new THREE.Mesh(groundShadowGeometry, groundShadowMaterial);
groundShadow.position.y = 0.06;
groundShadow.rotation.x = -Math.PI / 2;
groundShadow.receiveShadow = true;
scene.add(groundShadow);

// Skybox
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

// Road
const textureRoad = textureLoader.load('assets/road.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, roadLength);
});
const materialRoad = new THREE.MeshBasicMaterial({map: textureRoad});
const roadGeometry = new THREE.BoxGeometry(2, 0.1, roadLength);
const road = new THREE.Mesh(roadGeometry, materialRoad);
road.position.x = 5;
road.position.y = 0;
road.position.z = 10;
road.receiveShadow = true;
scene.add(road);

// Cactus creation
const textureCactus = textureLoader.load('assets/cactusNew.jpg');
const cactusStem = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 7);
const materialCactus = new THREE.MeshBasicMaterial({map: textureCactus});
const cactusTop = new THREE.SphereGeometry(0.205, 7,7);
const cactusBranch = new THREE.CylinderGeometry(0.13, 0.13, 1, 7);
const cactusBranchTop = new THREE.ConeGeometry(0.13, 0.1, 7);
spreadCactus();
function createCactus(x, z, rotation) {
    const cactusStemMesh = new THREE.Mesh(cactusStem, materialCactus);
    cactusStemMesh.position.x = 0;
    cactusStemMesh.position.y = 0.6;
    cactusStemMesh.position.z = 0;
    cactusStemMesh.castShadow = true;

    const cactusTopMesh = new THREE.Mesh(cactusTop, materialCactus);
    cactusTopMesh.position.x = 0;
    cactusTopMesh.position.y = 1.4;
    cactusTopMesh.position.z = 0;
    cactusTopMesh.rotation.y = 0.67;
    cactusTopMesh.castShadow = true;

    const cactusBranchMesh = new THREE.Mesh(cactusBranch, materialCactus);
    cactusBranchMesh.position.x = 0;
    cactusBranchMesh.position.y = 0.7;
    cactusBranchMesh.position.z = 0.25;
    cactusBranchMesh.rotation.x = 0.5;
    cactusBranchMesh.castShadow = true;

    const cactusBranchTopMesh = new THREE.Mesh(cactusBranchTop, materialCactus);
    cactusBranchTopMesh.position.x = 0;
    cactusBranchTopMesh.position.y = 1.181;
    cactusBranchTopMesh.position.z = 0.515;
    cactusBranchTopMesh.rotation.x = 0.5;
    cactusBranchTopMesh.castShadow = true;

    const cactusObject = new THREE.Object3D();
    cactusObject.add(cactusStemMesh);
    cactusObject.add(cactusTopMesh);
    cactusObject.add(cactusBranchMesh);
    cactusObject.add(cactusBranchTopMesh);
    cactusObject.castShadow = true;

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

// Add camper
gltfLoader.load("assets/models/rv.glb", function (gltf) {
    gltf.scene.position.y = 0;
    gltf.scene.position.z = -2;
    gltf.scene.receiveShadow = true;
    scene.add(gltf.scene);
});

// Add dead Walter
gltfLoader.load("assets/models/walter.glb", function (gltf) {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.rotation.x = 3.1
    gltf.scene.position.y = 0.15;
    gltf.scene.position.z = 5;
    scene.add(gltf.scene);
});

// Billboard creation
gltfLoader.load("assets/models/billboard.glb", function (gltf) {
    const billboard = gltf.scene.children[0];
    const scale = 0.75;
    billboard.scale.set(scale, scale, scale);
    billboard.position.x = 10;
    billboard.position.y = 0;
    billboard.position.z = -50;
    scene.add(billboard);
});

// Flamingo creation
var flamingo = null;
gltfLoader.load('assets/models/Flamingo.glb', function (gltf) {
    flamingo = gltf.scene.children[0];

    const scale = 0.01;
    flamingo.scale.set(scale, scale, scale);
    flamingo.position.x = 3;
    flamingo.position.y = 6;
    flamingo.position.z = 5;
    flamingo.rotation.y = 1.5;
    flamingo.receiveShadow = true;
    flamingo.castShadow = true;
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

// Tumble weeds
const tumbleWeedGeometry = new THREE.SphereGeometry(hayBaleScale, 12, 12);
const tumbleWeedMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("assets/tumbleweed.png")
});
spreadTumbleweeds();
function createTumbleweed(x, z) {
    const tumbleweed = new THREE.Mesh(tumbleWeedGeometry, tumbleWeedMaterial);
    tumbleweed.position.x = x;
    tumbleweed.position.y = 0.15;
    tumbleweed.position.z = z;
    tumbleweed.castShadow = true;
    tumbleweed.receiveShadow = true;
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

render();
