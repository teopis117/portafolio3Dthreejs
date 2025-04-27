// Configuration for the portfolio application
export const config = {
    modelsBasePath: '/models/',
    texturesBasePath: '/textures/',
    fontsBasePath: '/fonts/',
    dracoDecoderPath: 'https://www.gstatic.com/draco/v1/decoders/',

    environmentMap: {
        hdrPath: null, intensity: 0.5, useAsBackground: false, fallbackBackgroundColor: 0xFFEBF0 // Cambiado a un rosa muy suave (LavanderBlush)
    },

    camera: { position: [0, 1.0, 3.5], fov: 60 },

    // --- ROUTES REESTRUCTURADAS ---
    routes: {
        shop: { // Vista principal de la tienda
            path: '/',
            type: '2D',               // <<< Tipo de vista
            viewElementId: 'shop-view' // <<< ID del div HTML a mostrar
        },
        teddy: { // Vista 3D del oso
            path: '/producto/teddy',  // <<< Nueva ruta para el oso
            type: '3D',               // <<< Tipo de vista
            model: 'teddy.glb',
            scale: 1.3,
            position: [0, -0.45, 0], // Mantener posición ajustada
            target: [0, 0.4, 0],
            animate: null
        },
        moreProducts: { // Otra página 2D de ejemplo
            path: '/mas-productos',
            type: '2D',
            viewElementId: 'more-products-view'
        }
        // Añadir más rutas 2D o 3D aquí
    },
    // ----------------------------

     controls: { enableDamping: true, dampingFactor: 0.05 },
     lights: { ambientIntensity: 0.8, directionalIntensity: 1.5, directionalPosition: [3, 5, 4] },
     // brandText eliminado
};