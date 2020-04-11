import { debug } from '../../../lib/logger'

import { issueAssignUser } from '../../../lib/jira-background-api'
import { getIssue, getSelectedIssueKeyFromUrl } from '../../../jira/components/Issue'
import { setIssueAvatarToLoading, setIssueAvatarToUnassigned } from '../../../jira/components/issue/Avatar'

async function listenerUnassignCurrentIssueOnKeyDown(e) {
	let issueKey = getSelectedIssueKeyFromUrl()
	let issue = getIssue(issueKey)

	if (e.key === 'u' && issueKey !== false) {
		setIssueAvatarToLoading(issue)
		debug('unassignShortcut::listenerUnassignCurrentIssueOnKeyDown::issueKey', issueKey)

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
