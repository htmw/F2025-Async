/**
 * 
    Haversine Formula to get the distance in meters between two points
    SOURCE: https://www.movable-type.co.uk/scripts/latlong.html
 */
export function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number): number {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI / 180; // φ, λ in radians
    const phi2 = lat2 * Math.PI / 180;
    const delta_phi = (lat2 - lat1) * Math.PI / 180;
    const delta_lambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(delta_lambda / 2) * Math.sin(delta_lambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d_in_m = R * c;

    return d_in_m; // in metres
}