import { VIEW_TYPE_2D, VIEW_TYPE_3D, SHOP_VIEW_ID, MORE_PRODUCTS_VIEW_ID } from './constants.js';

export const config = {
    modelsBasePath: '/models/',
    texturesBasePath: '/textures/',
    fontsBasePath: '/fonts/',
    dracoDecoderPath: 'https://www.gstatic.com/draco/v1/decoders/',

    environmentMap: { hdrPath: null, intensity: 0.5, useAsBackground: false, fallbackBackgroundColor: 0xFFEBF0 },
    camera: { position: [0, 1.0, 3.5], fov: 60 },

    // --- ROUTES Definitions ---
    routes: {
        // Configuración para la ruta raíz (Tienda 2D)
        shop: {
            path: '/',
            type: VIEW_TYPE_2D,
            viewElementId: SHOP_VIEW_ID
        },
        // Configuración para la ruta del producto Teddy (3D)
        teddy: {
            path: '/producto/teddy',
            type: VIEW_TYPE_3D,
            model: 'teddy.glb', // Asegúrate que este archivo existe en public/models
            scale: 1.3,
            position: [0, -0.45, 0],
            target: [0, 0.4, 0],
            animate: null
        },
        // Configuración para la ruta "Más Productos" (2D)
        moreProducts: {
            path: '/mas-productos',
            type: VIEW_TYPE_2D,               // <<< Cambiado a 2D
            viewElementId: MORE_PRODUCTS_VIEW_ID // <<< ID del div HTML a mostrar
            // Quitamos model, scale, position, target, animate ya que es 2D
        }
        // Puedes añadir una ruta 404 explícita aquí si quieres
        // notFound: { path: '/404', type: VIEW_TYPE_2D, viewElementId: 'not-found-view' }
    },
    // -------------------------

    controls: { enableDamping: true, dampingFactor: 0.05 },
    lights: { ambientIntensity: 0.8, directionalIntensity: 1.5, directionalPosition: [3, 5, 4] },
};