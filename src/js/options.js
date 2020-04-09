import "../css/options.css";

const baseUrl = document.getElementById('jira-api-base-url')
const apiToken = document.getElementById('jira-api-token')
const status = document.getElementById('status')

const getOptions = () => {
	chrome.storage.sync.get({
		baseUrl: '',
		apiToken: ''
	}, (options) => {
		baseUrl.value = options.baseUrl
		apiToken.value = options.apiToken
	})
}

const optionsSave = () => {
	chrome.storage.sync.set({
		baseUrl: baseUrl.value,
		apiToken: apiToken.value
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
