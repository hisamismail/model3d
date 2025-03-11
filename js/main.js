let scene, camera, renderer, controls, transformControls;
let furnitureObjects = [];
let room;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("scene-container").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('change', render);
    scene.add(transformControls);

    transformControls.addEventListener('mouseDown', function () {
        controls.enabled = false;
    });

    transformControls.addEventListener('mouseUp', function () {
        controls.enabled = true;
    });

    let light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    createRoom();

    animate();
}

function createRoom() {
    if (room) {
        scene.remove(room.floor);
        scene.remove(room.wall);
    }

    let floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    let wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    wall.position.set(0, 2.5, -5);
    scene.add(wall);

    room = { floor, wall };
}

function changeRoomColor() {
    let color = document.getElementById("roomColor").value;
    if (room) room.wall.material.color.set(color);
}

function changeTexture(texturePath) {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load(texturePath, texture => {
        if (room) {
            room.floor.material.map = texture;
            room.floor.material.needsUpdate = true;
        }
    });
}

function addFurniture(type) {
    let loader = new THREE.GLTFLoader();
    loader.load(`models/${type}.glb`, function(gltf) {
        let model = gltf.scene;
        scene.add(model);
        furnitureObjects.push(model);
        transformControls.attach(model);
    });
}

function setTransformMode(mode) {
    if (transformControls.object) transformControls.setMode(mode);
}

function removeSelectedFurniture() {
    if (transformControls.object) {
        scene.remove(transformControls.object);
        furnitureObjects = furnitureObjects.filter(obj => obj !== transformControls.object);
        transformControls.detach();
    }
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

window.onload = init;
