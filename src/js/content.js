import { requiredOptions, areRequiredOptionsSet, doesLocationHrefMatchBaseUrl } from './config'
import { debug } from './lib/logger.js'

import JiraEvents from './jira/events/jira-events'
import Modules from './modules/modules'

const windowOnload = () => {
	debug('content.js::windowOnload', 'Starting content')

	chrome.storage.sync.get(requiredOptions, (options) => {
		if (!areRequiredOptionsSet(options) || !doesLocationHrefMatchBaseUrl(options.baseUrl)) {
			return false
		}

		JiraEvents.init()
		Modules.init()
	})
}

window.onload = windowOnload;
