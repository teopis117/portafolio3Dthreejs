import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { config } from './config.js';
// --- brandTextMesh YA NO SE IMPORTA ---
import { scene, camera, renderer, setupEnvironment, handleResize } from './sceneSetup.js';
// ------------------------------------
import { currentModelGroup } from './modelManager.js';
import { initializeRouter, setControls, currentRouteConfig } from './routing.js';

console.log("Starting Portfolio Application...");

scene.add(currentModelGroup);

// Setup Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = config.controls.enableDamping;
controls.dampingFactor = config.controls.dampingFactor;
setControls(controls);

// Setup Environment (Ya no carga fuente/texto)
setupEnvironment();

// Initialize Router
initializeRouter();

// Animation Clock
const clock = new THREE.Clock();

// Main Animation Loop
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    // Animate current model (si aplica)
    if (currentRouteConfig && currentRouteConfig.animate && currentModelGroup.children.length > 0) {
        const model = currentModelGroup.children[0];
        currentRouteConfig.animate(model, elapsedTime, deltaTime);
    }

    // --- BLOQUE DE ANIMACIÓN DEL TEXTO 3D ELIMINADO ---
    // if (brandTextMesh) { ... }
    // ---------------------------------------------

    controls.update(deltaTime);
    renderer.render(scene, camera);
}

// Add resize listener
window.addEventListener('resize', handleResize);

// Start the animation loop
animate();
console.log("Animation loop started.");