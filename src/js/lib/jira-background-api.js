import { local } from 'brownies'
import { sendMessage } from './communication'

// TODO: Think about the role of this file. Maybe create a more permanent connection between modules and messages?
// IDEA: there should be a module `users` responsible for operations on the users endpoint.

export async function jiraUsersGetAll() {
	if (local.jiraUsers === null) {
		let usersList = await sendMessage({
			'module': 'assign',
			'action': 'getJiraUsers'
		})

		local.jiraUsers = usersList

		return usersList
	}

	return local.jiraUsers
}

export async function jiraIssueAssignUser(issueKey, accountId) {
	await sendMessage(
		{
			'module': 'assign',
			"action": "assignUser",
			'params': {
				'issueKey': issueKey,
				'accountId': accountId,
			},
		}
	)
}
