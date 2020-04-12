import { toNumber } from 'lodash'

import "../css/options.css";

import { debug } from './lib/logger'

const baseUrl = document.getElementById('jira-api-base-url')
const apiToken = document.getElementById('jira-api-token')
const usersMaxResults = document.getElementById('jira-users-max-results')

const form = document.getElementById('options-form')
const submit = document.getElementById('submit')
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

const optionsSave = (e) => {
	debug('options::optionsSave', e)

	e.preventDefault()

	if (!submit.hasAttribute('data-submitable')) return false

	chrome.storage.sync.set({
		baseUrl: baseUrl.value,
		apiToken: apiToken.value,
		usersMaxResults: toNumber(usersMaxResults.value)
	}, () => {
		submit.value = 'Saved!'
		submit.className = "button is-success is-active"
		submit.removeAttribute('data-submitable')

		setTimeout(() => {
			submit.value = 'Save'
			submit.className = "button is-link"
			submit.setAttribute('data-submitable', true)
		}, 1500)
	})
}

const bindOptionsSaveOnSubmit = () => {
	debug('options::bindOptionsSaveOnSubmit')

	form.addEventListener('submit', optionsSave)
}

const setup = () => {
	getOptions()
	bindOptionsSaveOnSubmit()
}

window.onload = setup
