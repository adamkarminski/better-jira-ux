import { debug } from '../../../lib/logger'

import { issueAssignUser } from '../../../lib/jira-background-api'
import { getIssue, getSelectedIssueKeyFromUrl } from '../../../jira/components/Issue'
import { setIssueAvatarToLoading, setIssueAvatarToUnassigned } from '../../../jira/components/issue/Avatar'

function isKeyPressedInEditableElement(e) {
	let editableElements = ['input', 'textarea']

	return editableElements.indexOf(e.target.tagName.toLowerCase()) > -1 || e.target.isContentEditable
}

async function listenerUnassignCurrentIssueOnKeyDown(e) {
	let issueKey = getSelectedIssueKeyFromUrl()
	// TODO: This breaks for a single issue view - let's fix it!
	let issue = getIssue(issueKey)

	debug('unassignShortcut::listenerUnassignCurrentIssueOnKeyDown::event', e)

	if (e.key === 'u' && issueKey !== false && !isKeyPressedInEditableElement(e)) {
		debug('unassignShortcut::listenerUnassignCurrentIssueOnKeyDown::issueKey', issueKey)

		setIssueAvatarToLoading(issue)

		await issueAssignUser(issueKey, '')

		setIssueAvatarToUnassigned(issue)
	}
}

function bindUnassignCurrentIssueOnKeyDown() {
	document.addEventListener('keydown', listenerUnassignCurrentIssueOnKeyDown)
}

const init = () => {
	bindUnassignCurrentIssueOnKeyDown()
}

export default {
	init
}
