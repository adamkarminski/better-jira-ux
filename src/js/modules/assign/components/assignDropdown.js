import { isElement } from 'lodash'

import { debug } from '../../../lib/logger'
import { findElementByClassName } from '../../../lib/dom'
import { usersGetAll, issueAssignUser } from '../../../lib/jira-background-api'

import config from '../../../jira/jira.config'
import { getAllAvatars } from '../../../jira/components/IssuesList'
import { getIssue } from '../../../jira/components/Issue'
import { setIssueAvatarToLoading, setIssueAvatar } from '../../../jira/components/issue/Avatar'

import assignConfig from '../assign.config'

let dropdown

/**
 * Table of contents
 * 1. Setup
 * 2. Dropdown behavior
 * 3. User list behavior
 * 4. Listeners and binders
 * 5. Init and export
 */

/**
 * 1. Setup
 */

async function setup(providedContext) {
	await setupUsersDropdown()
}

function setupUsersDropdown() {
	dropdown = document.getElementById('usersDropdown')

	if (isElement(dropdown)) {
		return true
	}

	let virtualDropdown = document.createElement('div')

	virtualDropdown.setAttribute('id', 'usersDropdown')
	virtualDropdown.setAttribute('class', 'usersDropdown')
	virtualDropdown.setAttribute('data-issue-key', '')

	virtualDropdown.innerHTML = `
		<div class="usersDropdownControls">
			<input type="text" class="usersDropdownSearch" placeholder="Type to filter...">
		</div>
		<div id="usersDropdownList" class="usersDropdownList">
		</div>
	`

	dropdown = document.getElementsByTagName('body')[0].appendChild(virtualDropdown)
}

/**
 * 2. Dropdown behavior
 */

function dropdownPositionFromEvent(e) {
	let left = e.clientX - e.clientX / window.innerWidth * assignConfig.dropdown.width
	let top = e.clientY

	if (window.innerHeight - e.clientY <= assignConfig.dropdown.height) {
		top = e.clientY - assignConfig.dropdown.height
	}

	return { left, top }
}

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

function injectUsersList(list) {
	let html = ''
	let listItem

	list.unshift({
		'accountId': '',
		'avatarUrls': {
			'32x32': config.avatar.unassigned.url
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
 * 4. Binders and listeners
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
	let position = dropdownPositionFromEvent(e)

	showDropdown(issueKey, position.left, position.top)
}

function bindShowDropdownOnAvatarClick() {
	getAllAvatars().forEach(element => {
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

// Assign a user on click

async function listenerAssignUserOnClick(e) {
	let userListItem = findElementByClassName(e.path, 'usersDropdownItem')
	if (userListItem === false) {
		return false
	}

	let response
	let issueKey = dropdown.getAttribute('data-issue-key')
	let accountId = userListItem.getAttribute('data-accountId')
	let issue = getIssue(issueKey)

	setIssueAvatarToLoading(issue)
	response = await issueAssignUser(issueKey, accountId)

	let newUser = getUserListItemData(userListItem)
	setIssueAvatar(issue, newUser.avatar.src, newUser.displayName)

	hideDropdown()
}

function bindAssignOnClick () {
	dropdown.querySelectorAll('.usersDropdownItem').forEach(element => {
		element.addEventListener('click', listenerAssignUserOnClick)
	})
}

/**
 * 5. Init and export
 */

const init = async () => {
	await setup ()
	await renderUsersList('')

	bindShowDropdownOnAvatarClick()
	bindSearchUsersListOnInput()
	bindHideDropdownOnClick()
	bindHideDropdownOnEsc()
}

export default {
	init
}
