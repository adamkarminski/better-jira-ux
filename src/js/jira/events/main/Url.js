import { debug } from '../../../lib/logger'

function init() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.message === 'urlChanged') {
				window.dispatchEvent(new Event('JiraUrlChanged'))
				debug('JiraEvents::Url', 'JiraUrlChanged')
			}
		}
	);
}

export default {
	init
}
