import * as THREE from 'three';
// GLTF/Draco loaders are not needed if we only create programmatically
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { loadingManager, loadingOverlay } from './loadingManager.js';
import { config } from './config.js';
import { scene } from './sceneSetup.js'; // Import scene to check environment map

// --- REMOVE or Comment Out GLTF/Draco Loader Setup ---
// const gltfLoader = new GLTFLoader(loadingManager);
// const dracoLoader = new DRACOLoader(loadingManager);
// dracoLoader.setDecoderPath(config.dracoDecoderPath);
// gltfLoader.setDRACOLoader(dracoLoader);

// Group to hold the currently active model
let currentModelGroup = new THREE.Group();

// Enhanced cleanup function (still useful)
function disposeMaterial(material) {
    if (!material) return;
    Object.keys(material).forEach(key => {
        const value = material[key];
        if (value && typeof value === 'object' && value.isTexture) {
            value.dispose();
        }
    });
    material.dispose();
}

function clearCurrentModel() {
    let disposedCount = 0;
    while (currentModelGroup.children.length > 0) {
        const object = currentModelGroup.children[0];
        if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(disposeMaterial);
                } else {
                    disposeMaterial(object.material);
                }
            }
        }
        currentModelGroup.remove(object);
        disposedCount++;
    }
     if (disposedCount > 0) console.info(`Previous model cleared (${disposedCount} root children).`);
}

// Load model function - NOW CREATES A CUBE PROGRAMMATICALLY
function loadModel(modelConfig, controls) { // modelConfig still provides scale/pos/target
    clearCurrentModel();
    console.log("Creating programmatic cube model...");

    // Ensure overlay hides as no file loading is happening here
    if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
        setTimeout(() => loadingOverlay.classList.add('hidden'), 50);
    }

    // Use default values if modelConfig is missing (e.g., for 404 route)
    const scale = modelConfig?.scale ?? 1;
    const position = modelConfig?.position ?? [0, 0.5, 0];
    const target = modelConfig?.target ?? [0, 0.5, 0];

    try {
        // Create geometry and material
        const geometry = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 cube dimensions
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00, // Bright Green for visibility
            metalness: 0.2,  // Add some standard material properties
            roughness: 0.7,
            envMapIntensity: config.environmentMap.intensity // Use env map intensity from config
        });

        // Apply environment map for reflections if it's loaded
        if (scene.environment) {
            material.envMap = scene.environment;
            console.log("Applied environment map to programmatic cube material.");
        } else {
            console.log("Scene environment map not ready, skipping application to material.");
        }

        // Create the mesh
        const cubeMesh = new THREE.Mesh(geometry, material);

        // Apply scale and position from config (or defaults)
        cubeMesh.scale.set(scale, scale, scale);
        cubeMesh.position.fromArray(position);

        // Add mesh to the group (which is already in the scene)
        currentModelGroup.add(cubeMesh);
        console.info("Programmatic cube added to scene group.");

        // Update controls target
        if (controls) {
            controls.target.fromArray(target);
            controls.update();
            console.info(`Controls target updated for programmatic cube.`);
        }
    } catch (error) {
        console.error("Error creating programmatic cube:", error);
    }
}

export { currentModelGroup, loadModel }; // Export group and function