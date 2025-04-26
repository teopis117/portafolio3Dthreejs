import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { loadingManager } from './loadingManager.js';
import { config } from './config.js';

const canvas = document.querySelector('#bg');
if (!canvas) console.error("Canvas element '#bg' not found!");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(config.environmentMap.fallbackBackgroundColor);
scene.environment = null;

// --- Debug Helpers Removed ---
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);
// console.log("Debugging: Removed AxesHelper and GridHelper.");
// --- End Removed Helpers ---

// Camera
const camera = new THREE.PerspectiveCamera(
    config.camera.fov,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.fromArray(config.camera.position);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

// Environment & Lighting Setup Function
function setupEnvironment() {
    // --- HDRI Loading (Keep enabled) ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const rgbeLoader = new RGBELoader(loadingManager);
    const hdrPath = config.texturesBasePath + config.environmentMap.hdrPath; // Path from config
    console.log(`Attempting to load environment map: ${hdrPath}`);

    if (!config.environmentMap.hdrPath) {
        console.warn("No HDR path specified in config. Skipping environment map loading.");
        scene.background = new THREE.Color(config.environmentMap.fallbackBackgroundColor);
        scene.environment = null;
    } else {
        rgbeLoader.load(hdrPath,
        (texture) => { // onLoad success
            try {
                const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                pmremGenerator.dispose();
                texture.dispose();

                scene.environment = envMap; // Apply for reflections
                scene.environment.intensity = config.environmentMap.intensity;

                if (config.environmentMap.useAsBackground) {
                    scene.background = envMap; // Apply as background if configured
                } else {
                     scene.background = new THREE.Color(config.environmentMap.fallbackBackgroundColor);
                }
                 console.info("Environment map loaded and applied.");
            } catch (error) {
                 console.error("Error processing environment map:", error);
                 scene.background = new THREE.Color(config.environmentMap.fallbackBackgroundColor);
                 scene.environment = null;
            }
        },
        undefined, // onProgress handled by manager
        (error) => { // onError for rgbeLoader.load
            console.error(`Failed to load HDR: ${hdrPath}. Using fallback background.`, error);
            scene.background = new THREE.Color(config.environmentMap.fallbackBackgroundColor);
            scene.environment = null;
        });
    }
    // -----------------------------

    // --- Setup Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, config.lights.ambientIntensity);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, config.lights.directionalIntensity);
    directionalLight.position.fromArray(config.lights.directionalPosition);
    scene.add(directionalLight);
    console.log("Lights set up.");
}

// Function to handle window resize
function handleResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    console.log("Window resized.");
}

export { scene, camera, renderer, setupEnvironment, handleResize };