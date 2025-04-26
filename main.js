import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { config } from './config.js';
import { scene, camera, renderer, setupEnvironment, handleResize } from './sceneSetup.js';
import { currentModelGroup } from './modelManager.js';
import { initializeRouter, setControls, currentRouteConfig } from './routing.js'; // Import router

console.log("Starting Portfolio Application...");

// Add the model holder group to the main scene
scene.add(currentModelGroup);

// Setup Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = config.controls.enableDamping;
controls.dampingFactor = config.controls.dampingFactor;
setControls(controls); // Pass controls instance to the router module

// Setup Environment (HDRI, Lights) - Loading is tracked by LoadingManager
setupEnvironment();

// Initialize Router (attaches listeners, handles initial route via LM callbacks/fallback)
initializeRouter();

// Animation Clock for timing
const clock = new THREE.Clock();

// Main Animation Loop (render loop)
function animate() {
    requestAnimationFrame(animate); // Queue next frame
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    // Update current model's animation if defined in config
    if (currentRouteConfig && currentRouteConfig.animate && currentModelGroup.children.length > 0) {
        const model = currentModelGroup.children[0];
        currentRouteConfig.animate(model, elapsedTime, deltaTime);
    }

    // Update controls (needed for damping)
    controls.update(deltaTime);

    // Render the scene
    renderer.render(scene, camera);
}

// Add resize listener
window.addEventListener('resize', handleResize);

// Start the animation loop
animate();
console.log("Animation loop started.");