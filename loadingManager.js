import * as THREE from 'three';

// Get overlay elements - ensure they exist in your index.html
const loadingOverlay = document.getElementById('loading-overlay');
const loadingProgressSpan = document.getElementById('loading-progress');
const loadingMessageDiv = document.getElementById('loading-message'); // Optional: for error messages

// Create the single LoadingManager instance
const loadingManager = new THREE.LoadingManager(
    // --- onLoad ---
    () => {
        console.info('LoadingManager: onLoad triggered.');
        setTimeout(() => {
            if (loadingOverlay && !loadingOverlay.classList.contains('error')) {
                loadingOverlay.classList.add('hidden');
            }
        }, 500);
    },
    // --- onProgress ---
    (url, itemsLoaded, itemsTotal) => {
        const progress = Math.round((itemsLoaded / itemsTotal) * 100);
        if (loadingProgressSpan) {
            loadingProgressSpan.textContent = progress;
        }
        console.info(`LoadingManager: Progress ${itemsLoaded}/${itemsTotal} (${progress}%) - ${url}`);
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden', 'error');
            if (loadingMessageDiv) loadingMessageDiv.textContent = 'Loading...';
        }
    },
    // --- onError ---
    (url) => {
        console.error(`LoadingManager: Error loading ${url}`);
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
            loadingOverlay.classList.add('error');
            if (loadingMessageDiv) {
                loadingMessageDiv.textContent = `Error loading asset. Check console & file path: ${url}`;
            } else {
                 loadingOverlay.textContent = `Error loading ${url}. Check console.`;
            }
        }
    }
);

export { loadingManager, loadingOverlay };