import { debug } from '../../../lib/logger'

import config from '../../../jira/jira.config'

import { setAvatarData } from '../../../jira/components/issue/Avatar'
import { getCurrentPageType } from '../../../jira/components/Page'
import { getAllAvatarContainers, getAllIssues } from '../../../jira/components/IssuesList'
import { getIssueKey, getIssueAvatar, getIssueAvatarContainer } from '../../../jira/components/Issue'
import { findSubtasks, getSubtasksWithIssueKeys } from '../../../jira/components/SubtasksList'
import { getSubtaskAvatar } from '../../../jira/components/Subtask'

/**
 * Functions
 */

function createUnassignedAvatarImgElement() {
	let element = document.createElement('img')

	element.setAttribute('src', config.avatar.unassigned.url)
	element.setAttribute('class', config.avatar.className)
	element.setAttribute('data-tooltip', config.avatar.unassigned.name)

	return element
}

function wrapElementWithSpan(element, className) {
	let span = document.createElement('span')
	span.setAttribute('class', className)

	span.appendChild(element)

	return span
}

// TODO: Should be renamed
function setupAvatarData(avatar, issueKey) {
	avatar.setAttribute('data-bju-assign', 'on')
	avatar.setAttribute('data-bju-issue-key', issueKey)

	return avatar
}

function setupIssuesAvatars() {
	let issues = getAllIssues()
	let pageType = getCurrentPageType()

	for (let i = 0; i < issues.length; i++) {
		let issueKey = getIssueKey(issues[i])
		let avatarContainer = getIssueAvatarContainer(issues[i], pageType)
		let avatar = getIssueAvatar(avatarContainer)

		if (avatar !== null) {
			setupAvatarData(avatar, issueKey)
		} else {
			let unassignedAvatar = setupAvatarData(createUnassignedAvatarImgElement(), issueKey)
			let avatarContainer = getIssueAvatarContainer(issues[i], pageType)

			if (config.page[pageType].isAvatarWrapped) {
				unassignedAvatar = wrapElementWithSpan(unassignedAvatar, 'ghx-field')
			}

			unassignedAvatar = avatarContainer.insertBefore(unassignedAvatar, avatarContainer.firstElementChild)
		}
	}
}

function setupSubtasksAvatars() {
	let avatar

	let subtasks = getSubtasksWithIssueKeys()

	for (let i = 0; i < subtasks.length; i++) {
		avatar = getSubtaskAvatar(subtasks[i].element)

		if (avatar === false) {
			avatar = createUnassignedAvatar(subtasks[i].issueKey, true)

			injectUnassignedAvatarHtmlToSubtask(subtasks[i].element, avatar)
		} else {
			setupAvatarData(avatar, subtasks[i].issueKey)
		}
	}
}

function injectUnassignedAvatarHtmlToSubtask(subtask, avatar) {
	avatar = subtask.insertBefore(avatar, subtask.lastElementChild)
}

function createUnassignedAvatar(issueKey, wrapWithSpan=false) {
	let avatar = setupAvatarData(createUnassignedAvatarImgElement(), issueKey)

	if (wrapWithSpan) {
		avatar = wrapElementWithSpan(avatar, 'bju-subtask-avatar')
	}

	return avatar
}

const rebind = async (config = {}) => {
	if (!config.hasOwnProperty('skipIssues')) {
		await setupIssuesAvatars()
	}
	if (!config.hasOwnProperty('skipSubtasks')) {
		await setupSubtasksAvatars()
	}
}

const init = async () => {
	await setupIssuesAvatars()
	await setupSubtasksAvatars()
}

export default {
	init,
	createUnassignedAvatar,
	rebind
}
