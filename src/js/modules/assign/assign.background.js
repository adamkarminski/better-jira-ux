import { jiraUsersGetAll, jiraIssueAssignUser } from '../../lib/jira-web-api'

const usersGetAll = async () => {
	let response = await jiraUsersGetAll()

	return response
}

const issueAssignUser = async (params) => {
	let accountId = params.accountId.length > 0 ? params.accountId : null
	let response = await jiraIssueAssignUser(params.issueKey, accountId)

	return response
}

export default {
	issueAssignUser,
	usersGetAll
}
