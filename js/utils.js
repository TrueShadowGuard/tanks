import {CELL_SIZE} from "./main.js";

export function toPositionOnMap($element, x, y) {
    $element.style.top = (y * CELL_SIZE) + "px";
    $element.style.left = (x * CELL_SIZE) + "px";
}

export function rotateElement($element, value) {
    $element.style.transform = `rotate(${value})`;
}

export function roundTo(number, part) {
    return Math.round(number * part) / part;
}

export function isSquareInsideSquare(outsideX, outsideY, outsideSize, insideX, insideY, insideSize) {
    return (
        insideX > outsideX &&
        insideY > outsideY &&
        (insideX + insideSize / CELL_SIZE) < (outsideX + outsideSize / CELL_SIZE) &&
        (insideY + insideSize / CELL_SIZE) < (outsideY + outsideSize / CELL_SIZE)
    );
}

export function getRandomAvaliableDirection(availableDirections) {
    const directionsArray = Object
        .entries(availableDirections)
        .filter(([dir, avaliable]) => avaliable)
        .map(([dir, avaliable]) => dir);
    return directionsArray[Math.trunc(Math.random() * directionsArray.length)];
}
