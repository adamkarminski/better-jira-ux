import { debug } from '../../lib/logger'

import { getCurrentPageType } from '../../jira/components/Page'

import unassignedAvatar from './components/unassignedAvatar'
import unassignShortcut from './components/unassignShortcut'
import assignDropdown from './components/assignDropdown'

function isCurrentPageSupported() {
	const supportedPages = ['backlog', 'board', 'issue']
	return supportedPages.indexOf(getCurrentPageType()) > -1
}

async function onJiraPageFinishedRender(e) {
	if (!isCurrentPageSupported()) return false

	await unassignedAvatar.rebind()
	assignDropdown.rebind()
}

async function onJiraLoaderHidden(e) {
	if (!isCurrentPageSupported()) return false

	await unassignedAvatar.rebind()
	assignDropdown.rebind()
}

async function onJiraIssueDetailViewFinishedRerender(e) {
	if (!isCurrentPageSupported()) return false

	await unassignedAvatar.rebind({skipIssues: true})
	assignDropdown.rebind()
}

const init = async () => {
	debug('assign::init', 'Initiating assign module.')
	if (!isCurrentPageSupported()) return false

	debug('assign::init', 'Loading components.')
	await unassignedAvatar.init()
	assignDropdown.init()
	unassignShortcut.init()

	debug('assign::init', 'Binding to JIRA events.')
	window.addEventListener('JiraPageFinishedRender', onJiraPageFinishedRender)
	window.addEventListener('JiraLoaderHidden', onJiraLoaderHidden)
	window.addEventListener('JiraIssueDetailViewFinishedRerender', onJiraIssueDetailViewFinishedRerender)
}

export default {
	init: init
}
