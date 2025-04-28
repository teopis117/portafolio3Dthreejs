import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// --- NUEVA LÍNEA: Importar CSS ---
import '../src/style.css'; // <<< Importa el CSS desde la raíz relativa a src/
// --------------------------------
import { config } from './config.js';
import { scene, camera, renderer, setupEnvironment, handleResize } from './sceneSetup.js';
import { currentModelGroup } from './modelManager.js';
import { initializeRouter, setControls, currentRouteConfig } from './routing.js';
import { appState } from './appState.js';

console.log("Starting Portfolio Application...");

scene.add(currentModelGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = config.controls.enableDamping;
controls.dampingFactor = config.controls.dampingFactor;
setControls(controls);

setupEnvironment();
initializeRouter();

const clock = new THREE.Clock();

function animate() {
    if (!appState.is3DViewActive) {
        requestAnimationFrame(animate);
        return;
    }

    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    if (currentRouteConfig && currentRouteConfig.animate && currentModelGroup.children.length > 0) {
        const model = currentModelGroup.children[0];
        currentRouteConfig.animate(model, elapsedTime, deltaTime);
    }

    controls.update(deltaTime);
    renderer.render(scene, camera);
}

window.addEventListener('resize', handleResize);

animate();
console.log("Animation loop started.");