import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Need this again
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'; // Need this again
import { loadingManager, loadingOverlay } from './loadingManager.js';
import { config } from './config.js';
import { scene } from './sceneSetup.js';

// --- Restore GLTF/Draco Loader Setup ---
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath(config.dracoDecoderPath);
gltfLoader.setDRACOLoader(dracoLoader);
// --- ----------------------------- ---

// Group to hold the currently active single model
let currentModelGroup = new THREE.Group();

// Cleanup function
function disposeMaterial(material) { /* ... as before ... */
    if (!material) return;
    Object.keys(material).forEach(key => {
        const value = material[key];
        if (value && typeof value === 'object' && value.isTexture) {
            value.dispose();
        }
    });
    material.dispose();
}
function clearCurrentModel() { /* ... as before ... */
    let disposedCount = 0;
    while (currentModelGroup.children.length > 0) {
        const object = currentModelGroup.children[0];
        // Use general cleanup for meshes or groups loaded
        if (object.isMesh) {
             if (object.geometry) object.geometry.dispose();
             if (object.material) {
                 if (Array.isArray(object.material)) {
                     object.material.forEach(disposeMaterial);
                 } else {
                     disposeMaterial(object.material);
                 }
             }
        } else if (object.isGroup || object.isScene) {
            // More complex cleanup might be needed for groups/scenes
            // For now, just remove, rely on GC. Proper cleanup traverses children.
            console.warn("Clearing a Group/Scene - full resource disposal might need traversal.");
        }
        currentModelGroup.remove(object);
        disposedCount++;
    }
     if (disposedCount > 0) console.info(`Previous model cleared.`);
}


// Load model function - REVERTED TO SINGLE MODEL LOADING
function loadModel(modelConfig, controls) {
    // Handle routes with no model defined
    if (!modelConfig || !modelConfig.model) {
        console.warn(`loadModel: No model specified for route ${modelConfig?.path || '(unknown)'}. Clearing scene.`);
        clearCurrentModel();
        if(controls) { controls.target.set(0,0,0); controls.update(); }
        if (loadingOverlay && !loadingOverlay.classList.contains('error')) { setTimeout(() => loadingOverlay.classList.add('hidden'), 50); }
        return;
    }

    // Proceed if model is defined
    clearCurrentModel();

    const modelPath = config.modelsBasePath + modelConfig.model; // Get path from config
    console.log(`Attempting to load model: ${modelPath}`);

    // Show loading overlay
    if (loadingOverlay && !loadingOverlay.classList.contains('error')) { /* ... show overlay ... */
        loadingOverlay.classList.remove('hidden', 'info');
        const progressSpan = loadingOverlay.querySelector('#loading-progress');
        const msgDiv = loadingOverlay.querySelector('#loading-message');
        if (progressSpan) progressSpan.textContent = '0';
        if (msgDiv) msgDiv.textContent = 'Loading...';
    }

    // Use GLTFLoader again
    gltfLoader.load(
        modelPath,
        // --- onLoad Success Callback ---
        (gltf) => {
            console.info(`GLTF data received for: ${modelPath}`);
            const loadedModel = gltf.scene; // Get the loaded model/scene object

            // Apply scale and position from config
            // Note: Scale might need significant adjustment depending on the model's original size
            loadedModel.scale.set(modelConfig.scale, modelConfig.scale, modelConfig.scale);
            loadedModel.position.fromArray(modelConfig.position);

            // Traverse and apply environment map etc.
            loadedModel.traverse((child) => {
                if (child.isMesh) {
                     // Optional: Enable shadows
                     // child.castShadow = true;
                     // child.receiveShadow = true; // Ground plane would need this

                    if (child.material && child.material.isMeshStandardMaterial) {
                        // Apply env map ONLY if scene.environment exists
                        if (scene.environment && child.material.envMap !== undefined) {
                             child.material.envMap = scene.environment;
                             child.material.envMapIntensity = config.environmentMap.intensity;
                        } else if (child.material.envMap !== undefined) {
                            child.material.envMap = null;
                        }
                        child.material.needsUpdate = true;
                    }
                }
            });

            currentModelGroup.add(loadedModel); // Add the loaded model to our group
            console.info(`Model added to scene group: ${modelPath}`);

            // Update controls target based on config
            if (controls) {
                controls.target.fromArray(modelConfig.target);
                controls.update();
                console.info(`Controls target updated for ${modelConfig.model}`);
            }

            // Explicitly hide overlay on successful model load
            if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
                 setTimeout(() => {
                     loadingOverlay.classList.add('hidden');
                     console.log("Overlay hidden after successful model load.");
                 }, 100);
            }
        },
        undefined, // onProgress handled by LoadingManager
        (error) => { // onError for gltfLoader.load
            console.error(`GLTF Loader specific error for ${modelPath}:`, error);
        }
    );
}

export { currentModelGroup, loadModel }; // Export group and load function