
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

// Define material
const material = new THREE.MeshPhongMaterial({ color: 0xddddcc, side: THREE.DoubleSide });

// ------------------------------------------------------------
// GLTF (.glb)
// ------------------------------------------------------------
// const loader = new THREE.GLTFLoader();
// loader.load("teapot.glb", function(gltf) {
//     scene.add(gltf.scene);
// });

// ------------------------------------------------------------
// GLTF (.glb) with own material
// ------------------------------------------------------------
const loader = new THREE.GLTFLoader();
loader.load("teapot.glb", function(gltf) {
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.material = material.clone();
        }
    } );
    scene.add(gltf.scene);
});

// ------------------------------------------------------------
// Collada (.dae)
// ------------------------------------------------------------
// const loader = new THREE.ColladaLoader();
// loader.load("teapot.dae", function(dae) {
//     scene.add(dae.scene);
// });

// ------------------------------------------------------------
// Collada (.dae) with own material
// ------------------------------------------------------------
// const loader = new THREE.ColladaLoader();
// loader.load("teapot.dae", function(dae) {
//     dae.scene.traverse( function ( child ) {
//         if ( child.isMesh ) {
//             child.material = material.clone();
//         }
//     } );
//     scene.add(dae.scene);
// });

// ------------------------------------------------------------
// Wavefront (.obj + .mtl)
// ------------------------------------------------------------
// const mtl_loader = new THREE.MTLLoader();
// mtl_loader.load("teapot.mtl", function(mat) {
//     mat.preload();
//     const loader = new THREE.OBJLoader();
//     loader.setMaterials(mat);
//     loader.load("teapot.obj", function(obj) {
//         scene.add(obj);
//     });
// });

// ------------------------------------------------------------
// Wavefront (.obj) with own material
// ------------------------------------------------------------
// const loader = new THREE.OBJLoader();
// loader.load("teapot.obj", function(obj) {
//     obj.traverse( function ( child ) {
//         if ( child.isMesh ) {
//             child.material = material.clone();
//         }
//     } );
//     scene.add(obj);
// });

// Define light
const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

// Directional - KEY LIGHT
keyLight = new THREE.DirectionalLight(0xdddddd, .7);
keyLight.position.set(-80, 60, 80);
scene.add(keyLight);

//keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 15);
//scene.add(keyLightHelper);

// Directional - FILL LIGHT
fillLight = new THREE.DirectionalLight(0xdddddd, .3);
fillLight.position.set(80, 40, 40);
scene.add(fillLight);

//fillLightHelper = new THREE.DirectionalLightHelper(fillLight, 15);
//scene.add(fillLightHelper);

// Directional - RIM LIGHT
rimLight = new THREE.DirectionalLight(0xdddddd, .6);
rimLight.position.set(-20, 80, -80);
scene.add(rimLight);

// Move camera from center
camera.position.x = 0;
camera.position.y = 30;
camera.position.z = 100;

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
