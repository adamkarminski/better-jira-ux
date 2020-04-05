import { log } from '../../lib/logger'

import config from './assign.config'

/**
 * What the module does:
 * 1. Create unassigned avatars
 * 1.1 Then bind click events to open the modal
 * 2. Create a modal with usersList
 * 2.1 Bind events sending assign requests
 * 2.2 Bind events filtering the usersList
 */

 /**
  * Globally used entities
  */

const issuesContainer
const context
const unassignedAvatarHtml = {
	'backlog': `
		<img src="${config.avatars.unassignedUrl}" class="ghx-avatar-img" data-tooltip="Unassigned">
	`,
	'board': `
		<span class="ghx-field">
			<img src="${config.avatars.unassignedUrl}" class="ghx-avatar-img" data-tooltip="Unassigned">
		</span>
	`
}

/**
 * 1. Create unassigned avatars
 */

function checkContext() {
	if (window.location.indexOf('planning') > -1) {
		return 'backlog'
	}
	else if (window.location.indexOf('RapidBoard') > -1) {
		return 'board'
	}
	else if (window.location.indexOf('browse') > -1) {
		return 'issue'
	}

	return false
}

function injectUnassignedAvatarHtml(context, element) {
	if (element.innerHTML.indexOf(config.avatars.avatarClass) === -1) {
		element.innerHTML = unassignedAvatarHTML[context] + element.innerHTML
	}
}

function setupUnassignedAvatars() {
	issuesContainer
		.querySelectorAll(config.avatars[context].avatarContainerSelector)
		.forEach(element => {
			injectUnassignedAvatarHtml(context, element)
		})
}

function findElementByClassName(elementsList, className) {
	console.log('BJU - findElementByClassName')
	console.log(className)
	console.log(elementsList)

	for (let i = 0; i < elementsList.length; i++) {
		console.log(elementsList[i].className)
		if (elementsList[i].className.indexOf(className) > -1) {
			return elementsList[i]
		}
	}

	return false;
}

function sendMessage(params) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(params, (response) => {
			resolve(response)
		})
	})
}

async function getJiraUsers() {
	console.log(`BJU - getJiraUsers - typeof jiraUsers - ${local.jiraUsers}`)
	if (local.jiraUsers === null) {
		console.log(`BJU - getJiraUsers - sending message...`)

		let usersList = await sendMessage({ "action": "getJiraUsers" })

		console.log(`BJU - getJiraUsers - Received list - ${usersList}`)

		local.jiraUsers = usersList

		return usersList
	}

	console.log(`BJU - getJiraUsers - List found Local storage...`)
	return local.jiraUsers
}

async function assignUser(issueKey, accountId) {
	chrome.runtime.sendMessage(
		{
			"action": "assignUser",
			"params": {
				"issueKey": issueKey,
				"accountId": accountId,
			},
		}
	)
}

async function createUsersDropdown() {
	console.log('BJU - createUsersDropdown')
	let node = document.createElement('div')
	let html = ''
	let usersList = await getJiraUsers()
	let activeUsers = usersList.filter(
		user => user.accountType === 'atlassian' && user.active
	)

	activeUsers.unshift({
		'accountId': '',
		'avatarUrls': {
			'32x32': unassignedAvatarURL
		},
		'displayName': 'Unassigned',
	})

	activeUsers.forEach(user => {
		let listItem = `
			<div class="usersDropdownItem" data-accountId="${user.accountId}">
				<img class="usersDropdownImage" src="${user.avatarUrls['32x32']}">
				<span class="usersDropdownText">${user.displayName}</span>
			</div>
		`
		html += listItem
	})

	node.innerHTML = `
		<div id="usersDropdown" class="usersDropdown" data-issueKey="">
			<div class="usersDropdownControls">
				<input type="text" class="usersDropdownFilter">
				<span class="usersDropdownRefresh">♻️</span>
			</div>
			${html}
		</div>
	`

	document.getElementsByTagName('body')[0].appendChild(node)

	let dropdown = document.getElementById('usersDropdown')

	dropdown.querySelectorAll('.usersDropdownItem').forEach((element) => {
		element.addEventListener('click', (e) => {
			console.log(e)
			console.log(e.path)

			let itemElement = findElementByClassName(e.path, 'usersDropdownItem')
			if (itemElement === false) {
				console.log('No element found')
				return
			}

			console.log(itemElement)

			let dropdown = itemElement.parentElement
			let image = itemElement.getElementsByClassName('usersDropdownImage')[0]
			let accountId = itemElement.getAttribute('data-accountId')
			let issueKey = dropdown.getAttribute('data-issueKey')

			console.log({
				'accountId': accountId,
				'issueKey': issueKey,
			})

			assignUser(issueKey, accountId).then((response) => {
				let activeIssue = issuesContainer
					.querySelectorAll(`div.js-issue[data-issue-key=${issueKey}]`)[0]
				let activeIssueAvatar = activeIssue.getElementsByClassName('ghx-avatar-img')[0]

				document.getElementById('usersDropdown').setAttribute(
					'style', 'display: none;'
				)

				activeIssueAvatar.setAttribute('style', '')
				activeIssueAvatar.setAttribute('src', image.getAttribute('src'))
			})
		})
	})

	document.addEventListener('click', (e) => {
		if (e.target.className.indexOf('usersDropdown') === -1) {
			document.getElementById('usersDropdown').setAttribute(
				'style', 'display: none;'
			)
		}
	})

	return
}

function bindAssignOnClick() {
	issuesContainer
		.querySelectorAll('img.ghx-avatar-img')
		.forEach(element => {
			if (element.getAttribute('listener') !== 'true') {
				element.addEventListener('click', (e) => {
					e.preventDefault()
					e.stopPropagation()

					let parent = e.target.parentElement
					let issueKey = parent.getElementsByClassName('ghx-key')[0].innerText
					let dropdown = document.getElementById('usersDropdown')

					dropdown.setAttribute('data-issueKey', issueKey)
					dropdown.setAttribute('style',
					`display: inherit; top: ${e.clientY}px; left: ${e.clientX-150}px;`)
				}, true)

				element.setAttribute('listener', 'true')
			}
		})
}

const init = async (resolve, reject) => {
	log('assign::init', 'Initiating assign module.')

	context = checkContext()

	if(context === false) {
		log('assign::init', 'Assigned does not work in this context. Init aborted.')
		return false
	}

	issuesContainer = document.getElementById(config.avatars[context].id)

	await createUsersDropdown()
	bindAssignOnClick()
}

export default {
	init: init
}
