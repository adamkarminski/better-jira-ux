import { local } from 'brownies'
import { log } from './lib/logger.js'

// Import content modules
import assign from './modules/assign/assign.content'

const windowOnload = () => {
	assign.init()
}

window.onload = windowOnload;
