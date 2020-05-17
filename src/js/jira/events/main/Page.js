import { debounce } from 'lodash'

import { debug } from '../../../lib/logger'
import { getCurrentPageType } from '../../components/Page'

let currentPageType
let targetNode

const emitEventDebounced = debounce(() => {
	debug('JiraEvents::JiraPage::emitEventDebounced', 'JiraPageFinishedRender')

	window.dispatchEvent(new Event('JiraPageFinishedRender'))
	finishedRenderObserver.disconnect()
}, 1000)

function observeFinishedRender(mutations) {
	for (let i = 0; i < mutations.length; i++) {
		if (mutations[i].addedNodes.length > 0) {
			emitEventDebounced()
		}
	}
}

const finishedRenderObserver = new MutationObserver(observeFinishedRender)

function onJiraUrlChanged(e) {
	// TODO: JiraPageChanged should be a separate event
	let newPage = getCurrentPageType()

	debug('JiraEvents::JiraPage::onJiraUrlChanged::pages', {currentPageType, newPage})
	if (currentPageType !== newPage) {
		debug('JiraEvents::JiraPage::onJiraUrlChanged', 'Setup observer')
		currentPageType = newPage
		finishedRenderObserver.observe(targetNode, {
			childList: true,
			subtree: true
		})
	}
}

function init(element) {
	currentPageType = getCurrentPageType()
	targetNode = document.getElementsByTagName('body')[0]
	window.addEventListener('JiraUrlChanged', onJiraUrlChanged)
}

export default {
	init
}
