/**
 * Three dimensional vector with some color related methods.
 * @class
 */
export default class Color {
    static random() {
        return new Color(
            Math.round(255 * Math.random()),
            Math.round(255 * Math.random()),
            Math.round(255 * Math.random())
        )
    }


    /**
     * Return a vector with each component being a random number between `min`
     * and `max`.
     * @arg {number} min - The minimum value for a component.
     * @arg {number} max - The maximum value for a component.
     */
    static randomComponentsBetween(min, max) {
        const scale = max - min

        return new Color(
            (scale * Math.random()) + min,
            (scale * Math.random()) + min,
            (scale * Math.random()) + min
        )
    }


    constructor(r, g, b) {
        if (!(Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b))) {
            throw new TypeError()
        }

        this.r = r
        this.g = g
        this.b = b
    }


    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }


    cross(other) {
        return new Color(
            (this.g * other.b) - (this.b * other.g),
            (this.b * other.r) - (this.r * other.b),
            (this.r * other.g) - (this.g * other.r)
        )
    }


    plus(other) {
        return new Color(
            this.r + other.r,
            this.g + other.g,
            this.b + other.b
        )
    }


    minus(other) {
        return new Color(
            this.r - other.r,
            this.g - other.g,
            this.b - other.b
        )
    }


    scale(scalar) {
        return new Color(
            this.r * scalar,
            this.g * scalar,
            this.b * scalar
        )
    }


    trim() {
        let r = Math.round(this.r)
        let g = Math.round(this.g)
        let b = Math.round(this.b)

        if (r < 0) {
            r = 0
        } else if (r > 255) {
            r = 255
        }

        if (g < 0) {
            g = 0
        } else if (g > 255) {
            g = 255
        }

        if (b < 0) {
            b = 0
        } else if (b > 255) {
            b = 255
        }

        return new Color(r, g, b)
    }
}
