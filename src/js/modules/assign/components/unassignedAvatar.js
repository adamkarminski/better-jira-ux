import { debug } from '../../../lib/logger'

import config from '../../../jira/jira.config'

import { getCurrentPageType } from '../../../jira/components/Page'
import { getAllAvatarContainers } from '../../../jira/components/IssuesList'

/**
 * Constants
 */

const pageType = getCurrentPageType()

const unassignedAvatarImg = `<img src="${config.avatar.unassigned.url}"
	class="${config.avatar.className}" data-tooltip="${config.avatar.unassigned.name}">`

const unassignedAvatarHtml = {
	'backlog': unassignedAvatarImg,
	'board': `<span class="ghx-field">${unassignedAvatarImg}</span>`
}

/**
 * Functions
 */

function injectUnassignedAvatarHtml(element) {
	if (element.innerHTML.indexOf(config.avatar.className) === -1) {
		element.innerHTML = unassignedAvatarHtml[pageType] + element.innerHTML
	}
}

function injectUnassignedAvatars() {
	let avatarContainers = getAllAvatarContainers()

	debug('unassignedAvatar::injectUnassignedAvatars::avatarContainers', avatarContainers)

	avatarContainers.forEach(element => {
		injectUnassignedAvatarHtml(element)
	})
}

const init = async () => {
	await injectUnassignedAvatars()
}

export default {
	init
}
