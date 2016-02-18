// local imports
import Color from 'util/Color'
import mod from 'util/mod'


/**
 * Two dimensional array of colors capable of being animated.
 * @class
 */
export default class ColorBoard {
    constructor(rows, cols) {
        if (rows <= 0 || Math.floor(rows) !== rows) {
            throw new Error(`expected positive integer, got: ${rows}`)
        }
        if (cols <= 0 || Math.floor(cols) !== cols) {
            throw new Error(`expected positive integer, got: ${cols}`)
        }

        this._rows = rows
        this._cols = cols

        // initialize `this._matrix` to random colors
        this.randomize()

        // infinitesimal time step
        this.dt = 0.1
        // differential equation parameter determining color decay
        this.kDecay = 0.02
        // differential equation parameter determining color-color coupling
        this.kColor = 0.34
        // differential equation parameter determining color-space coupling
        this.kSpace = 1.1
    }


    get rows() {
        return this._rows
    }


    set rows(rows) {
        if (rows <= 0 || Math.floor(rows) !== rows) {
            throw new Error(`expected positive integer, got: ${rows}`)
        }

        // if desired number of rows is less than current number of rows
        if (rows < this._rows) {
            // just slice off the extra rows
            this._matrix = this._matrix.slice(0, rows)
        // otherwise desired number of rows is greater than current number of rows
        } else {
            // so just recycle the already existing rows

            // number of times already existing rows fit into desired rows
            const m = Math.floor(rows / this._rows)
            // extra left over after fitting m described above
            const n = rows - (m * this._rows)

            // recycle the entire original matrix m - 1 times
            for (var k = 0; k < m - 1; k++) {
                this._matrix = this._matrix.concat(this._matrix.slice(0, this._rows))
            }
            // add on the last n remaining rows
            this._matrix = this._matrix.concat(this._matrix.slice(0, n))
        }

        this._rows = rows
    }


    get cols() {
        return this._cols
    }


    set cols(cols) {
        if (cols <= 0 || Math.floor(cols) !== cols) {
            throw new Error(`expected positive integer, got: ${cols}`)
        }

        // if desired number of cols is less than current number of cols
        if (cols < this._cols) {
            // just slice off the extra cols
            this._matrix = this._matrix.map(
                row => row.slice(0, cols)
            )
        // otherwise desired number of cols is greater than current number of cols
        } else {
            // so just recycle the already existing cols

            // number of times already existing cols fit into desired cols
            const m = Math.floor(cols / this._cols)
            // extra left over after fitting m described above
            const n = cols - (m * this._cols)

            // map each row to the new cycled row
            this._matrix = this._matrix.map(row => {
                let newRow = row
                // recycle the entire original row m - 1 times
                for (var k = 0; k < m - 1; k++) {
                    newRow = newRow.concat(newRow.slice(0, this._cols))
                }
                // add on the last n remaining cols
                newRow = newRow.concat(newRow.slice(0, n))

                return newRow
            })
        }

        this._cols = cols
    }


    /**
     * Sets the matrix to random colors.
     */
    randomize() {
        this._matrix = []

        for (var i = 0; i < this._rows; i++) {
            this._matrix[i] = []

            for (var j = 0; j < this._cols; j++) {
                this._matrix[i][j] = Color.random()
            }
        }
    }


    /**
     * Iterates the simulation forward one step in time.
     */
    next() {
        this._matrix = this._matrix.map(
            (row, i) => row.map(
                (color, j) => this.nextAt(i, j)
            )
        )

        return this
    }


    /**
     * Returns the value at a given location on the board (toroidally).
     * @arg {number} i - The "y" index. Must be an integer.
     * @arg {number} j - The "x" index. Must be an integer.
     */
    at(i, j) {
        // ensure that `i` and `j` are integers
        if (Math.floor(i) !== i || Math.floor(j) !== j) {
            throw new Error(`expected integers, got: ${i}, ${j}`)
        }

        return this._matrix[mod(i, this._rows)][mod(j, this._cols)]
    }


    /**
     * Returns the next value in the simulation at a given location on the
     * board (NOT toroidally).
     * @arg {number} i - The "y" index. Must be an integer.
     * @arg {number} j - The "x" index. Must be an integer.
     */
    nextAt(i, j) {
        // ensure that `i` and `j` are integers within the matrix dimensions
        if (i < 0 || i >= this._rows || Math.floor(i) !== i || j < 0 || j >= this._cols || Math.floor(j) !== j) {
            throw new Error(
                `expected integers in [0, ${this._rows}) and [0, ${this._cols}],`
                + ` got: ${i}, ${j}`
            )
        }

        // current color at given coordinates
        const color = this._matrix[i][j]
        // infinitesimal change in color caused by color
        const dcColor = color
            // cross with small vector in first octant
            .cross(Color.randomComponentsBetween(0, 2))
            // subtract small decay contribution
            .minus(color.scale(this.kDecay))
            // scale by color-color coupling constant
            .scale(this.kColor)
        // infinitesimal change in color caused by space
        const dcSpace = color.scale(-4)
            .plus(this.at(i + 1, j))
            .plus(this.at(i - 1, j))
            .plus(this.at(i, j + 1))
            .plus(this.at(i, j - 1))
            // scale by color-space coupling constant
            .scale(this.kSpace)

        // return the original value...
        return color
            // shifted by total color change over infinitesimal time step
            .plus(dcColor.plus(dcSpace).scale(this.dt))
            // trimmed down to be an actual RGB color
            .trim(0, 255)
    }


    renderTo(context) {
        // dimensions of the entire canvas
        const width = context.canvas.width
        const height = context.canvas.height
        // dimensions of a single cell
        // (overestimate with ceil so that there arent empty edges of canvas)
        const cellWidth = Math.ceil(width / this._cols)
        const cellHeight = Math.ceil(height / this._rows)

        // clear the canvas
        context.clearRect(0, 0, width, height)

        this._matrix.forEach((row, i) => {
            row.forEach((color, j) => {
                // set fill style to cell's color
                context.fillStyle = color.toString()
                // fill the cell
                context.fillRect(
                    j * cellWidth,
                    i * cellHeight,
                    cellWidth,
                    cellHeight
                )
            })
        })
    }
}
