// third party imports
import {createStore as create_store} from 'redux'
import {addResponsiveHandlers} from 'redux-responsive'
// local imports
import reducer from './reducer'


// create a store out of the reducer and some initial data
export function createStore(initialData) {
    // pass the initial data to the store factory
    // also, add the handlers for responsive state updates
    return addResponsiveHandlers(create_store(reducer, initialData))
}


// export a store with no initial data
export default createStore()
