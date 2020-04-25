import { isNull } from 'lodash'

import { debug } from '../../lib/logger'

import config from '../jira.config'
import { getIssuesList } from './IssuesList'

export function getIssue(issueKey) {
	let issuesList = getIssuesList()

	return issuesList.querySelectorAll(`div.js-issue[data-issue-key=${issueKey}]`)[0]
}

export function getIssueKey(issue) {
	return issue.getAttribute('data-issue-key')
}

export function getIssueAvatar(issue) {
	return issue.querySelector(`.${config.avatar.className}`)
}

export function getIssueAvatarContainer(issue, pageType) {
	debug('Issue::getIssueAvatarContainer::pageType', pageType)

	return issue.querySelector(config.page[pageType].avatarContainerSelector)
}

export function getSelectedIssue() {
	let issueKey = getSelectedIssueKeyFromUrl()

	if (issueKey === false) {
		return false
	}

	return getIssue(issueKey)
}

export function getSelectedIssueKeyFromUrl() {
	let issueKeyMatches = window.location.href.match(/[A-Z]+\-[1-9]+/)

	return !isNull(issueKeyMatches) ? issueKeyMatches[0] : false
}
