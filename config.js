// Configuration for the portfolio application
export const config = {
    // Base paths
    modelsBasePath: '/models/',
    texturesBasePath: '/textures/',
    dracoDecoderPath: 'https://www.gstatic.com/draco/v1/decoders/',

    // Environment map
    environmentMap: {
        hdrPath: 'kloppenheim_06_1k.hdr',
        intensity: 1.5,
        useAsBackground: true,
        fallbackBackgroundColor: 0x111111
    },

    // Camera
    camera: {
        position: [0, 1.5, 7], // Movemos un poco más atrás por si los modelos son grandes
        fov: 75
    },

    // --- UPDATED ROUTES ---
    routes: {
        home: { // F/A-18 Hornet Route
            path: '/',
            model: 'hornet.glb',      // <<< Hornet model file
            scale: 0.5,               // <<< GUESS! Start potentially small, adjust later
            position: [0, 1.0, 0],    // <<< Adjust Y position
            target: [0, 1.0, 0],      // <<< Aim at model center
            animate: (model, elapsedTime, deltaTime) => { // Simple rotation
                if (model) model.rotation.y = elapsedTime * 0.2;
            }
        },
        projectExample: { // MiG-15 Route
            path: '/proyecto-ejemplo',
            model: 'mig15.glb',        // <<< MiG-15 model file
            scale: 0.8,               // <<< GUESS! May need different scale
            position: [0, 0.8, 0],     // <<< Adjust Y position
            target: [0, 0.8, 0],       // <<< Aim at model center
            animate: (model, elapsedTime, deltaTime) => { // Simple rotation
                 if (model) model.rotation.y = elapsedTime * 0.3;
            }
        }
        // Add more routes/projects here
    },
    // ----------------------

     // Controls
     controls: {
        enableDamping: true,
        dampingFactor: 0.05
     },

     // Lights
     lights: {
         ambientIntensity: 0.7, // Slight increase maybe
         directionalIntensity: 1.5, // Slight increase maybe
         directionalPosition: [5, 10, 7.5]
     }
};