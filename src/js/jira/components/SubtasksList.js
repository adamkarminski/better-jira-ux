import { debug } from '../../lib/logger'

function findSubtasksTitle() {
	let secondLevelHeaders = document.getElementsByTagName('h2')

	for (let i = 0; i < secondLevelHeaders.length; i++) {
		if (secondLevelHeaders[i].textContent.indexOf('Subtasks') > -1) {
			return secondLevelHeaders[i]
		}
	}

	return false
}

function findSubtasksList() {
	let subtasksTitle = findSubtasksTitle()

	return subtasksTitle !== false ? subtasksTitle.parentElement.parentElement.lastElementChild : false
}

function findSubtasksKeysElements() {
	let subtasksList = findSubtasksList()

	return subtasksList !== false ? subtasksList.querySelectorAll('div a[data-test-id*="key"]') : []
}

export function getSubtasksWithIssueKeys() {
	let subtasksKeysElements = findSubtasksKeysElements()
	let subtasks = []

	for (let i = 0; i < subtasksKeysElements.length; i++) {
		debug('SubtasksList::getSubtasksWithIssueKeys::subtaskKeyElement', subtasksKeysElements[i])

		subtasks.push({
			element: subtasksKeysElements[i].parentElement,
			issueKey: subtasksKeysElements[i].textContent
		})
	}

	return subtasks
}
