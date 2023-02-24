// Construction of scene
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

// General settings
const skyBoxScale = 2500,
    roadLength = 1000,
    shadowMapSize = 2048,
    shadowDistance = 50,
    floorScale = 1000,
    floorRepeats = 100,
    cactusSpreadRadius = 500,
    tumbleWeedSpreadRadius = 500,
    vultureStartPosition = -20,
    vultureEndPosition = 20,
    hayBaleScale = 0.2,
    zoomMinDistance = 4,
    zoomMaxDistance = 20,
    pyramidScale = 15;

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
scene.add(light);

// Implement control of scene by mouse
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.noKeys = true;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.15;
orbitControls.minDistance = zoomMinDistance;
orbitControls.maxDistance = zoomMaxDistance;
orbitControls.enablePan = false;

// Add the ground
const textureSand = textureLoader.load('assets/sand.jpg');
textureSand.wrapS = textureSand.wrapT = THREE.RepeatWrapping;
textureSand.repeat.set(floorRepeats, floorRepeats);
const materialSand = new THREE.MeshBasicMaterial({map: textureSand});

const floorGeometry = new THREE.BoxGeometry(floorScale, 0, floorScale);
const floor = new THREE.Mesh(floorGeometry, materialSand);
scene.add(floor);

// Enable shadow
const groundShadowGeometry = new THREE.PlaneGeometry(floorScale, floorScale);
const groundShadowMaterial = new THREE.ShadowMaterial();
const groundShadow = new THREE.Mesh(groundShadowGeometry, groundShadowMaterial);
groundShadow.position.y = 0.06;
groundShadow.rotation.x = -Math.PI / 2;
groundShadow.receiveShadow = true;
scene.add(groundShadow);

// Add skybox
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

// Add road
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

// Spread the cacti around the world
const textureCactus = textureLoader.load('assets/cactusNew.jpg');
const cactusStem = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 7);
const materialCactus = new THREE.MeshBasicMaterial({map: textureCactus});
const cactusTop = new THREE.SphereGeometry(0.205, 7, 7);
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
            createCactus(xPositionIndex + randomX, zPositionIndex + randomZ, randomRotation);
        }
    }
}

// Add camper
gltfLoader.load("assets/models/rv.glb", function (gltf) {
    gltf.scene.position.y = 0;
    gltf.scene.position.z = -2;
    addShadowToImportedModel(gltf);
    scene.add(gltf.scene);
});

// Add dead Walter
gltfLoader.load("assets/models/walter.glb", function (gltf) {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.rotation.x = 3.1
    gltf.scene.position.y = 0.15;
    gltf.scene.position.z = 5;
    addShadowToImportedModel(gltf);
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
    addShadowToImportedModel(gltf);
    scene.add(billboard);
});

// Vulture shadow creation
var vultureShadow = null;
gltfLoader.load('assets/models/Flamingo.glb', function (gltf) {
    vultureShadow = gltf.scene.children[0];

    const scale = 0.01;
    vultureShadow.scale.set(scale, scale, scale);
    vultureShadow.position.x = 3;
    vultureShadow.position.y = 6;
    vultureShadow.position.z = 5;
    vultureShadow.rotation.y = 1.5;
    vultureShadow.receiveShadow = true;
    vultureShadow.castShadow = true;
    scene.add(vultureShadow);

    const mixer = new THREE.AnimationMixer(vultureShadow);
    mixer.clipAction(gltf.animations[0]).setDuration(1).play();
    animationMixers.push(mixer);
});

// Vulture creation
var vulture = null;
gltfLoader.load('assets/models/Vulture.glb', function (gltf) {
    vulture = gltf.scene.children[0];

    const scale = 0.01;
    vulture.scale.set(scale, scale, scale);
    vulture.position.x = 3;
    vulture.position.y = 6;
    vulture.position.z = 5;
    vulture.rotation.y = 1.5;
    scene.add(vulture);

    const mixer2 = new THREE.AnimationMixer(vulture);
    mixer2.clipAction(gltf.animations[0]).setDuration(1).play();
    animationMixers.push(mixer2);
});

let hasVultureReachedEnd = false, hasVultureReachedStart = false;

function animateFlyingVulture() {
    if (vultureShadow == null) {
        return;
    }

    if (!hasVultureReachedEnd && vultureShadow.position.x < vultureEndPosition) {
        vultureShadow.position.x += 0.1;
        vulture.position.x += 0.1;
    }

    if (vultureShadow.position.x > vultureEndPosition) {
        hasVultureReachedEnd = true;
        vultureShadow.rotation.y = -1.5;
        vulture.rotation.y = -1.5;
    }

    if (hasVultureReachedEnd && vultureShadow.position.x > vultureStartPosition) {
        vultureShadow.position.x -= 0.1;
        vulture.position.x -= 0.1;
    }

    if (vultureShadow.position.x < vultureStartPosition) {
        hasVultureReachedStart = true;
        vultureShadow.rotation.y = 1.5;
        vulture.rotation.y = 1.5;
    }

    if (hasVultureReachedStart && hasVultureReachedEnd) {
        hasVultureReachedStart = false;
        hasVultureReachedEnd = false;
    }
}

