import { jiraUsersGetAll, jiraIssueAssignUser } from '../../lib/jira-public-api'

const issueAssignUser = async (params) => {
	let accountId = params.accountId.length > 0 ? params.accountId : null
	let response = await jiraIssueAssignUser(params.issueKey, accountId)

	return response
}

const usersGetAll = async () => {
	let params = {
		maxResults: 150,
	}

	let response = await jiraUsersGetAll('/users/search', params)

	return response
}

export default {
	issueAssignUser,
	usersGetAll
}
