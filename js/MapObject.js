import {toPositionOnMap} from "./utils.js";

export class MapObject {
    constructor(x, y, $element) {
        this.$element = $element;
        this.x = x;
        this.y = y;
    }

    set x(value) {
        this._x = value;
        toPositionOnMap(this.$element, this.x, this.y);
    }

    get x() {
        return this._x;
    }

    set y(value) {
        this._y = value;
        toPositionOnMap(this.$element, this.x, this.y);
    }

    get y() {
        return this._y;
    }
}