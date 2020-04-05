import { jiraUsersGetAll, jiraIssueAssignUser } from '../../../lib/jira-messages'
import { findElementByClassName } from '../../lib/dom'
import config from '../assign.config'

const context
const dropdown

async function setup(context, data) {
	context = context

	await setupUsersDropdown()
}

function setupUsersDropdown() {
	dropdown = document.createElement('div')

	dropdown.setAttribute('id', 'usersDropdown')
	dropdown.setAttribute('class', 'usersDropdown')
	dropdown.setAttribute('data-issue-key', '')

	dropdown.innerHTML = `
		<div class="usersDropdownControls">
			<input type="text" class="usersDropdownFilter">
			<span class="usersDropdownRefresh">♻️</span>
		</div>
		<div id="usersDropdownList" class="usersDropdownList">
		</div>
	`

	dropdown = document.getElementsByTagName('body')[0].appendChild(dropdown)

	return dropdown
}

function filterUsersList(list, text) {
	text = text.toString().toLowerCase()

	return list.filter(user =>
		user.accountType === 'atlassian' &&
		user.active &&
		user.displayName.toLowerCase().indexOf(text) > -1
	)
}

function injectUsersList(list) {
	let html = ''

	list.unshift({
		'accountId': '',
		'avatarUrls': {
			'32x32': config.avatars.unassignedUrl
		},
		'displayName': 'Unassigned',
	})

	list.forEach(user => {
		let listItem = `
			<div class="usersDropdownItem" data-accountId="${user.accountId}">
				<img class="usersDropdownImage" src="${user.avatarUrls['32x32']}">
				<span class="usersDropdownDisplayName">${user.displayName}</span>
			</div>
		`
		html += listItem
	})

	dropdown.getElementById('usersDropdownList').innerHTML = html
}

async function renderUsersList(filterText) {
	let usersList = await jiraUsersGetAll()

	injectUsersList(filterUsersList(usersList, filterText))
}

function showDropdown(issueKey, left, top) {
	dropdown.setAttribute('data-issue-key', issueKey)
	dropdown.setAttribute('style', `display: inherit; left: ${left}px; top: ${top}px;`)
}

function hideDropdown() {
	dropdown.setAttribute('style', 'display: none;')
}

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

function getUserListItemData(userListItem) {
	return {
		'displayName': userListItem.getElementsByClassName('usersDropdownDisplayName')[0].innerText,
		'avatar': {
			'src': userListItem.getElementsByClassName('usersDropdownImage')[0].getAttribute('src')
		}
	}
}

// BEGIN - TO JIRA-UI?

function getActiveIssue(issuesContainer, issueKey) {
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

function activeIssueAvatarSet(issueKey, imageSource, tooltip) {
	let avatar = getActiveIssueAvatar(context.issuesContainer, issueKey)

	activeIssueAvatar.setAttribute('style', '')
	activeIssueAvatar.setAttribute('src', imageSource)
	activeIssueAvatar.setAttribute('data-tooltip', tooltip)
}

// END - TO JIRA-UI?

async function listenerAssignUserOnClick(e) {
	let userListItem = findElementByClassName(e.path, 'usersDropdownItem')
	if (userListItem === false) {
		return false
	}

	let response
	let issueKey = dropdown.getAttribute('data-issueKey')
	let accountId = userListItem.getAttribute('data-accountId')

	activeIssueAvatarLoading(context.issuesContainer, issueKey)
	response = await jiraIssueAssignUser(issueKey, accountId)

	newUser = getUserListItemData(userListItem)
	activeIssueAvatarSet(
		context.issuesContainer, issueKey, newUser.avatars.src, newUser.displayName
	)

	hideDropdown()
}

function bindAssignOnClick () {
	dropdown.getElementsByClassName('usersDropdownItem').forEach((element) => {
		element.addEventListener('click', listenerAssignUserOnClick)
	})
}

function bindDropdownShowOnAvatarClick() {
	issuesContainer
		.getElementsByClassName(config.avatars.avatarClass)
		.forEach(element => {
			if (element.getAttribute('listener') !== 'true') {
				element.addEventListener('click', listenerShowDropdownOnClick, true)
				element.setAttribute('listener', 'true')
			}
		})
}

function bindHideDropdownOnClick() {
	document.addEventListener('click', listenerHideDropdownOnClick)
}

const init = (context) => {
	await setup (context, data)
	await renderUsersList()

	bindAssignOnClick()
	bindDropdownShowOnAvatarClick()
	bindHideDropdownOnClick()
}

export default {
	init
}
