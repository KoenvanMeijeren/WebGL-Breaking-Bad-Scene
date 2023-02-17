let camera2, scene2, renderer2;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2);

const movingCamera = function() {
    init();
    animate();
}

function init() {
    camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    camera2.position.z = 50;

    scene2 = new THREE.Scene();

    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    const material = new THREE.MeshNormalMaterial();

    for ( let index = 0; index < 150; index ++ ) {
        const object = new THREE.Mesh( geometry, material );
        object.position.x = Math.random() * 80 - 40;
        object.position.y = Math.random() * 80 - 40;
        object.position.z = Math.random() * 80 - 40;
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        scene2.add( object );
    }

    renderer2 = new THREE.WebGLRenderer( { antialias: true } );
    renderer2.setSize( window.innerWidth, window.innerHeight );
    const sceneContainer = document.getElementsByClassName('scene-container')[0];
    sceneContainer.innerHTML = "";
    sceneContainer.appendChild( renderer2.domElement );

    sceneContainer.addEventListener( 'mousemove', onMouseMove, false );
    sceneContainer.addEventListener( 'wheel', onMouseWheel, false );
    sceneContainer.addEventListener( 'resize', onResize, false );

}

function onMouseMove( event ) {
    mouse.x = ( event.clientX - windowHalf.x );
    mouse.y = ( event.clientY - windowHalf.x );
}

function onMouseWheel( event ) {
    camera2.position.z += event.deltaY * 0.2; // move camera along z-axis
}

function onResize( event ) {

    const width = window.innerWidth;
    const height = window.innerHeight;

    windowHalf.set( width / 2, height / 2 );

    camera2.aspect = width / height;
    camera2.updateProjectionMatrix();
    renderer2.setSize( width, height );

}

function animate() {

    target.x = ( 1 - mouse.x ) * 0.002;
    target.y = ( 1 - mouse.y ) * 0.002;

    camera2.rotation.x += 0.5 * ( target.y - camera2.rotation.x );
    camera2.rotation.y += 0.5 * ( target.x - camera2.rotation.y );

    requestAnimationFrame( animate );
    renderer2.render( scene2, camera2 );

}