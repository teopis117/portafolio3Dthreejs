import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { loadingManager, loadingOverlay } from './loadingManager.js';
import { config } from './config.js';
// import { scene } from './sceneSetup.js'; // Ya no necesitamos importar scene aquí

// Loaders
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath(config.dracoDecoderPath);
gltfLoader.setDRACOLoader(dracoLoader);

// Grupo para el modelo
let currentModelGroup = new THREE.Group();

// Funciones de limpieza (sin cambios)
function disposeMaterial(material) { /* ... as before ... */ }
function clearCurrentModel() { /* ... as before ... */ }

// Cargar modelo
function loadModel(modelConfig, controls) {
    if (!modelConfig || !modelConfig.model) { /* ... sin cambios ... */ }

    clearCurrentModel();
    const modelPath = config.modelsBasePath + modelConfig.model;
    console.log(`Attempting to load model: ${modelPath}`);
    if (loadingOverlay && !loadingOverlay.classList.contains('error')) { /* ... mostrar overlay ... */ }

    gltfLoader.load(
        modelPath,
        (gltf) => {
            console.info(`GLTF data received for: ${modelPath}`);
            const loadedModel = gltf.scene;
            loadedModel.scale.set(modelConfig.scale, modelConfig.scale, modelConfig.scale);
            loadedModel.position.fromArray(modelConfig.position);

            // Traverse - QUITAMOS la lógica de aplicar scene.environment
            loadedModel.traverse((child) => {
                if (child.isMesh) {
                    // Opcional: Habilitar sombras (si las configuras en sceneSetup y luces)
                    // child.castShadow = true;
                    // child.receiveShadow = false; // Modelos raramente reciben sombras sobre sí mismos

                    // Ya no aplicamos envMap aquí porque scene.environment es null
                    if (child.material && child.material.isMeshStandardMaterial) {
                         if (child.material.envMap !== undefined) {
                            child.material.envMap = null; // Asegurar que no tenga envMap
                         }
                         child.material.needsUpdate = true;
                    }
                }
            });

            currentModelGroup.add(loadedModel);
            console.info(`Model added to scene group: ${modelPath}`);

            if (controls) { /* ... actualizar target (sin cambios) ... */ }
            if (loadingOverlay && !loadingOverlay.classList.contains('error')) { /* ... ocultar overlay ... */ }
        },
        undefined, // onProgress
        (error) => { /* ... log error (sin cambios) ... */ }
    );
}

export { currentModelGroup, loadModel };