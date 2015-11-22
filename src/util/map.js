/**
 * Maps a value from one range to another.
 * @arg {number} x - The value to map.
 * @arg {number} xMin - The lower bound of the domain.
 * @arg {number} xMax - The upper bound of the domain.
 * @arg {number} yMin - The lower bound of the range.
 * @arg {number} yMax - The upper bound of the range.
 */
export default (x, xMin, xMax, yMin, yMax) =>
    (((yMax - yMin) / (xMax - xMin)) * (x - xMin)) + yMin
