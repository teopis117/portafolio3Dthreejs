import { config } from './config.js';
import { loadModel } from './modelManager.js'; // Imports the new loadModel
import { loadingManager, loadingOverlay } from './loadingManager.js';

let orbitControls = null;
let currentRouteConfig = null;

function setControls(controlsInstance) {
    orbitControls = controlsInstance;
}

// Build routes dynamically from config
const routes = {};
Object.values(config.routes).forEach(routeConfig => {
    routes[routeConfig.path] = () => {
        console.log(`Routing to: ${routeConfig.path}`);
        currentRouteConfig = routeConfig;
        // Calls the modified loadModel - it will create the cube if path is '/'
        loadModel(routeConfig, orbitControls);
        console.log(`Executed route handler for ${routeConfig.path}`);
    };
});

// Add 404 fallback route
routes['/404'] = () => {
    console.log("Routing to: 404 Not Found");
    currentRouteConfig = null;
    loadModel(null, orbitControls); // Clear model
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden', 'error');
        loadingOverlay.classList.add('info');
         const msgDiv = loadingOverlay.querySelector('#loading-message') || loadingOverlay;
         msgDiv.textContent = '404 - Page Not Found';
     }
};

// Main router function
function handleRouteChange() {
    const path = window.location.pathname;
    const routeHandler = routes[path] || routes['/404'];

    console.info(`Path changed to: ${path}, executing handler...`);

    if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
         loadingOverlay.classList.remove('hidden', 'info');
         const progressSpan = loadingOverlay.querySelector('#loading-progress');
         const msgDiv = loadingOverlay.querySelector('#loading-message');
         if (progressSpan) progressSpan.textContent = '0';
         if (msgDiv) msgDiv.textContent = 'Loading...';
    }

    routeHandler();

    // Hide overlay check (might not be needed now loadModel hides it instantly)
    if (!loadingManager.isLoading) { // Check if manager is still busy with maybe HDRI
         setTimeout(() => {
            if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
                 // Only hide if loadModel didn't already hide it? Might cause flicker.
                 // Let's rely on loadModel hiding it for now.
                 // loadingOverlay.classList.add('hidden');
            }
         }, 100);
    }
}

// Initialize router
function initializeRouter() {
    const navElement = document.querySelector('nav');
    if (navElement) {
        navElement.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                const href = event.target.getAttribute('href');
                if (href !== window.location.pathname) {
                    window.history.pushState({}, '', href);
                    handleRouteChange();
                }
            }
        });
    } else {
        console.warn("Navigation element (<nav>) not found.");
    }

     window.addEventListener('popstate', handleRouteChange);

     let initialRouteHandled = false;
     const handleInitialRoute = () => {
         if (!initialRouteHandled) {
             console.info(`Router: Handling initial route via ${loadingManager.isLoading ? 'onLoad/onError' : 'fallback'}.`);
             handleRouteChange();
             initialRouteHandled = true;
         }
     };

     const originalOnLoad = loadingManager.onLoad;
     loadingManager.onLoad = () => {
         if (originalOnLoad) originalOnLoad();
         handleInitialRoute();
     };

     const originalOnError = loadingManager.onError;
     loadingManager.onError = (url) => {
         if (originalOnError) originalOnError(url);
         handleInitialRoute();
     };

     setTimeout(() => {
         if (!initialRouteHandled) {
            console.warn("Router: Handling initial route via fallback timeout.");
            handleInitialRoute();
         }
     }, 300);

    console.info("Router initialized.");
}

export { initializeRouter, setControls, currentRouteConfig };