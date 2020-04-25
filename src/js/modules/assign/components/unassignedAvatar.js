import { debug } from '../../../lib/logger'

import config from '../../../jira/jira.config'

import { getCurrentPageType } from '../../../jira/components/Page'
import { getAllAvatarContainers, getAllIssues } from '../../../jira/components/IssuesList'
import { getIssueKey, getIssueAvatar, getIssueAvatarContainer } from '../../../jira/components/Issue'
import { findSubtasks, findSubtasksWithIssueKeys, hasSubtaskAvatar, getSubtaskAvatar } from '../../../jira/components/SubtasksList'

/**
 * Constants
 */

const pageType = getCurrentPageType()

// const unassignedAvatarImg = `<img src="${config.avatar.unassigned.url}"
// 	class="${config.avatar.className}" data-tooltip="${config.avatar.unassigned.name}" data-bju-assign="on">`

// const unassignedAvatarIssue = `
// 	<div class="sc-gbuiJB gWiorg sc-gGsJSs eihPQS">
// 		<div>
// 			<div style="display: inline-block; position: relative; outline: 0px; height: 28px; width: 28px;">
// 				<span class="styledCache__StyledSpan-zohhd2-3 fmTriT">
// 					<span role="img" aria-label="${config.avatar.unassigned.name}" style="background-color: transparent; background-image: url(&quot;${config.avatar.unassigned.url}&quot;); background-position: center center; background-repeat: no-repeat; background-size: cover; border-radius: 50%; display: flex; flex: 1 1 100%; height: 100%; width: 100%;"></span>
// 				</span>
// 			</div>
// 		</div>
// 	</div>
// `

// const unassignedAvatarHtml = {
// 	'backlog': unassignedAvatarImg,
// 	'board': `<span class="ghx-field">${unassignedAvatarImg}</span>`,
// }
//
const unassignedAvatarElement = createUnassignedAvatarImgElement()
// avatarElement.innerHTML = `<span class="bju-subtask-avatar">${unassignedAvatarImg}</span>`

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

// function injectUnassignedAvatarHtml(element) {
// 	let avatar = element.querySelector(`.${config.avatar.className}`)
//
// 	if (avatar === null) {
// 		avatar = avatar.in
// 		element.innerHTML = unassignedAvatarHtml[pageType] + element.innerHTML
// 	}  else {
// 		avatar.setAttribute(avatar)
// 	}
// }

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

	let subtasks = findSubtasksWithIssueKeys()

	for (let i = 0; i < subtasks.length; i++) {
		avatar = getSubtaskAvatar(subtasks[i].element)

		if (avatar === false) {
			avatar = setupAvatarData(unassignedAvatarElement, subtasks[i].issueKey)
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
