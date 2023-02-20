// Define camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
camera.position.set(-900, -200, -900);

// Define clock
const clock = new THREE.Clock();

// Define scene
const scene = new THREE.Scene();

// Define renderer.
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define model loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new THREE.GLTFLoader();

const mixers = [];

init();

function init() {
    addOrbitControls();
    addSkybox();
    addLights();
    addFlyingFlamingo();

    animate();
}

function addLights() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(50);
    scene.add(dirLight);
}

function addOrbitControls() {
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 1500;
}

function addSkybox() {
    let materials = [];
    materials.push(new THREE.MeshBasicMaterial({
        map: textureLoader.load('./skybox/posx.jpg'),
        side: THREE.BackSide
    }));
    materials.push(new THREE.MeshBasicMaterial({
        map: textureLoader.load('./skybox/negx.jpg'),
        side: THREE.BackSide
    }));
    materials.push(new THREE.MeshBasicMaterial({
        map: textureLoader.load('./skybox/posy.jpg'),
        side: THREE.BackSide
    }));
    materials.push(new THREE.MeshBasicMaterial({
        map: textureLoader.load('./skybox/negy.jpg'),
        side: THREE.BackSide
    }));
    materials.push(new THREE.MeshBasicMaterial({
        map: textureLoader.load('./skybox/posz.jpg'),
        side: THREE.BackSide
    }));
    materials.push(new THREE.MeshBasicMaterial({
        map: textureLoader.load('./skybox/negz.jpg'),
        side: THREE.BackSide
    }));

    let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    let skybox = new THREE.Mesh(skyboxGeo, materials);
    scene.add(skybox);
}

var flamingo = null;
function addFlyingFlamingo() {
    gltfLoader.load('./models/Flamingo.glb', function (gltf) {
        flamingo = gltf.scene.children[0];

        const scale = 3;
        flamingo.scale.set(scale, scale, scale);
        flamingo.position.x = -500;
        flamingo.position.y = 100;
        flamingo.position.z = 1500;
        flamingo.rotation.y = 1.5;
        scene.add(flamingo);

        const mixer = new THREE.AnimationMixer(flamingo);
        mixer.clipAction(gltf.animations[0]).setDuration(1).play();
        mixers.push(mixer);
    });
}

const startZPosition = -5000, endZPosition = 5000;
let hasReachedEnd = false, hasReachedStart = false;
function animateFlyingFlamingo() {
    if (flamingo == null) {
        return;
    }

    if (!hasReachedEnd && flamingo.position.x < endZPosition) {
        flamingo.position.x += 50;
    }

    if (flamingo.position.x === endZPosition) {
        hasReachedEnd = true;
        flamingo.rotation.y = -1.5;
    }

    if (hasReachedEnd && flamingo.position.x > startZPosition) {
        flamingo.position.x -= 50;
    }

    if (flamingo.position.x === startZPosition) {
        hasReachedStart = true;
        flamingo.rotation.y = 1.5;
    }

    if (hasReachedStart && hasReachedEnd) {
        hasReachedStart = false;
        hasReachedEnd = false;
    }
}

function animate() {
    requestAnimationFrame(animate);
    animateFlyingFlamingo();
    render();
}

function render() {
    const delta = clock.getDelta();
    for (let index = 0; index < mixers.length; index++) {
        mixers[index].update(delta);
    }

    renderer.render(scene, camera);
}