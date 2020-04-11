import axios from 'axios'

import { debug } from './logger'

let usersMaxResults
let jiraApi

chrome.storage.sync.get(['baseUrl', 'apiToken', 'usersMaxResults'], (options) => {
	debug('jira-web-api::getOptions', options)

	usersMaxResults = options.usersMaxResults !== 0 ? options.usersMaxResults : 150

	jiraApi = axios.create({
		'baseURL': `${options.baseUrl.replace(/\/$/, "")}/rest/api/latest`,
		'headers': {
			'Authorization': options.apiToken,
			'Accept': 'application/json'
		}
	})
})

async function jiraGetRequest(path, params = {}) {
	debug('jira-web-api::jiraGetRequest::params', params)

	let response = await jiraApi.get(path, {
		'params': params
	})

	return response.data
}

async function jiraPutRequest(path, data) {
	let response = await jiraApi.put(path, data)

	return response.data
}

export async function jiraIssueAssignUser(issueKey, accountId) {
	let path = `/issue/${issueKey}/assignee`
	let data = {
		'accountId': accountId
	}

	let response = await jiraPutRequest(path, data)

	return response.data
}

export async function jiraUsersGetAll() {
	let response = await jiraGetRequest('/users/search', { maxResults: usersMaxResults })

	return response
}
