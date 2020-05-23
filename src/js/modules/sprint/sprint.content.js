import { debug } from '../../lib/logger'
import { findElementByClassName } from '../../lib/dom'

import { getCurrentPageType } from '../../jira/components/Page'
import { sprintSwap } from '../../lib/jira-background-api'

function isCurrentPageSupported() {
	const supportedPages = ['backlog']
	return supportedPages.indexOf(getCurrentPageType()) > -1
}

function isSendSprintTopLinkInDOM(sprintId) {
	return document.querySelector(`.gh-sprint-move-to-top[data-sprint-id="${sprintId}"]`) !== null
}

function scrollToTopSprint() {
	let top = document.querySelector('.ghx-sprint-planned').offsetTop - 100

	document.getElementById('ghx-backlog').scroll({ top, left: 0, behavior: 'smooth' })
}

function getSendSprintToTopActionHTML(sprintId) {
	return `
		<ul class="aui-list-section">
			<li class="aui-list-item">
				<a href="/rest/agile/1.0/sprint/${sprintId}/swap" data-sprint-id="${sprintId}"
					class="aui-list-item-link js-sprint-action gh-sprint-move-to-top">Move sprint to top</a>
			</li>
		</ul>
	`
}

function getSprintIdFromEvent(e) {
	let target = e.target

	if (!target.hasAttribute('data-sprint-id')) {
		target = target.closest('[data-sprint-id]')
	}

	return target.getAttribute('data-sprint-id')
}

async function sendSprintToTop(e) {
	e.preventDefault()
	e.stopPropagation()

	let sprintId = getSprintIdFromEvent(e)
	let container = document.getElementsByClassName('ghx-sprint-group')[0]
	let topSprint = container.getElementsByClassName('ghx-sprint-planned')[0]
	let topSprintId = topSprint.getAttribute('data-sprint-id')

	let response = await sprintSwap(sprintId, topSprintId)

	if (response.status === 204) {
		let sprint = container.querySelector(`[data-sprint-id="${sprintId}"]`)
		topSprint.before(sprint)

		e.target.closest('.ajs-layer').style.display = 'none'
		document.querySelector('.js-sprint-actions-trigger.active').classList.remove('active')
		scrollToTopSprint()
	}
}

function injectSendSprintToTopLink(e) {
	let sprintId = getSprintIdFromEvent(e)

	if (!isSendSprintTopLinkInDOM(sprintId)) {
		let actionsList = document
			.querySelector(`.js-sprint-action[data-sprint-id="${sprintId}"]`)
			.closest('.js-sprint-actions-list')

		actionsList.innerHTML = getSendSprintToTopActionHTML(sprintId) + actionsList.innerHTML

		actionsList.querySelector('.gh-sprint-move-to-top').addEventListener('click', sendSprintToTop)
	}
}

function isPlannedSprintActionsTriggerClicked(e) {
	let trigger = findElementByClassName(e.path, 'js-sprint-actions-trigger')

	debug('isPlannedSprintActionsTriggerClicked::trigger', trigger)

	if (trigger === false) return false

	debug('isPlannedSprintActionsTriggerClicked', trigger.className.indexOf('active') > -1 &&
		findElementByClassName(e.path, 'ghx-sprint-planned') !== false)

	return trigger.className.indexOf('active') > -1 &&
		findElementByClassName(e.path, 'ghx-sprint-planned') !== false
}

function injectActionWhenListIsAdded(mutations, observer) {
	for (let i = 0; i < mutations.length; i++) {
		if (mutations[i].addedNodes.length > 0 && findElementByClassName(mutations[i].addedNodes, 'ajs-layer')) {
			injectSendSprintToTopLink(this)
			observer.disconnect()
		}
	}
}

function setObserverIfActionsTriggerClicked(e) {
	if (isPlannedSprintActionsTriggerClicked(e)) {
		let observer = new MutationObserver(injectActionWhenListIsAdded.bind(e))
		observer.observe(document.getElementsByTagName('body')[0], { childList: true })
	}
}

function bindInjectActionOnclick() {
	let container = document.getElementsByClassName('ghx-sprint-group')[0]
	container.removeEventListener('click', setObserverIfActionsTriggerClicked)
	container.addEventListener('click', setObserverIfActionsTriggerClicked)
}

async function init() {
	debug('sprint.content::init', 'Initiating sprint module.')
	if (!isCurrentPageSupported()) return false

	await bindInjectActionOnclick()

	window.addEventListener('JiraLoaderHidden', bindInjectActionOnclick)
}

export default { init }
