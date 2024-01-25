import { MapboxDraw, DrawCustomMode } from 'mapbox-gl-draw';

declare module '@mapbox/mapbox-gl-draw' {
    interface Modes {
        static: DrawCustomMode<any, any>; // or the specific type if you have it
        [modeKey: string]: DrawCustomMode<any, any>;
    }

    interface MapboxDraw {
        modes: Modes;
    }
}
