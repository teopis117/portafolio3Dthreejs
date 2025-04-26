// Configuration for the portfolio application
export const config = {
    // Base paths for assets (relative to the 'public' directory)
    modelsBasePath: '/models/',
    texturesBasePath: '/textures/',

    // Draco decoder path (CDN recommended)
    dracoDecoderPath: 'https://www.gstatic.com/draco/v1/decoders/',

    // Environment map settings
    environmentMap: {
        hdrPath: 'kloppenheim_06_1k.hdr', // Match the file in your public/textures folder
        intensity: 2.5, // Keep intensity high for now
        useAsBackground: false,
        fallbackBackgroundColor: 0x111111
    },

    // Initial camera settings
    camera: {
        position: [0, 1.5, 5], // x, y, z
        fov: 75
    },

    // Route-specific settings
    routes: {
        home: {
            path: '/',
            // model: 'cube.glb', // REMOVED - We create the cube programmatically now
            scale: 1,           // Scale for the programmatic cube
            position: [0, 0.5, 0], // Position for the programmatic cube
            target: [0, 0.5, 0],   // Target for the programmatic cube
            animate: null
        },
        projectExample: {
            path: '/proyecto-ejemplo',
            model: null, // No model for this route
            scale: 1,
            position: [0, 0, 0],
            target: [0, 0, 0],
            animate: null
        }
    },

     // Controls settings
     controls: {
        enableDamping: true,
        dampingFactor: 0.05
     },

     // Lighting settings
     lights: {
         ambientIntensity: 1.0, // Keep intensity high
         directionalIntensity: 2.0, // Keep intensity high
         directionalPosition: [5, 10, 7.5]
     }
};