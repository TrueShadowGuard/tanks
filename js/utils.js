import {CELL_SIZE} from "./main.js";

export function toPositionOnMap($element, x, y) {
    $element.style.top = (y * CELL_SIZE) + "px";
    $element.style.left = (x * CELL_SIZE) + "px";
}