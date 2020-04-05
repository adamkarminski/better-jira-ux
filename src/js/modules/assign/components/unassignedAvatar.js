import { debug } from '../../../lib/logger'
import { sendMessage } from '../../../lib/communication'

import config from '../assign.config'

let context
let contextConfig
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
	debug('unassignedAvatar::injectUnassignedAvatars', context)

	context.issuesContainer
		.querySelectorAll(contextConfig.avatarContainerSelector)
		.forEach(element => {
			injectUnassignedAvatarHtml(context, element)
		})
}

function setup(providedContext) {
	context = providedContext
	contextConfig = config.avatars[context.name]
	debug('unassignedAvatar::setup', ['Setup finished', context])
}

const init = async (providedContext) => {
	debug('unassignedAvatar::init', providedContext)

	setup(providedContext)
	await injectUnassignedAvatars()
}

export default {
	init
}
