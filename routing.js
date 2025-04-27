import { config } from './config.js';
import { loadModel } from './modelManager.js'; // Sigue siendo necesario para 3D
import { loadingManager, loadingOverlay } from './loadingManager.js';

let orbitControls = null;
let currentRouteConfig = null;

// Referencias a elementos clave (obtenidos una vez)
const productInfoDiv = document.getElementById('product-info');
const canvas3D = document.getElementById('bg');
const viewElements = document.querySelectorAll('.page-view'); // Todos los divs de vistas 2D

function setControls(controlsInstance) { orbitControls = controlsInstance; }

// --- REESTRUCTURAR routes PARA BÚSQUEDA FÁCIL ---
// Crear un mapa de rutas para buscar por path eficientemente
const routeMap = new Map();
Object.values(config.routes).forEach(routeConfig => {
    routeMap.set(routeConfig.path, routeConfig);
});
// --------------------------------------------

// --- NUEVO: Función para activar/desactivar vistas ---
function switchView(routeConfig) {
    currentRouteConfig = routeConfig; // Guardar ruta actual

    // 1. Ocultar todas las vistas 2D y el canvas 3D
    viewElements.forEach(el => el.classList.remove('active'));
    if (canvas3D) canvas3D.classList.remove('active');
    if (productInfoDiv) productInfoDiv.style.display = 'none'; // Ocultar info de producto

    // 2. Activar la vista correcta
    if (routeConfig && routeConfig.type === '2D') {
        const viewToShow = document.getElementById(routeConfig.viewElementId);
        if (viewToShow) {
            viewToShow.classList.add('active');
            console.log(`Displayed 2D view: #${routeConfig.viewElementId}`);
            loadModel(null, orbitControls); // Limpiar modelo 3D si venimos de uno
            // Ocultar overlay de carga rápido para vistas 2D
             if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
                 setTimeout(() => loadingOverlay.classList.add('hidden'), 50);
             }
        } else {
            console.error(`View element not found: #${routeConfig.viewElementId}`);
            // Mostrar vista 404?
        }
    } else if (routeConfig && routeConfig.type === '3D') {
        if (canvas3D) {
            canvas3D.classList.add('active'); // Mostrar canvas
            console.log("Displayed 3D view (canvas).");
            loadModel(routeConfig, orbitControls); // Cargar el modelo para esta vista 3D
             if (productInfoDiv && routeConfig.path === '/producto/teddy') { // Mostrar info solo para el teddy
                 productInfoDiv.style.display = 'block';
             }
            // El overlay de carga se ocultará cuando loadModel termine (si carga algo)
        } else {
            console.error("3D Canvas element '#bg' not found!");
        }
    } else { // Ruta 404 o tipo inválido
        console.log("Routing to: 404 Not Found (or invalid route type)");
        loadModel(null, orbitControls); // Limpiar modelo
        // Podríamos tener un div #404-view y mostrarlo aquí
        if (loadingOverlay) { /* ... mostrar mensaje 404 ... */ }
    }
}
// ------------------------------------------------

// --- handleRouteChange MODIFICADO ---
function handleRouteChange() {
    const path = window.location.pathname;
    const targetRouteConfig = routeMap.get(path); // Buscar ruta en el mapa

    console.info(`Path changed to: ${path}, executing handler...`);

    // Mostrar overlay (se ocultará según la lógica de switchView o loadModel)
    if (loadingOverlay && !loadingOverlay.classList.contains('error')) { /* ... mostrar overlay ... */ }

    if (targetRouteConfig) {
        switchView(targetRouteConfig); // Llamar a la nueva función para cambiar la vista
    } else {
        switchView(null); // Mostrar 404 (o lo que decida switchView)
    }
}
// -----------------------------------

// Initialize router (sin cambios internos, pero ahora llama a la nueva lógica)
function initializeRouter() {
    const navElement = document.querySelector('nav');
    if (navElement) {
        navElement.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                const href = event.target.getAttribute('href');
                // Evitar navegación si es un enlace externo o tiene target especial
                 if (href && href.startsWith('/') && event.target.target !== '_blank') {
                    event.preventDefault();
                    if (href !== window.location.pathname) {
                        window.history.pushState({}, '', href);
                        handleRouteChange();
                    }
                 }
            }
        });
    } else { console.warn("Navigation element (<nav>) not found."); }

     window.addEventListener('popstate', handleRouteChange);

     // --- MANEJO INICIAL SIMPLIFICADO ---
     // Llama a handleRouteChange después de un breve instante para asegurar que todo esté listo
     console.info("Router initialized. Handling initial route shortly...");
     // Usamos requestAnimationFrame para esperar al menos un ciclo de renderizado
     requestAnimationFrame(() => {
         handleRouteChange();
     });
     // ---------------------------------

    console.info("Router initialization complete.");
}

// Exportar como antes, pero currentRouteConfig ahora se setea en switchView
export { initializeRouter, setControls, currentRouteConfig };