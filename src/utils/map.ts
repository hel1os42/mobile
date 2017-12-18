import { Map } from 'leaflet';

export class MapUtils {
    static getRadius(radiusPx: number, map: Map) {
        let radius = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat / 180 * Math.PI)) / Math.pow(2, map.getZoom()+8) * radiusPx;
        return radius; 
    }

    static getZoom(latitude: number, radius: number) {
        let zoom = this.round(Math.log2(40075016.686 * 75 * Math.abs(Math.cos(latitude / 180 * Math.PI)) / radius) - 8, 0.25);
        return zoom;
    }

    static round(value, step) {
        step || (step = 1.0);
        var inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }
}