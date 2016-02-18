// third party imports
import React, {Component} from 'react'
import classNames from 'classnames'
import throttle from 'lodash/throttle'
// local imports
import ColorMatrix from './ColorMatrix'
import map from 'util/map'


function getRelativeCoordinates({pageX, pageY, currentTarget}) {
    return {
        x: pageX - currentTarget.offsetLeft,
        y: pageY - currentTarget.offsetTop,
    }
}


// desired dimensions of a single color matrix cell
const targetCellWidth = 10
const targetCellHeight = 10
// single `ColorMatrix` instance used between all `Sage` components
// (dimensions will be rewritten on load, but need to start somewhere)
const colorMatrix = new ColorMatrix(90, 160)


export default class App extends Component {
    constructor(...args) {
        // instantiate `this`
        super(...args)
        // set initial state
        this.state = {
            // whether or not the simulation is paused
            isPaused: true,
            // whether or not the simulation has been clicked yet
            wasClicked: false,
            // id returned from most recent `requestAnimationFrame` call
            animationFrameID: null,
        }
        // bind instance method so it can be passed as callback
        // also throttle it so that we dont spam resize event
        this.onResize = throttle(this.onResize.bind(this), 100)
    }


    componentDidMount() {
        // add resize event handler
        window.addEventListener('resize', this.onResize)
        // determine initial dimensions
        this.onResize()

        const context = this.refs.canvas.getContext('2d')

        // render state to canvas
        colorMatrix.renderTo(context)
    }


    componentWillUnmount() {
        // cut animation loop
        this.setState({isPaused: true})
        // cancel pending animation
        window.cancelAnimationFrame(this.state.animationFrameID)
        // remove resize event handler
        window.removeEventListener('resize', this.onResize)
    }


    onResize() {
        // canvas DOM node
        const canvas = this.refs.canvas
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
        colorMatrix.renderTo(canvas.getContext('2d'))
    }


    animate() {
        const {isPaused} = this.state

        // if animation is not paused
        if (!isPaused) {
            // iterate to next state of color matrix
            colorMatrix.next()
                // and then render to the canvas
                .renderTo(this.refs.canvas.getContext('2d'))

            // keep it going
            this.setState({
                animationFrameID: window.requestAnimationFrame(
                    () => this.animate()
                ),
            })
        }
    }


    handleClick() {
        // to reference later in callback
        const wasPaused = this.state.isPaused

        // ensure paused flag is unset, then...
        this.setState(
            {
                isPaused: false,
                wasClicked: true,
            },
            () => {
                // if animation was paused at the time of the click event
                // (it wont be anymore when this is callback is executed)
                if (wasPaused) {
                    // kick off animation loop
                    this.animate()
                }
            }
        )
    }


    handleMouseMove(event) {
        const {x, y} = getRelativeCoordinates(event)
        const {innerWidth, innerHeight} = window

        colorMatrix.kColor = map(x, 0, innerWidth, 0, 1)
        colorMatrix.kSpace = map(y, 0, innerHeight, 0, 1)
    }


    togglePause() {
        // to reference later in callback
        const wasPaused = this.state.isPaused

        // flip paused state, then...
        this.setState({isPaused: !wasPaused}, () => {
            // if animation was paused at the time of the click event
            // (it wont be anymore when this is callback is executed)
            if (wasPaused) {
                // kick off animation loop
                this.animate()
            }
        })
    }


    reset() {
        colorMatrix.randomize()
    }


    render() {
        const {wasClicked, isPaused} = this.state

        return (
            <section>
                <div
                    className={classNames({
                        overlay: true,
                        clickable: isPaused,
                        fadeOut: wasClicked,
                    })}
                    onClick={this.handleClick.bind(this)}
                    onMouseMove={this.handleMouseMove.bind(this)}
                >
                    <h1>Click me?</h1>
                </div>
                <canvas ref='canvas' />
            </section>
        )
    }
}
