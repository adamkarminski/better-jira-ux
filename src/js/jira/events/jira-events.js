// TODO: This whole thing should definitely use Classes Composition

import { debug } from '../../lib/logger'
import { getCurrentPageType } from '../components/Page'

import Url from './main/Url'
import Page from './main/Page'

import Backlog from './pages/Backlog'
let pagesMap = {
	backlog: Backlog,
}
let currentPageType

function initPageEvents() {
	currentPageType = getCurrentPageType()

	if (pagesMap.hasOwnProperty(currentPageType)) {
		pagesMap[currentPageType].init()
		debug('JiraEvents::initPageEvents', `Page '${currentPageType}' initiated.`)
	} else {
		debug('JiraEvents::initPageEvents', `Page '${currentPageType}' unknown, skipped.`)
	}
}

function disconnectPageEvents() {
	if (pagesMap.hasOwnProperty(currentPageType)) {
		pagesMap[currentPageType].disconnect()
		debug('JiraEvents::disconnectPageEvents', `Page '${currentPageType}' disconnected.`)
	} else {
		debug('JiraEvents::disconnectPageEvents', `Page '${currentPageType}' unknown, skipped.`)
	}
}

function onJiraUrlChanged() {
	if (currentPageType !== getCurrentPageType()) {
		disconnectPageEvents()
		initPageEvents()
	}
}

function init() {
	Url.init()
	Page.init()

	initPageEvents()
	window.addEventListener('JiraUrlChanged', onJiraUrlChanged)
}

export default {
	init
}
