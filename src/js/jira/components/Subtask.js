import { debug } from '../../lib/logger'

export function getSubtaskAvatar(subtask) {
	debug('Subtask::getSubtaskAvatar::subtask', subtask)

	let avatars = subtask.querySelectorAll('div span[role="img"]')

	return avatars.length > 0 ? avatars[0] : false
}
