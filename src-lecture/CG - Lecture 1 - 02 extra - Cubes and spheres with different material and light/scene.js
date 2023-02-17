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

const sphere_geometry = new THREE.SphereGeometry(
    0.5,  // radius - sphere radius. Default is 50
    24,   // widthSegments - number of horizontal segments. Minimum value is 3, and the default is 8
    6     // heightSegments - number of vertical segments. Minimum value is 2, and the default is 6
);
const box_geometry = new THREE.BoxGeometry(1, 1, 1);

const materials = [];
materials.push(new THREE.MeshNormalMaterial());
materials.push(new THREE.MeshBasicMaterial({ color: 0x2d73a0 }));
materials.push(new THREE.MeshPhongMaterial({ color: 0x2d73a0 , shininess: 100 }));
materials.push(new THREE.MeshLambertMaterial({color: 0x2d73a0 })); 
materials.push(new THREE.MeshBasicMaterial({ color: 0x2d73a0, transparent: true, opacity:.2 }));
materials.push(new THREE.MeshBasicMaterial({ color: 0x2d73a0, wireframe: true }));

x = 0 - materials.length / 2 * 1.5;
for (let i = 0; i < materials.length; i++)
{
    mesh1 = new THREE.Mesh(sphere_geometry.clone(), materials[i]);
    mesh1.position.x = x;
    mesh1.position.y = 2;
    mesh2 = new THREE.Mesh(box_geometry.clone(), materials[i]);
    mesh2.position.x = x;
    mesh2.position.y = -1;
    scene.add(mesh1);
    scene.add(mesh2);
    x += 1.5;
}

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.noKeys = true;

// Define light
const light = new THREE.DirectionalLight(0xdddddd, 1);
light.position.set(0, 0, 1);
scene.add(light);

// Move camera from center
camera.position.x = 0;
camera.position.y = 1; // Move up from center of scene
camera.position.z = 5; // Move camera away from center of scene

const clock = new THREE.Clock();

const render = function() { 
    requestAnimationFrame(render);

    controls.update(); //update for auto-rotation
    
    renderer.render(scene, camera); 
}

render();
