import '../img/icon-128.png'
import '../img/icon-34.png'

import axios from 'axios'
import { local } from 'brownies'

const init = () => {
	console.log('BJU - Initializing background')

	const jiraApi = axios.create({
		'baseURL': 'https://bethink.atlassian.net/rest/api/latest',
		'headers': {
			'Authorization': '3ZaSrOEyX88v24vAAkJt8A03',
			'Accept': 'application/json'
		}
	})

	async function jiraGetRequest (path) {
		let response = await jiraApi.get(path)

		return response.data
	}

	async function jiraPutRequest (path, data) {
		let response = await jiraApi.put(path, data)

		return response.data
	}

	async function assignUser (issueKey, accountId) {
		let path = `/issue/${issueKey}/assignee`
		let data = { 'accountId': accountId }

		jiraPutRequest(path, data).then((responseData) => {
			alert('Done!')
		})
	}

	async function getUsersList () {
		let response = await jiraGetRequest('/users')

		return response
	}

	const actionsMap = {
		'getJiraUsers': getUsersList,
	}

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		// var msg = JSON.parse(request, sender, sendResponse)
		// console.log('BJU - Assigning user')
		// assignUser(msg.values.issueId, '5a7347602aa9952cbfa55a7b')
		console.log('BJU - actionsMap', actionsMap)

		if (!('action' in request)) {
			console.log(`BJU - onMessage - addListener - Bad request - No action specified`, request)
			return false;
		}

		if (!(request.action in actionsMap)) {
			console.log(`BJU - onMessage - addListener - Unknown action`, request)
			return false;
		}

		console.log('BJU - action chosen', actionsMap[request.action])

		actionsMap[request.action]().then((response) => {
			console.log('BJU - Sending response', response)
			sendResponse(response)
		})

		return true;
	})
}

init()
