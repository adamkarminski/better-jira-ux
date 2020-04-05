import { local } from 'brownies'
import { sendMessage } from './communication'

export async function jiraUsersGetAll() {
	if (local.jiraUsers === null) {
		let usersList = await sendMessage({ "action": "getJiraUsers" })

		local.jiraUsers = usersList

		return usersList
	}

	return local.jiraUsers
}

export async function jiraIssueAssignUser(issueKey, accountId) {
	await sendMessage(
		{
			"action": "assignUser",
			"params": {
				"issueKey": issueKey,
				"accountId": accountId,
			},
		}
	)
}
