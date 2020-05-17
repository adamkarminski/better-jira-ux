import { debug } from '../../../../lib/logger'

function doesStyleImplyVisibility(styleAttribute) {
	return styleAttribute === null || styleAttribute.indexOf('display: none') === -1
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
				customEvent = new Event('JiraIssueDetailViewShown')
				debug('JiraEvents::JiraIssueDetailView::IsVisible', 'JiraIssueDetailViewShown')
			} else if (states.isVisible === false) {
				customEvent = new Event('JiraIssueDetailViewHidden')
				debug('JiraEvents::JiraIssueDetailView::IsVisible', 'JiraIssueDetailViewHidden')
			}

			window.dispatchEvent(customEvent)
		}
	}
}

const visibilityObserver = new MutationObserver(observeVisibility)

function init(element) {
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
