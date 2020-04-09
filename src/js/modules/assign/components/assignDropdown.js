import { local } from 'brownies'

import { debug } from '../../../lib/logger'
import { usersGetAll, issueAssignUser } from '../../../lib/jira-background-api'
import { findElementByClassName } from '../../../lib/dom'
import config from '../assign.config'

let context
let dropdown

/**
 * Table of contents
 * 1. Setup
 * 2. Dropdown behavior
 * 3. User list behavior
 * 4. Issues list behavior
 * 5. Listeners and binders
 * 6. Init and export
 */

/**
 * 1. Setup
 */

async function setup(providedContext) {
	context = providedContext

	await setupUsersDropdown()
}

function setupUsersDropdown() {
	dropdown = document.getElementById('usersDropdown')

	if (dropdown !== null) {
		return true
	}

	let virtualDropdown = document.createElement('div')

	virtualDropdown.setAttribute('id', 'usersDropdown')
	virtualDropdown.setAttribute('class', 'usersDropdown')
	virtualDropdown.setAttribute('data-issue-key', '')

	virtualDropdown.innerHTML = `
		<div class="usersDropdownControls">
			<input type="text" class="usersDropdownSearch" placeholder="Type to filter...">
			<span class="usersDropdownRefresh">♻️</span>
		</div>
		<div id="usersDropdownList" class="usersDropdownList">
		</div>
	`

	dropdown = document.getElementsByTagName('body')[0].appendChild(virtualDropdown)
}

/**
 * 2. Dropdown behavior
 */

 function showDropdown(issueKey, left, top) {
	let searchElement = dropdown.getElementsByClassName('usersDropdownSearch')[0]

 	dropdown.setAttribute('data-issue-key', issueKey)
 	dropdown.setAttribute('style', `display: inherit; left: ${left}px; top: ${top}px;`)

	searchElement.focus()
	searchElement.select()
 }

 function hideDropdown() {
 	dropdown.setAttribute('style', 'display: none;')
 }

 /**
  * 3. User list behavior
  */

async function renderUsersList(filterText) {
	let usersList = await usersGetAll()
	let filteredList = filterUsersList(usersList, filterText)

	debug('assignDropdown.js::renderUsersList', filteredList)

	await injectUsersList(filteredList)
	bindAssignOnClick()
}

async function searchUsersList(searchText) {
	renderUsersList(searchText)
}

function refreshUsersList() {
	// TODO: Move cache handling to the component
	delete local.jiraUsers

	renderUsersList('')
}

function injectUsersList(list) {
	let html = ''
	let listItem

	list.unshift({
		'accountId': '',
		'avatarUrls': {
			'32x32': config.avatars.unassignedUrl
		},
		'displayName': 'Unassigned',
	})

	list.forEach(user => {
		listItem = `
			<div class="usersDropdownItem" data-accountId="${user.accountId}">
				<img class="usersDropdownImage" src="${user.avatarUrls['32x32']}">
				<span class="usersDropdownDisplayName">${user.displayName}</span>
			</div>
		`
		html += listItem
	})

	debug('assignDropdown.js::injectUsersList', list)

	dropdown.getElementsByClassName('usersDropdownList')[0].innerHTML = html
}

function filterUsersList(list, text) {
	text = `${text}`.toLowerCase()

	return list.filter(user =>
		user.accountType === 'atlassian' &&
		user.active &&
		user.displayName.toLowerCase().indexOf(text) > -1
	)
}

function getUserListItemData(userListItem) {
	return {
		'displayName': userListItem.getElementsByClassName('usersDropdownDisplayName')[0].innerText,
		'avatar': {
			'src': userListItem.getElementsByClassName('usersDropdownImage')[0].getAttribute('src')
		}
	}
}

/**
 * 4. Issues list behavior
 */

function getActiveIssue(issuesContainer, issueKey) {
	debug('assignDropdown::getActiveIssue', {issuesContainer, issueKey})
	return issuesContainer
		.querySelectorAll(`div.js-issue[data-issue-key=${issueKey}]`)[0]
}

