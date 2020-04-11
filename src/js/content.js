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

	assign.init()

	loaderObserver.observe(loaderElement, {
		attributes: true,
		attributeFilter: ['style'],
		attributeOldValue: true
	})
}

window.onload = windowOnload;
