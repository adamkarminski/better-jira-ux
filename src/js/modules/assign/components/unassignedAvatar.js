import { sendMessage } from '../../lib/communication'

import config from '../assign.config'

const context
const contextConfig
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

function injectUnassignedAvatarHtml(context, element) {
	if (element.innerHTML.indexOf(config.avatars.avatarClass) === -1) {
		element.innerHTML = unassignedAvatarHtml[context.name] + element.innerHTML
	}
}

function injectUnassignedAvatars() {
	context.issuesContainer
		.querySelectorAll(contextConfig.avatarContainerSelector)
		.forEach(element => {
			injectUnassignedAvatarHtml(context, element)
		})
}

function setup(context) {
	context = context
	contextConfig = config.avatars[context.name]
}

const init = async (context) => {
	setup(context)
	await injectUnassignedAvatars()
}

export default {
	init
}
