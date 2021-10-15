import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import randomInt from './randomNextInt';


// Canvas
const canvas = document.querySelector('canvas.webgl');


// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd2d2d2);


// Grid helper
// const gridHelper = new THREE.GridHelper( 1000, 1000 );
// scene.add( gridHelper );


// Geomtry
// const boxGeo = new THREE.BoxGeometry(3, 3, 3);

// Materials
const normalMat = new THREE.MeshNormalMaterial();
const basicMat = new THREE.MeshBasicMaterial({color: 0x33DDFF});


// let standarMaterials = [];

const colorList = [
    0xFD7DFD, //fuchsia pink
    0xFABC02, //selective yellow, orengish colour
    0xFEFE33, //yellow gorse
    0x66B032, //green apple
    0x0391CE, //pacific blue
    0x8601AF, //dark violet
    0xBDA282, //rodeo dust, brownish colour
    0xFE2712 //red scarlet
];

// Mesh

const generateBox = () => {
    const matColor = colorList[Math.floor(randomInt(0, 8))];
    const standarMat = new THREE.MeshStandardMaterial({
        roughness: 1.0,
        metalness: 1.0,
        color: matColor
    });
    const boxGeo = new THREE.BoxGeometry(3, 3, 3);
    const boxMesh = new THREE.Mesh( boxGeo, standarMat);
    boxMesh.position.set(randomInt(-20, 20), randomInt(-20, 20), randomInt(-20, 20));
    scene.add(boxMesh);
}

for (let i = 0; i < 25; i++) {
    generateBox();
}


// Scoring
const currentScoreElement = document.getElementById("current-score");
const hightScoreElement = document.getElementById("high-score");
const rightPair = 30;
const wrongPair = -10;

let currentScore = 0;
let highScore = 0;


// Point Light
const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.castShadow = true;
pointLight.position.set(0, 50, 30);
scene.add(pointLight);


// Debug
const gui = new dat.GUI();



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 10, 50);
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


/**
 * Function
 */

let selectedObject = [];
let originalColors = [];

const disposeObject = () => {

    let first = selectedObject[0].material.color.getHex();
    let second = selectedObject[1].material.color.getHex();

    if (first === second) {
        selectedObject.forEach(object => {
            object.geometry.dispose();
            object.material.dispose();
            scene.remove(object);
            renderer.renderLists.dispose();
        });
        currentScore += rightPair;
    } else {
        currentScore += wrongPair;
    }
    currentScoreElement.innerHTML = currentScore;
    originalColors = [];
    selectedObject = [];
}



/**
 * Raycast
 */
const rayCast = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.setX(-1); mouse.setY(-1);


const onMouseClick = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    rayCast.setFromCamera(mouse, camera);

    let intersects = rayCast.intersectObjects(scene.children, false);

    if (intersects[0]) {
        let firstObject = intersects[0].object;
        if (selectedObject.length > 0) {
            if (firstObject.uuid === selectedObject[0].uuid) {
                firstObject.material.emissive.setHex(0x000000);
                selectedObject = [];
                originalColors = [];
                return;
            }
        }

        selectedObject.push(firstObject);
        originalColors.push(firstObject.material.color.getHex());
        if (selectedObject.length > 1) {
            disposeObject();
        }
        // disposeObject();
    }
}

document.addEventListener("click", onMouseClick);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

/**
 * Animate
 */

const clock = new THREE.Clock();

let treeshold = 0;
let speed = 0.002;
const baseSpeed = 0.002;

const tick = () =>
{

    if (scene.children.length >= 50) {
        treeshold = 0;
        speed = baseSpeed;
        
        if (currentScore > highScore) {
            highScore = currentScore;
            hightScoreElement.innerHTML = highScore;
        }
        currentScore = 0;
        currentScoreElement.innerHTML = currentScore;
    } else {
        treeshold += speed;
    }

    if (treeshold > 1) {
        generateBox();
        treeshold = 0;
        speed += 0.002;
        console.log(`new box generated, speed increased to ${speed}`);
    }
    // console.log(`treeshold ${treeshold}`);
    const elapsedTime = clock.getElapsedTime();

    if (selectedObject.length > 0) {
        selectedObject[0].material.emissive.setHex(elapsedTime % 0.5 >= 0.25 ? originalColors[0] : 0x000000);
    }

    // Update objects

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()