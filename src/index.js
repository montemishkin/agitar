// fix browser land
import 'babel-core/polyfill'
// third party imports
import React from 'react'
import ReactDOM from 'react-dom'
// local imports
import App from './views/App'


ReactDOM.render(
    <App />,
    document.getElementById('app')
)
