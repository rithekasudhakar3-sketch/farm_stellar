/**
 * Calculate the Haversine distance between two points in meters.
 * @param {Array} coord1 - [latitude, longitude] of the first point
 * @param {Array} coord2 - [latitude, longitude] of the second point
 * @returns {number} - Distance in meters
 */
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Calculate the geofence radius based on land size and unit.
 * Adds a safety buffer for GPS error.
 * @param {number} size - Land size
 * @param {string} unit - 'acres' or 'hectares'
 * @returns {number} - Radius in meters (including buffer)
 */
function calculateGeofenceRadius(size, unit) {
    let areaInSqMeters = 0;
    if (unit === 'acres') {
        areaInSqMeters = size * 4046.86;
    } else if (unit === 'hectares') {
        areaInSqMeters = size * 10000;
    } else {
        areaInSqMeters = size * 4046.86;
    }

    // Radius of a circle with equivalent area: A = pi * r^2 => r = sqrt(A / pi)
    const radius = Math.sqrt(areaInSqMeters / Math.PI);

    // Add safety buffer (e.g., 20 meters for GPS error)
    const buffer = 20;
    return Math.round(radius + buffer);
}

module.exports = {
    getDistanceFromLatLonInM,
    calculateGeofenceRadius
};
