import { local } from 'brownies'

import { log } from '../../../lib/logger'
import { jiraUsersGetAll, jiraIssueAssignUser } from '../../../lib/jira-messages'
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
 * 5. Listeners
 * 6. Binders
 * 7. Init and export
 */

/**
 * 1. Setup
 */

async function setup(providedContext) {
	context = providedContext

	await setupUsersDropdown()
}

function setupUsersDropdown() {
	let virtualDropdown = document.createElement('div')

	virtualDropdown.setAttribute('id', 'usersDropdown')
	virtualDropdown.setAttribute('class', 'usersDropdown')
	virtualDropdown.setAttribute('data-issue-key', '')

	virtualDropdown.innerHTML = `
		<div class="usersDropdownControls">
			<input type="text" class="usersDropdownFilter">
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
 	dropdown.setAttribute('data-issue-key', issueKey)
 	dropdown.setAttribute('style', `display: inherit; left: ${left}px; top: ${top}px;`)
 }

 function hideDropdown() {
 	dropdown.setAttribute('style', 'display: none;')
 }

 /**
  * 3. User list behavior
  */

async function renderUsersList(filterText) {
	let usersList = await jiraUsersGetAll()
	let filteredList = filterUsersList(usersList, filterText)

	log('assignDropdown.js::renderUsersList', filteredList)

	injectUsersList(filteredList)
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

	log('assignDropdown.js::injectUsersList', list)

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
	log('assignDropdown::getActiveIssue', {issuesContainer, issueKey})
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
 * 5. Listeners
 */

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

function listenerHideDropdownOnClick(e) {
	if (e.target.className.indexOf('usersDropdown') === -1) {
		hideDropdown()
	}
}

async function listenerAssignUserOnClick(e) {
	let userListItem = findElementByClassName(e.path, 'usersDropdownItem')
	if (userListItem === false) {
		return false
	}

	let response
	let issueKey = dropdown.getAttribute('data-issue-key')
	let accountId = userListItem.getAttribute('data-accountId')

	activeIssueAvatarLoading(context.issuesContainer, issueKey)
	response = await jiraIssueAssignUser(issueKey, accountId)

	let newUser = getUserListItemData(userListItem)
	activeIssueAvatarSet(
		context.issuesContainer, issueKey, newUser.avatar.src, newUser.displayName
	)

	hideDropdown()
}

/**
 * 6. Binders
 */

function bindAssignOnClick () {
	dropdown.querySelectorAll('.usersDropdownItem').forEach(element => {
		element.addEventListener('click', listenerAssignUserOnClick)
	})
}

function bindDropdownShowOnAvatarClick() {
	context.issuesContainer
		.querySelectorAll(`.${config.avatars.avatarClass}`)
		.forEach(element => {
			if (element.getAttribute('listener') !== 'true') {
				element.addEventListener('click', listenerShowDropdownOnClick, true)
				element.setAttribute('listener', 'true')
			}
		})
}

function bindRefreshUsersListOnClick() {
	dropdown.getElementsByClassName('usersDropdownRefresh')[0]
		.addEventListener('click', refreshUsersList)
}

function bindHideDropdownOnClick() {
	document.addEventListener('click', listenerHideDropdownOnClick)
}

/**
 * 7. Init and export
 */

const init = async (providedContext) => {
	await setup (providedContext)
	await renderUsersList('')

	bindAssignOnClick()
	bindDropdownShowOnAvatarClick()
	bindRefreshUsersListOnClick()
	bindHideDropdownOnClick()
}

export default {
	init
}
