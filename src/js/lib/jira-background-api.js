import { sendMessage } from './communication'

// TODO: Think about the role of this file. Maybe create a more permanent connection between modules and messages?
// IDEA: there should be a module `users` responsible for operations on the users endpoint.

export async function usersGetAll() {
	let usersList = await sendMessage({
		'module': 'assign',
		'action': 'usersGetAll'
	})

	return usersList
}

export async function issueAssignUser(issueKey, accountId) {
	await sendMessage(
		{
			'module': 'assign',
			'action': 'issueAssignUser',
			'params': {
				'issueKey': issueKey,
				'accountId': accountId,
			},
		}
	)
}
