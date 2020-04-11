import { toNumber } from 'lodash'

import "../css/options.css";

const baseUrl = document.getElementById('jira-api-base-url')
const apiToken = document.getElementById('jira-api-token')
const usersMaxResults = document.getElementById('jira-users-max-results')
const status = document.getElementById('status')

const getOptions = () => {
	chrome.storage.sync.get({
		baseUrl: '',
		apiToken: '',
		usersMaxResults: 150
	}, (options) => {
		baseUrl.value = options.baseUrl
		apiToken.value = options.apiToken
		usersMaxResults.value = toNumber(options.usersMaxResults)
	})
}

const optionsSave = () => {
	chrome.storage.sync.set({
		baseUrl: baseUrl.value,
		apiToken: apiToken.value,
		usersMaxResults: toNumber(usersMaxResults.value)
	}, () => {
		status.textContent = 'Saved successfully!'

		setTimeout(() => {
			status.innerHTML = '&nbsp;'
		}, 1500)
	})
}

const bindOptionsSaveOnSubmitClick = () => {
	document.getElementById('submit').addEventListener('click', optionsSave)
}

const setup = () => {
	getOptions()
	bindOptionsSaveOnSubmitClick()
}

window.onload = setup
