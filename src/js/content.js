import { requiredOptions, areRequiredOptionsSet, doesLocationHrefMatchBaseUrl } from './config'
import { debug } from './lib/logger.js'

// Import modules
import assign from './modules/assign/assign.content'

const onLoaderMutation = (mutations) => {
	debug('content.js::onLoaderMutation', {mutations})

	if (mutations[0].oldValue === 'display: block;') {
		debug('content.js::onLoaderMutation', 'Reiniting')

		assign.init()
	}
}
const loaderObserver = new MutationObserver(onLoaderMutation)
const loaderElement = document.getElementsByClassName('adg-throbber')[0]

const windowOnload = () => {
	debug('content.js::windowOnload', 'Starting content')

	chrome.storage.sync.get(requiredOptions, (options) => {
		if (!areRequiredOptionsSet(options) || !doesLocationHrefMatchBaseUrl(options.baseUrl)) {
			return false
		}

		debug('content.js::windowOnload', 'Initing modules.')
		assign.init()

		loaderObserver.observe(loaderElement, {
			attributes: true,
			attributeFilter: ['style'],
			attributeOldValue: true
		})
	})
}

window.onload = windowOnload;
