import { local } from 'brownies'
import { log } from './lib/logger.js'

// Import content modules
import assign from './modules/assign/assign.content'

const windowOnload = () => {
	log('content.js::windowOnload', 'Starting content')

	assign.init()
}

window.onload = windowOnload;