// Spread the tumbleweeds around the world
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

// Add drug barrels
let barrelGeometry = makeBarrel(1, 1.25, 3);
let barrelMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("assets/GoldenMothChemical.webp")
});
createBarrels(-3, -3);
createBarrels(-4, 0);
createBarrels(-4, -1.5, 1.5);

function createBarrels(x, z, rotation = 0) {
    for (let index = 0; index < 3; index++) {
        let barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.scale.set(0.5, 0.5, 0.5);
        barrel.position.x = x;
        barrel.position.y = 0.7;
        barrel.position.z = z;
        barrel.castShadow = true;
        if (rotation !== 0) {
            barrel.rotation.z = rotation;
        }

        scene.add(barrel);
    }
}

function makeBarrel(radius, width, height) {
    let cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 24, 32);
    let vector3 = new THREE.Vector3();
    let vector2 = new THREE.Vector2();
    let position = cylinderGeometry.attributes.position;
    let radiusDiff = width - radius;
    for (let index = 0; index < position.count; index++) {
        vector3.fromBufferAttribute(position, index);
        let y = Math.abs(vector3.y);
        let rShift = Math.pow(Math.sqrt(1 - (y * y)), 2) * radiusDiff + radius;
        vector2.set(vector3.x, vector3.z).setLength(rShift);
        vector3.set(vector2.x, vector3.y, vector2.y);
        position.setXYZ(index, vector3.x, vector3.y, vector3.z);
    }

    cylinderGeometry.scale(1, height * 0.5, 1);

    return cylinderGeometry;
}

// Add drug barrels floor
addBarrelFloors();

function addBarrelFloors() {
    const barrelFloorGeometry = new THREE.BoxGeometry(3, 0.1, 3);
    const barrelFloorMaterialPhong = new THREE.MeshPhongMaterial({
        color: 0x3f453d,
    });
    const barrelPhongFloor = new THREE.Mesh(barrelFloorGeometry, barrelFloorMaterialPhong);
    barrelPhongFloor.position.x = -3.5;
    barrelPhongFloor.position.z = -3.2;
    scene.add(barrelPhongFloor);

    const barrelFloorMetalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3f453d,
        roughness: 0.5,
        metalness: 0.5
    });
    const barrelMetalFloor = new THREE.Mesh(barrelFloorGeometry, barrelFloorMetalMaterial);
    barrelMetalFloor.position.x = -3.5;
    barrelMetalFloor.position.z = -0.2;
    scene.add(barrelMetalFloor);
}

// Add sun
addSun();

function addSun() {
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.x = -500;
    sun.position.y = 150;
    sun.position.z = 500;
    scene.add(sun);
}

// Add pyramid
buildPyramid();

function buildPyramid() {
    const texturePyramid = textureLoader.load('assets/pyramid-stone.webp');
    texturePyramid.wrapS = THREE.RepeatWrapping;
    texturePyramid.wrapT = THREE.RepeatWrapping;
    texturePyramid.repeat.set(15, 1);
    const materialPyramid = new THREE.MeshBasicMaterial({
        map: texturePyramid
    });
    let scale = pyramidScale;
    let pyramidY = 0;
    for (let index = 0; index < pyramidScale; index++) {
        const geometryPyramid = new THREE.BoxGeometry(scale, 1, scale);
        const pyramid = new THREE.Mesh(geometryPyramid, materialPyramid);
        pyramid.position.x = 20;
        pyramid.position.y = pyramidY;
        pyramid.position.z = -8;
        pyramid.castShadow = true;
        pyramid.receiveShadow = true;
        scene.add(pyramid);

        scale -= 1;
        pyramidY += 1;
    }
}

// Act on window resizes
window.addEventListener('resize', handleWindowResize, false);

function handleWindowResize() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    render();
}

// Render the world
render();

function render() {
    requestAnimationFrame(render);
    orbitControls.update();

    // Run the animations.
    animateFlyingVulture();
    const delta = clock.getDelta();
    for (let index = 0; index < animationMixers.length; index++) {
        animationMixers[index].update(delta);
    }

    renderer.render(scene, camera);
}

/**
 * Helper method for adding shadow to imported models.
 *
 * @param {object} gltf
 *   The gltf object.
 */
function addShadowToImportedModel(gltf) {
    gltf.scene.traverse(function (node) {
        if (!node.isMesh) {
            return;
        }

        node.castShadow = true;
    });
}
