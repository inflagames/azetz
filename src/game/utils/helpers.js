import {SCREEN_WIDTH} from "../game";

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
