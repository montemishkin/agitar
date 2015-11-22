// third party imports
import {combineReducers} from 'redux'
import {createResponsiveStateReducer} from 'redux-responsive'


function noopReducer(state = {}) {
    return state
}


// combine and export the reducers
export default combineReducers({
    browser: createResponsiveStateReducer({medium: 700}),
    posts: noopReducer,
    projects: noopReducer,
    tags: noopReducer,
})
