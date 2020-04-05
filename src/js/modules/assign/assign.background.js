import { jiraGetUsersList, jiraAssignUser } from '../../lib/jira-public-api'

const assignUser = async (params) => {
	let accountId = params.accountId.length > 0 ? params.accountId : null
	let response = await jiraAssignUser(params.issueKey, accountId)

	return response
}

const getUsersList = async () => {
	let params = {
		maxResults: 150,
	}

	let response = await jiraGetUsersList('/users/search', params)

	return response
}

export default {
	assignUser,
	getUsersList
}
