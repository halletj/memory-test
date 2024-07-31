// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

const loader = new THREE.GLTF2Loader();

const models = [
    "2CylinderEngine.glb",
    "AntiqueCamera.glb",
    "Avocado.glb",
    "BarramundiFish.glb",
    "BoomBox.glb",
    "Buggy.glb",
    "Corset.glb",
    "DamagedHelmet.glb",
    "DragonAttenuation.glb",
    "Lantern.glb",
    "MetalRoughSpheres.glb",
    "MosquitoInAmber.glb",
    "SpecGlossVsMetalRough.glb",
    "WaterBottle.glb",
];

function nextModel() {
    const model = models.shift();
    models.push(model);
    return models[0];
}

function addModel(scene, callback) {
    loader.load(window.location + nextModel(), function (gltf) {
        
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const sphere = box.getBoundingSphere();
        const radius = sphere.radius;
        const scale = 1000.0 / radius;

        gltf.scene.position.x = Math.random() * 500;
        gltf.scene.position.y = Math.random() * 500;
        gltf.scene.position.z = Math.random() * 500;

        gltf.scene.scale.x = scale;
        gltf.scene.scale.y = scale;
        gltf.scene.scale.z = scale;

        scene.add(gltf.scene);
        if (callback)
            callback();
    });
}

function setupLighting(scene) {
    // Add an ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Bright white light
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Add a headlight (point light that follows the camera)
    const headLight = new THREE.PointLight(0xffffff, 1, 100); // Bright white light
    scene.add(headLight);
    return headLight;
}

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 1500;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

/*
const stats = Stats();
document.body.appendChild(stats.dom);
stats.showPanel(2);
*/

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

const headLight = setupLighting(scene);
// createCube(scene)
addModel(scene, null);
addModel(scene, null);
addModel(scene, null);

import GUI from './lil-gui.esm.js'; 
const gui = new GUI();

const myObject = {
    modelAdd: function () {
    },
    modelCount: 0,
    memoryUsed: 0
};
const modelAdd = gui.add(myObject, 'modelAdd');
const modelCount = gui.add(myObject, 'modelCount');
const memoryUsed = gui.add(myObject, 'modelCount');

modelAdd.name("Add model");
modelAdd.setValue(function(){
    addModel(scene, function(){
        var count = 0;
        scene.traverse(function (e) {
            if (e instanceof THREE.Scene) {
                count++;
            }
        });    
        modelCount.setValue(count);
        // memoryUsed.setValue(performance.memory.usedJSHeapSize / 1024 / 1024);
    });
});
modelCount.name("Model count");
modelCount.disable();
modelCount.setValue(3);

memoryUsed.name("Total memory");
memoryUsed.disable();
// memoryUsed.setValue(performance.memory.usedJSHeapSize / 1024 / 1024);

// Render Loop
var render = function () {
    requestAnimationFrame(render);

    // stats.update();

    headLight.position.copy(camera.position);

    scene.traverse(function (e) {
        if (e instanceof THREE.Scene) {
            e.rotation.x += 0.01
            e.rotation.y += 0.01;
        }
    });

    // Render the scene
    renderer.render(scene, camera);
};

render();