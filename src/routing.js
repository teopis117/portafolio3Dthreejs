import { config } from './config.js';
import { loadModel } from './modelManager.js';
import { loadingManager, loadingOverlay } from './loadingManager.js';
import * as uiManager from './uiManager.js'; // Importar todo el módulo
import { CANVAS_ID, VIEW_TYPE_2D, VIEW_TYPE_3D, ACTIVE_CLASS, HIDDEN_CLASS, ERROR_CLASS, INFO_CLASS } from './constants.js';

let orbitControls = null;
let currentRouteConfig = null; // Sigue siendo útil para main.js

function setControls(controlsInstance) { orbitControls = controlsInstance; }

// --- Manejadores específicos para cada ruta ---

function handleShopRoute(routeConfig) {
    console.log("Handling Shop Route...");
    uiManager.switchView(routeConfig.viewElementId); // Muestra #shop-view
    loadModel(null, orbitControls); // Limpia modelo 3D
    uiManager.hideProductInfo();
}

function handleTeddyRoute(routeConfig) {
    console.log("Handling Teddy Route...");
    uiManager.switchView(CANVAS_ID); // Muestra canvas 3D
    loadModel(routeConfig, orbitControls); // Carga teddy.glb
    uiManager.showProductInfo(); // Muestra info del teddy
}

function handleMoreProductsRoute(routeConfig) {
    console.log("Handling More Products Route...");
    uiManager.switchView(routeConfig.viewElementId); // Muestra #more-products-view
    loadModel(null, orbitControls); // Limpia modelo 3D
    uiManager.hideProductInfo();
}

function handleNotFoundRoute() {
    console.log("Handling 404 Not Found Route...");
    uiManager.switchView(null); // Oculta todas las vistas principales
    loadModel(null, orbitControls); // Limpia modelo 3D
    uiManager.hideProductInfo();
    // Mostrar mensaje 404 en overlay
    if (loadingOverlay) {
        loadingOverlay.classList.remove(HIDDEN_CLASS, ERROR_CLASS);
        loadingOverlay.classList.add(INFO_CLASS);
        const msgDiv = loadingOverlay.querySelector('#loading-message') || loadingOverlay;
        msgDiv.textContent = '404 - Página No Encontrada';
        // No ocultar automáticamente el overlay de 404
    }
}

// --- Mapeo de rutas a sus manejadores ---
const routeHandlers = {
    [config.routes.shop.path]: handleShopRoute,
    [config.routes.teddy.path]: handleTeddyRoute,
    [config.routes.moreProducts.path]: handleMoreProductsRoute,
    // Añade más manejadores si añades rutas
};

// --- handleRouteChange ahora busca y llama al manejador ---
function handleRouteChange() {
    const path = window.location.pathname;
    const targetRouteConfig = config.routes[Object.keys(config.routes).find(key => config.routes[key].path === path)];
    const routeHandler = routeHandlers[path] || handleNotFoundRoute; // Obtiene la función manejadora

    console.info(`Path changed to: ${path}. Executing handler...`);
    currentRouteConfig = targetRouteConfig; // Actualizar config globalmente

    const isLoadingModel = targetRouteConfig && targetRouteConfig.type === VIEW_TYPE_3D && targetRouteConfig.model;
    if (isLoadingModel && loadingOverlay && !loadingOverlay.classList.contains(ERROR_CLASS)) {
        // Mostrar overlay solo si vamos a cargar un modelo 3D
        loadingOverlay.classList.remove(HIDDEN_CLASS, INFO_CLASS);
         const progressSpan = loadingOverlay.querySelector('#loading-progress');
         const msgDiv = loadingOverlay.querySelector('#loading-message');
         if (progressSpan) progressSpan.textContent = '0';
         if (msgDiv) msgDiv.textContent = 'Cargando...';
    } else if (!isLoadingModel && loadingOverlay && !loadingOverlay.classList.contains(ERROR_CLASS)){
        // Ocultar overlay inmediatamente si no se carga nada (vistas 2D, 404)
        // La lógica dentro de los handlers específicos también puede ocultarlo
         setTimeout(() => loadingOverlay.classList.add(HIDDEN_CLASS), 50);
    }

    // Ejecutar la función manejadora para la ruta actual
    routeHandler(targetRouteConfig); // Pasar la config al manejador
}
// --- Fin handleRouteChange ---


// initializeRouter (sin cambios internos)
function initializeRouter() {
    uiManager.initUIManager();
    const navElement = document.querySelector('nav');
    if (navElement) { /* ... event listener ... */ }
    else { console.warn("Navigation element (<nav>) not found."); }
     window.addEventListener('popstate', handleRouteChange);
     console.info("Router initialized. Handling initial route directly...");
     requestAnimationFrame(() => { handleRouteChange(); });
     console.info("Router initialization complete.");
}

export { initializeRouter, setControls, currentRouteConfig }; // Exportar como antes