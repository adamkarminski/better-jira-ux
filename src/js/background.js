import '../img/icon-128.png'
import '../img/icon-34.png'

import axios from 'axios'
import { local } from 'brownies'

import { debug } from './lib/logger'

import assign from './modules/assign/assign.background'

const modules = {
	assign
}

function processMessage(request, sender, sendResponse) {
	debug('background.js::processMessage', {modules})
	debug('background.js::processMessage', {request, sender, sendResponse})

	if (!('module' in request) || !('action' in request)) {
		// Throw error - Bad request
		debug('background.js::processMessage', 'Bad request')
		return false;
	}

	if (!(request.module in modules)) {
		// Throw error - Missing module
		debug('background.js::processMessage', 'Missing module')
		return false;
	}

	if (!(request.action in modules[request.module])) {
		// Throw error - Unprocessable entity
		debug('background.js::processMessage', 'Unprocessable entity')
		return false
	}

	let params = ('params' in request) ? request.params : null
	let response = modules[request.module][request.action](params)

	sendResponse(response)
}

function init() {
	debug('background.js::init', 'Initializing background scripts')

	chrome.runtime.onMessage.addListener(processMessage)
}

init();
