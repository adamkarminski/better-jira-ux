import axios from 'axios'

import { apiOptions, areRequiredOptionsSet } from '../config'
import { debug } from './logger'

let usersMaxResults
let jiraApi
let agileApi

chrome.storage.sync.get(apiOptions, (options) => {
	debug('jira-web-api::getOptions::options', options)

	if (areRequiredOptionsSet(options)) {
		setup(options)
	}
})

chrome.storage.onChanged.addListener(listenerSetupOnStorageChanged)
function listenerSetupOnStorageChanged(changes, areaName) {
	if (areaName !== 'sync') return false

	chrome.storage.sync.get(apiOptions, (options) => {
		debug('jira-web-api::listenerSetupOnStorageChanged::options', options)

		if (areRequiredOptionsSet(options)) {
			debug('jira-web-api::listenerSetupOnStorageChanged::areRequiredOptionsSet', true)

			setup(options)
		}
	})
}

function setup(options) {
	usersMaxResults = options.usersMaxResults !== 0 ? options.usersMaxResults : 150

	jiraApi = axios.create({
		'baseURL': `${options.baseUrl.replace(/\/$/, "")}/rest/api/latest`,
		'headers': {
			'Authorization': options.apiToken,
			'Accept': 'application/json'
		}
	})

	agileApi = axios.create({
		'baseURL': `${options.baseUrl.replace(/\/$/, "")}/rest/agile/1.0`,
		'headers': {
			'Authorization': options.apiToken,
			'Accept': 'application/json'
		}
	})
}

async function jiraGetRequest(path, params = {}) {
	debug('jira-web-api::jiraGetRequest::params', params)

	let response = await jiraApi.get(path, {
		'params': params
	})

	return response
}

async function jiraPutRequest(path, data) {
	let response = await jiraApi.put(path, data)

	return response
}

async function agilePostRequest(path, data) {
	let response = await agileApi.post(path, data)

	return response
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

	return response.data
}

export async function jiraSprintSwap(sprintId, sprintToSwapWith) {
	let response = await agilePostRequest(`/sprint/${sprintId}/swap`, { sprintToSwapWith })

	return response
}
