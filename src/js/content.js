import { local } from 'brownies'
import { debug } from './lib/logger.js'

// Import modules
import assign from './modules/assign/assign.content'

const windowOnload = () => {
	debug('content.js::windowOnload', 'Starting content')

	assign.init()
}

// chrome.runtime.connect({name: 'content'})

window.onload = windowOnload;
