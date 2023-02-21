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
    shadowMapSize = 2048,
    shadowDistance = 50,
    floorScale = 10000,
    floorRepeats = 1000,
    cactusSpreadRadius = 500,
    tumbleWeedSpreadRadius = 500,
    flamingoStartPosition = -20,
    flamingoEndPosition = 20,
    hayBaleScale = 0.2;

// LIGHTS
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);
scene.add(new THREE.HemisphereLightHelper(hemiLight, 10));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.color.setHSL(0.1, 1, 0.95);
dirLight.position.set(-1, 1.75, 1);
dirLight.position.multiplyScalar(30);
scene.add(dirLight);

dirLight.castShadow = true;
dirLight.shadow.mapSize.width = shadowMapSize;
dirLight.shadow.mapSize.height = shadowMapSize;
dirLight.shadow.camera.left = -shadowDistance;
dirLight.shadow.camera.right = shadowDistance;
dirLight.shadow.camera.top = shadowDistance;
dirLight.shadow.camera.bottom = -shadowDistance;
dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = -0.0001;
scene.add(new THREE.DirectionalLightHelper(dirLight, 10));

camera.position.x = 50;  // Move right from center of scene
camera.position.y = 20;  // Move up from center of scene
camera.position.z = 50;  // Move camera away from center of scene

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const cubeScale = 2;
const geometry = new THREE.BoxGeometry(cubeScale, cubeScale, cubeScale);
const material = new THREE.MeshPhongMaterial({color: 0x235324});
const cube = new THREE.Mesh(geometry, material);
cube.position.x = 5;
cube.position.y = 5;
cube.position.z = 5;
cube.castShadow = true;
scene.add(cube);

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new THREE.GLTFLoader();
const animationMixers = [];

const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.noKeys = true;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.15;
orbitControls.minDistance = 4;
orbitControls.maxDistance = 20;

// GROUND
const textureSand = textureLoader.load('assets/sand.jpg');
textureSand.wrapS = textureSand.wrapT = THREE.RepeatWrapping;
textureSand.repeat.set(floorRepeats, floorRepeats);

const groundGeo = new THREE.PlaneGeometry(floorScale, floorScale);
const groundMat = new THREE.MeshLambertMaterial({map: textureSand});
groundMat.color.setHSL(0.095, 1, 0.75);

const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = 0;
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

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

const textureRoad = textureLoader.load('assets/road.jpg', function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, roadLength);
});
const materialRoad = new THREE.MeshLambertMaterial({map: textureRoad});
const roadGeometry = new THREE.BoxGeometry(2, 0.1, roadLength);
const road = new THREE.Mesh(roadGeometry, materialRoad);
road.position.x = 5;
road.position.y = 0;
road.position.z = 10;
road.receiveShadow = true;
scene.add(road);

const textureCactus = textureLoader.load('assets/cactusNew.jpg');
const materialCactus = new THREE.MeshBasicMaterial({map: textureCactus});
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
    gltf.scene.position.y = 0;
    scene.add(gltf.scene);
});

gltfLoader.load("assets/models/walter.glb", function (gltf) {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.rotation.x = 3.1
    gltf.scene.position.y = 0.15;
    gltf.scene.position.z = 5;
    scene.add(gltf.scene);
});

gltfLoader.load("assets/models/billboard.glb", function (gltf) {
    const billboard = gltf.scene.children[0];
    const scale = 0.5;
    billboard.scale.set(scale, scale, scale);
    billboard.position.x = 10;
    billboard.position.y = 0;
    billboard.position.z = -10;
    scene.add(billboard);
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

const tumbleWeedGeometry = new THREE.SphereGeometry(hayBaleScale, 12, 12);
const tumbleWeedMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("assets/tumbleweed.png")
});

function createTumbleweed(x, z) {
    const tumbleweed = new THREE.Mesh(tumbleWeedGeometry, tumbleWeedMaterial);
    tumbleweed.position.x = x;
    tumbleweed.position.y = 0.15;
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

render();
spreadCactus();
spreadTumbleweeds();
