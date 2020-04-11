import "../css/popup.css";

import { requiredOptions, areRequiredOptionsSet } from './config'

const popupMessageElement = document.getElementById('popup-message')

function verifyRequiredOptions() {
	chrome.storage.sync.get(requiredOptions, (options) => {
		if (!areRequiredOptionsSet(options)) {
			displaySetupInfo()
		} else {
			displayFinishedInfo()
		}
	})
}

function displaySetupInfo() {
	popupMessageElement.textContent = `Please go to the extension's options page and provide information required
		to fix your Jira's UX. 🚀`
	showPopupMessage()
}

function displayFinishedInfo() {
	popupMessageElement.textContent = `All required options set! Enjoy the new UX of your Jira! ❤️`
	showPopupMessage()
}

function showPopupMessage() {
	popupMessageElement.setAttribute('style', 'display: block;')
}

function hidePopupMessage() {
	popupMessageElement.setAttribute('style', 'display: none;')
}

function listenerOpenOptionsOnClick(e) {
	e.preventDefault()
	chrome.tabs.create({'url': '/options.html'})
}

function bindOpenOptionsOnClick() {
	document.getElementById('open-options-link').addEventListener('click', listenerOpenOptionsOnClick)
}

const init = () => {
	verifyRequiredOptions()
	bindOpenOptionsOnClick()
}

window.onload = init
