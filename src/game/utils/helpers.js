import {SCREEN_WIDTH} from "../game";

/**
 * @param vector {{x: number, y: number}}
 * @param pivot {{x: number, y: number}}
 * @param phi {number}
 * @return {{x: number, y: number}}
 */
export function getPointByVectorRotation(vector, pivot, phi) {
  const result = rotateVector(vector, phi);
  return {x: pivot.x + result.x, y: pivot.y - result.y};
}

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

export function getVector(p1, p2) {
  return {x: p2.x - p1.x, y: p2.y - p1.y};
}

export function distance(p1, p2) {
  return Math.sqrt( Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) );
}

/**
 * @param value {number}
 * @return {number}
 */
export function scale(value) {
  return value * window.currentWidth / SCREEN_WIDTH;
}


export function unscale(value) {
  return value * SCREEN_WIDTH / window.currentWidth;
}

/**
 * @param limit {number}
 * @param start {number}
 * @returns {number}
 */
export function randomNumber(limit, start = 0) {
  return Math.floor(Math.random() * limit) + start;
}
