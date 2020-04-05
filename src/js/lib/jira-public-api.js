import axios from 'axios'

const jiraApi = axios.create({
	'baseURL': 'https://bethink.atlassian.net/rest/api/latest',
	'headers': {
		'Authorization': '3ZaSrOEyX88v24vAAkJt8A03',
		'Accept': 'application/json'
	}
})

async function jiraGetRequest(path, params = {}) {
	let response = await jiraApi.get(path, params)

	return response.data
}

async function jiraPutRequest(path, data) {
	let response = await jiraApi.put(path, data)

	return response.data
}

export async function jiraAssignUser(issueKey, accountId) {
	let path = `/issue/${issueKey}/assignee`
	let data = {
		'accountId': accountId
	}

	let response = await jiraPutRequest(path, data)

	return response.data
}

export async function jiraGetUsersList(params = {}) {
	let response = await jiraGetRequest('/users/search', params)

	return response
}
