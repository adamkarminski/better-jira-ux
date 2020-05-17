import { debounce } from 'lodash'

import { debug } from '../../../../lib/logger'

let targetNode

const emitEventDebounced = debounce(() => {
	debug('JiraEvents::FinishedRerender::emitEventDebounced', 'JiraIssueDetailViewFinishedRerender')

	window.dispatchEvent(new Event('JiraIssueDetailViewFinishedRerender'))
	issueChangedObserver.disconnect()
}, 1000)

function observeIssueChanged(mutations) {
	for (let i = 0; i < mutations.length; i++) {
		if (mutations[i].addedNodes.length > 0) {
			emitEventDebounced()
		}
	}
}

const issueChangedObserver = new MutationObserver(observeIssueChanged)

function onJiraUrlChanged(e) {
	debug('JiraEvents::FinishedRerender::onJiraUrlChanged', 'Setup observer')
	issueChangedObserver.observe(targetNode, {
		childList: true,
		subtree: true
	})
}

function init(element) {
	targetNode = element
	window.addEventListener('JiraUrlChanged', onJiraUrlChanged)
}

function disconnect() {
	issueChangedObserver.disconnect()
}

export default {
	init,
	disconnect
}
