import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { config } from './config.js';
import { scene, camera, renderer, setupEnvironment, handleResize } from './sceneSetup.js';
import { currentModelGroup } from './modelManager.js';
import { initializeRouter, setControls, currentRouteConfig } from './routing.js';

console.log("Starting Portfolio Application...");

// Add the model holder group to the main scene
scene.add(currentModelGroup);

// Setup Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = config.controls.enableDamping;
controls.dampingFactor = config.controls.dampingFactor;
setControls(controls);

// Setup Environment
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

    // --- Re-enable call to model's animate function from config ---
    if (currentRouteConfig && currentRouteConfig.animate && currentModelGroup.children.length > 0) {
        // Assuming the loaded model scene is the first child
        const model = currentModelGroup.children[0];
        currentRouteConfig.animate(model, elapsedTime, deltaTime);
    }
    // -------------------------------------------------------------

    controls.update(deltaTime);
    renderer.render(scene, camera);
}

// Add resize listener
window.addEventListener('resize', handleResize);

// Start the animation loop
animate();
console.log("Animation loop started.");