function getActiveIssueAvatar(issuesContainer, issueKey) {
	return getActiveIssue(issuesContainer, issueKey)
		.getElementsByClassName(config.avatars.avatarClass)[0]
}

function activeIssueAvatarLoading(issuesContainer, issueKey) {
	let avatar = getActiveIssueAvatar(issuesContainer, issueKey)

	avatar.setAttribute('style', 'opacity: 50%;')
}

function activeIssueAvatarSet(issuesContainer, issueKey, imageSource, tooltip) {
	let avatar = getActiveIssueAvatar(issuesContainer, issueKey)

	avatar.setAttribute('style', '')
	avatar.setAttribute('src', imageSource)
	avatar.setAttribute('data-tooltip', tooltip)
}

/**
 * 5. Binders and listeners
 */

// Show dropdown on click

function listenerShowDropdownOnClick(e) {
	e.preventDefault()
	e.stopPropagation()

	let issueItem = findElementByClassName(e.path, config.issue.className)
	if (issueItem === false) {
		return false
	}

	let issueKey = issueItem.getAttribute('data-issue-key')
	let leftPosition = e.clientX-150
	let topPosition = e.clientY

	showDropdown(issueKey, leftPosition, topPosition)
}

function bindShowDropdownOnAvatarClick() {
	context.issuesContainer
		.querySelectorAll(`.${config.avatars.avatarClass}`)
		.forEach(element => {
			if (element.getAttribute('listener') !== 'true') {
				element.addEventListener('click', listenerShowDropdownOnClick, true)
				element.setAttribute('listener', 'true')
			}
		})
}

// Hide dropdown on click

function listenerHideDropdownOnClick(e) {
	if (e.target.className.indexOf('usersDropdown') === -1) {
		hideDropdown()
	}
}

function bindHideDropdownOnClick() {
	document.addEventListener('click', listenerHideDropdownOnClick)
}

// Hide dropdown on Esc

function listenerHideDropdownOnEsc(e) {
	if (e.key === 'Escape') {
		hideDropdown()
	}
}

function bindHideDropdownOnEsc() {
	dropdown.getElementsByClassName('usersDropdownSearch')[0]
		.addEventListener('keydown', listenerHideDropdownOnEsc)
}

// Search users list on input

function listenerSearchUsersListOnInput(e) {
	debug('assignDropdown.js::listenerSearchUsersListOnInput', e)
	searchUsersList(`${e.target.value}`)
}

function bindSearchUsersListOnInput() {
	dropdown.getElementsByClassName('usersDropdownSearch')[0]
		.addEventListener('input', listenerSearchUsersListOnInput)
}

// Refresh users list on click

function listenerRefreshUsersListOnClick(e) {
	refreshUsersList()
}

function bindRefreshUsersListOnClick() {
	dropdown.getElementsByClassName('usersDropdownRefresh')[0]
		.addEventListener('click', listenerRefreshUsersListOnClick)
}

// Assign a user on click

async function listenerAssignUserOnClick(e) {
	let userListItem = findElementByClassName(e.path, 'usersDropdownItem')
	if (userListItem === false) {
		return false
	}

	let response
	let issueKey = dropdown.getAttribute('data-issue-key')
	let accountId = userListItem.getAttribute('data-accountId')

	activeIssueAvatarLoading(context.issuesContainer, issueKey)
	response = await issueAssignUser(issueKey, accountId)

	let newUser = getUserListItemData(userListItem)
	activeIssueAvatarSet(
		context.issuesContainer, issueKey, newUser.avatar.src, newUser.displayName
	)

	hideDropdown()
}

function bindAssignOnClick () {
	dropdown.querySelectorAll('.usersDropdownItem').forEach(element => {
		element.addEventListener('click', listenerAssignUserOnClick)
	})
}

/**
 * 6. Init and export
 */

const init = async (providedContext) => {
	await setup (providedContext)
	await renderUsersList('')

	bindShowDropdownOnAvatarClick()
	bindSearchUsersListOnInput()
	bindRefreshUsersListOnClick()
	bindHideDropdownOnClick()
	bindHideDropdownOnEsc()
}

export default {
	init
}
