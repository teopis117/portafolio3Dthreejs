import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { loadingManager, loadingOverlay } from './loadingManager.js';
import { config } from './config.js';
import { scene } from './sceneSetup.js';

// Setup Loaders
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath(config.dracoDecoderPath);
gltfLoader.setDRACOLoader(dracoLoader);

// Grupo para el modelo
let currentModelGroup = new THREE.Group();

// Funciones de limpieza (sin cambios)
function disposeMaterial(material) { /* ... as before ... */ }
function clearCurrentModel() { /* ... as before ... */ }

// Load model function - CORREGIDO PARA MANEJAR modelConfig NULL
function loadModel(modelConfig, controls) {
    // --- Check inicial mejorado ---
    if (!modelConfig || !modelConfig.model) {
        const routePath = modelConfig?.path || '(unknown/404)';
        console.warn(`loadModel: No model specified for route ${routePath}. Clearing scene.`);
        clearCurrentModel(); // Limpiar modelo anterior si no hay nuevo
        if(controls) {
            controls.target.set(0,0,0); // Resetear target
            controls.update();
        }
        // Ocultar overlay si no estamos cargando nada
        if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
            setTimeout(() => loadingOverlay.classList.add('hidden'), 50);
        }
        return; // <<< Salir aquí si no hay modelo que cargar
    }
    // -----------------------------

    // --- El resto del código solo se ejecuta si modelConfig y modelConfig.model son válidos ---
    clearCurrentModel(); // Limpiar antes de cargar el nuevo

    const modelPath = config.modelsBasePath + modelConfig.model; // Ahora seguro que modelConfig.model existe
    console.log(`Attempting to load model: ${modelPath}`);

    // Mostrar overlay al iniciar la carga
    if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
        loadingOverlay.classList.remove('hidden', 'info');
        const progressSpan = loadingOverlay.querySelector('#loading-progress');
        const msgDiv = loadingOverlay.querySelector('#loading-message');
        if (progressSpan) progressSpan.textContent = '0';
        if (msgDiv) msgDiv.textContent = 'Cargando...';
    }

    gltfLoader.load(
        modelPath,
        (gltf) => { // onLoad Success
            console.info(`GLTF data received for: ${modelPath}`);
            const loadedModel = gltf.scene;
            loadedModel.scale.set(modelConfig.scale, modelConfig.scale, modelConfig.scale);
            loadedModel.position.fromArray(modelConfig.position);

            loadedModel.traverse((child) => { // Aplicar envMap si existe
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    if (scene.environment && child.material.envMap !== undefined) {
                         child.material.envMap = scene.environment;
                         child.material.envMapIntensity = config.environmentMap.intensity;
                    } else if (child.material.envMap !== undefined) {
                        child.material.envMap = null;
                    }
                    child.material.needsUpdate = true;
                }
            });

            currentModelGroup.add(loadedModel);
            console.info(`Model added to scene group: ${modelPath}`);

            if (controls) { // Actualizar target
                controls.target.fromArray(modelConfig.target);
                controls.update();
                console.info(`Controls target updated for ${modelConfig.model}`);
            }

            // Ocultar overlay al terminar carga exitosa
            if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
                 setTimeout(() => {
                     loadingOverlay.classList.add('hidden');
                     console.log("Overlay hidden after successful model load.");
                 }, 100);
            }
        },
        undefined, // onProgress
        (error) => { // onError
            console.error(`GLTF Loader specific error for ${modelPath}:`, error);
            // El LoadingManager mostrará el error en el overlay
        }
    );
}

export { currentModelGroup, loadModel };