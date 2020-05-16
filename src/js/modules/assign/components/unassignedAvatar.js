import { debug } from '../../../lib/logger'

import config from '../../../jira/jira.config'

import { getCurrentPageType } from '../../../jira/components/Page'
import { getAllAvatarContainers, getAllIssues } from '../../../jira/components/IssuesList'
import { getIssueKey, getIssueAvatar, getIssueAvatarContainer } from '../../../jira/components/Issue'
import { findSubtasks, getSubtasksWithIssueKeys } from '../../../jira/components/SubtasksList'
import { getSubtaskAvatar } from '../../../jira/components/Subtask'

/**
 * Constants
 */

const pageType = getCurrentPageType()

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

function setupAvatarData(avatar, issueKey) {
	avatar.setAttribute('data-bju-assign', 'on')
	avatar.setAttribute('data-bju-issue-key', issueKey)

	return avatar
}

function injectUnassignedAvatars() {
	let issues = getAllIssues()

	debug('unassignedAvatar::injectUnassignedAvatars::issues', issues)

	for (let i = 0; i < issues.length; i++) {
		let issueKey = getIssueKey(issues[i])
		let avatar = getIssueAvatar(issues[i])

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

function injectUnassignedAvatarsToSubtasks() {
	let avatar

	let subtasks = getSubtasksWithIssueKeys()

	for (let i = 0; i < subtasks.length; i++) {
		avatar = getSubtaskAvatar(subtasks[i].element)

		if (avatar === false) {
			avatar = setupAvatarData(createUnassignedAvatarImgElement(), subtasks[i].issueKey)
			avatar = wrapElementWithSpan(avatar, 'bju-subtask-avatar')

			injectUnassignedAvatarHtmlToSubtask(subtasks[i].element, avatar)
		} else {
			setupAvatarData(avatar, subtasks[i].issueKey)
		}
	}
}

function injectUnassignedAvatarHtmlToSubtask(subtask, avatar) {
	avatar = subtask.insertBefore(avatar, subtask.lastElementChild)
}

const init = async () => {
	await injectUnassignedAvatars()
	await injectUnassignedAvatarsToSubtasks()
}

export default {
	init
}
