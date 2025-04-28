// --- AÑADIR ESTA LÍNEA DE IMPORTACIÓN ---
import {
    CANVAS_ID, PRODUCT_INFO_ID, ACTIVE_CLASS
} from './constants.js';
// Incluye otros IDs de constants.js si los usas directamente aquí en el futuro
// (por ahora, routing.js maneja los IDs de las vistas 2D)
// -----------------------------------------

import { appState } from './appState.js'; // Importar estado global

let canvasElement = null;
let productInfoElement = null;
let viewElements = []; // Array de todos los elementos .page-view y el canvas

/**
 * Inicializa las referencias a los elementos UI principales.
 */
export function initUIManager() {
    // Ahora PRODUCT_INFO_ID y CANVAS_ID sí están definidos gracias a la importación
    canvasElement = document.getElementById(CANVAS_ID);
    productInfoElement = document.getElementById(PRODUCT_INFO_ID);
    const pageViews = Array.from(document.querySelectorAll('.page-view'));

    viewElements = [...pageViews];
    if (canvasElement) {
        viewElements.push(canvasElement);
    } else {
        console.error(`UI Manager: Canvas element '#${CANVAS_ID}' not found!`);
    }
    if (!productInfoElement) {
        console.warn(`UI Manager: Product info element '#${PRODUCT_INFO_ID}' not found.`);
    }
    console.log(`UI Manager Initialized. Tracking ${viewElements.length} view elements.`);
}

/**
 * Cambia la vista activa, ocultando todas las demás.
 * @param {string | null} targetElementId - El ID del elemento a mostrar (div o canvas), o null para ocultar todo.
 */
export function switchView(targetElementId) {
    console.log(`UI Manager: Switching view to element ID: ${targetElementId}`);
    let foundTarget = false;
    let is3DTarget = (targetElementId === CANVAS_ID);

    // Actualizar estado global para pausar/reanudar animación
    appState.is3DViewActive = is3DTarget;

    // Ocultar todos los elementos primero
    viewElements.forEach(element => {
        // Verificar si el elemento existe antes de intentar acceder a classList
        if (element) {
            element.classList.remove(ACTIVE_CLASS);
        }
    });

    // Mostrar el elemento objetivo si existe
    if (targetElementId) {
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.classList.add(ACTIVE_CLASS);
            foundTarget = true;
        } else {
             console.warn(`UI Manager: Target view element with ID '${targetElementId}' not found.`);
        }
    } else {
         console.log("UI Manager: Hiding all views (targetElementId is null).");
    }

    // Ocultar siempre la info del producto explícitamente al cambiar vista principal
    // (se volverá a mostrar si es necesario en routing.js)
    hideProductInfo();
}

/** Muestra el overlay de información del producto */
export function showProductInfo() {
    if (productInfoElement) {
        productInfoElement.classList.add(ACTIVE_CLASS);
        console.log("UI Manager: Product info displayed.");
    }
}

/** Oculta el overlay de información del producto */
export function hideProductInfo() {
    if (productInfoElement) {
        productInfoElement.classList.remove(ACTIVE_CLASS);
    }
}