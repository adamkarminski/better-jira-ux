import { isNull } from 'lodash'

import { debug } from '../../lib/logger'

import { getIssuesList } from './IssuesList'

export function getIssue(issueKey) {
	let issuesList = getIssuesList()

	return issuesList.querySelectorAll(`div.js-issue[data-issue-key=${issueKey}]`)[0]
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
