import * as THREE from 'three';
import { loadingManager } from './loadingManager.js';
import { config } from './config.js';
// --- FontLoader y TextGeometry YA NO SE IMPORTAN ---
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// -------------------------------------------------

const canvas = document.querySelector('#bg');
if (!canvas) console.error("Canvas element '#bg' not found!");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(config.environmentMap.fallbackBackgroundColor);
scene.environment = null;

// Camera
const camera = new THREE.PerspectiveCamera(
    config.camera.fov, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.fromArray(config.camera.position);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

// --- Variable brandTextMesh ELIMINADA ---
// let brandTextMesh = null;
// --------------------------------------

// Environment & Lighting Setup Function
function setupEnvironment() {
    console.warn("HDRI loading is disabled.");
    scene.environment = null;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, config.lights.ambientIntensity);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, config.lights.directionalIntensity);
    directionalLight.position.fromArray(config.lights.directionalPosition);
    scene.add(directionalLight);
    console.log("Lights set up.");

    // Display Platform
    const platformRadius = 1.0; const platformHeight = 0.1;
    const platformGeometry = new THREE.CylinderGeometry(platformRadius, platformRadius, platformHeight, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.8 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = - (platformHeight / 2);
    scene.add(platform);
    console.log("Display platform added.");

    // --- CÓDIGO DE CARGA DE FUENTE Y TEXTO 3D ELIMINADO ---
    // const fontLoader = new FontLoader(loadingManager);
    // ... resto de la lógica del texto eliminada ...
    // ---------------------------------------------------
}

// Function to handle window resize
function handleResize() { /* ... sin cambios ... */ }

// --- brandTextMesh ELIMINADO de la exportación ---
export { scene, camera, renderer, setupEnvironment, handleResize };
// -------------------------------------------------