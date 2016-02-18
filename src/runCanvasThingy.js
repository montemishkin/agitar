// third party imports
import throttle from 'lodash/throttle'
// local imports
import ColorMatrix from 'util/ColorMatrix'
import map from 'util/map'


// desired dimensions of a single color matrix cell
const targetCellWidth = 10
const targetCellHeight = 10
// single `ColorMatrix` instance used between all `Sage` components
// (dimensions will be rewritten on load, but need to start somewhere)
const colorMatrix = new ColorMatrix(90, 160)


export default canvas => {
    const context = canvas.getContext('2d')

    addEventHandlers(canvas, context)

    animate(context)

}


function animate(context) {
    // iterate to next state of color matrix
    colorMatrix.next()
        // and then render to canvas
        .renderTo(context)

    requestAnimationFrame(() => animate(context))
}


function addEventHandlers(canvas, context) {
    canvas.addEventListener('mousemove', (event) => {
        const {x, y} = getRelativeCoordinates(event)
        const {innerWidth, innerHeight} = window

        colorMatrix.kColor = map(x, 0, innerWidth, 0, 1)
        colorMatrix.kSpace = map(y, 0, innerHeight, 0, 1)
    })

    const throttledOnResize = throttle(() => onResize(canvas, context), 100)

    window.addEventListener('resize', throttledOnResize)
    throttledOnResize()
}


function onResize(canvas, context) {
    // window dimensions
    const {innerWidth, innerHeight} = window

    // set canvas dimensions to window dimensions
    canvas.width = innerWidth
    canvas.height = innerHeight
    // set matrix dimensions based on window dimensions and
    // desired cell dimensions (overestimate with ceil to avoid
    // empty edges of canvas)
    colorMatrix.rows = Math.ceil(innerHeight / targetCellHeight)
    colorMatrix.cols = Math.ceil(innerWidth / targetCellWidth)

    // rerender to canvas
    colorMatrix.renderTo(context)
}


function getRelativeCoordinates({pageX, pageY, currentTarget}) {
    return {
        x: pageX - currentTarget.offsetLeft,
        y: pageY - currentTarget.offsetTop,
    }
}
