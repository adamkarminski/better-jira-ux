import { debug } from '../../../lib/logger'

const element = document.getElementsByClassName('adg-throbber')[0]

function doesStyleImplyVisibility(styleAttribute) {
	return styleAttribute.indexOf('display: block') > -1
}

function observeVisibility(mutations) {
	let states
	let customEvent

	for (let i = 0; i < mutations.length; i++) {
		states = {
			wasVisible: doesStyleImplyVisibility(mutations[i].oldValue),
			isVisible: doesStyleImplyVisibility(mutations[i].target.getAttribute('style'))
		}

		if (states.wasVisible !== states.isVisible) {
			if (states.isVisible === true) {
				customEvent = new Event('JiraLoaderShown')
				debug('JiraEvents::JiraLoader::IsVisible', 'JiraLoaderShown')
			} else if (states.isVisible === false) {
				customEvent = new Event('JiraLoaderHidden')
				debug('JiraEvents::JiraLoader::IsVisible', 'JiraLoaderHidden')
			}

			window.dispatchEvent(customEvent)
		}
	}
}
const visibilityObserver = new MutationObserver(observeVisibility)

function init() {
	visibilityObserver.observe(element, {
		attributes: true,
		attributesFilter: ['style'],
		attributeOldValue: true,
	})
}

function disconnect() {
	visibilityObserver.disconnect()
}

export default {
	init,
	disconnect
}
