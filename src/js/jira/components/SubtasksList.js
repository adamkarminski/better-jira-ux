import { debug } from '../../lib/logger'

function findSubtaksTitle() {
	let secondLevelHeaders = document.getElementsByTagName('h2')

	for (let i = 0; i < secondLevelHeaders.length; i++) {
		if (secondLevelHeaders[i].textContent.indexOf('Subtasks') > -1) {
			return secondLevelHeaders[i]
		}
	}

	return false
}

function findSubtasksList() {
	let subtasksTitle = findSubtaksTitle()

	return subtasksTitle !== false ? subtasksTitle.parentElement.parentElement.lastElementChild : false
}

function findSubtasksKeysElements() {
	let subtasksList = findSubtasksList()

	return subtasksList !== false ? subtasksList.querySelectorAll('div a[data-test-id*="key"]') : []
}

export function findSubtasks() {
	let subtasksKeysElements = findSubtasksKeysElements()
	let subtasks = []

	for (let i = 0; i < subtasksKeysElements.length; i++) {
		subtasks.push(subtasksKeysElements[i].parentElement)
	}

	return subtasks
}

export function findSubtasksWithIssueKeys() {
	let subtasksKeysElements = findSubtasksKeysElements()
	let subtasks = []

	for (let i = 0; i < subtasksKeysElements.length; i++) {
		debug('SubtasksList::findSubtasksWithIssueKeys::subtaskKeyElement', subtasksKeysElements[i])

		subtasks.push({
			element: subtasksKeysElements[i].parentElement,
			issueKey: subtasksKeysElements[i].textContent
		})
	}

	return subtasks
}

export function getSubtaskAvatar(subtask) {
	debug('SubtasksList::getSubtaskAvatar::subtask', subtask)

	let avatars = subtask.querySelectorAll('div span[role="img"]')

	return avatars.length > 0 ? avatars[0] : false
}

export function hasSubtaskAvatar(subtask) {
	avatar = getSubtaskAvatar(subtask)

	return avatar !== false
}

export function checkSubtasksForAvatars() {
	let subtasks = findSubtasks()
	let results = []

	for (let i = 0; i < subtasks.length; i++) {
		results[i] = hasSubtaskAvatar(subtasks[i])
	}

	return results
}
