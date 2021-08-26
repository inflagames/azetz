/**
 * @param vector {{x: number, y: number}}
 * @param phi {number}
 * @return {{x: number, y: number}}
 */
export function rotateVector(vector, phi) {
  return {
    x: vector.x * Math.cos(phi) - vector.y * Math.sin(phi),
    y: vector.x * Math.sin(phi) + vector.y * Math.cos(phi),
  };
}
