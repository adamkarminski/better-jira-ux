import { debug } from '../../lib/logger'

import config from '../jira.config'
import { getCurrentPageConfig } from './Page'

export function getIssuesList() {
	let pageConfig = getCurrentPageConfig()

	if (typeof pageConfig.issuesListId !== 'undefined') {
		return document.getElementById(pageConfig.issuesListId)
	} else if (typeof pageConfig.issuesListClass !== 'undefined') {
		return document.getElementsByClassName(pageConfig.issuesListClass)[0]
	}

	return false
}

export function getAllIssues() {
	let issuesList = getIssuesList()

	return issuesList !== false ? issuesList.querySelectorAll(`.${config.issue.className}`) : []
}

export function getAllAvatars() {
	return getIssuesList().querySelectorAll(`.${config.avatar.className}`)
}

export function getAllAvatarContainers() {
	let pageConfig = getCurrentPageConfig()
	let issuesList = getIssuesList()

	debug('IssuesList::getAllAvatarContainers::pageConfig', pageConfig)
	debug('IssuesList::getAllAvatarContainers::issuesList', issuesList)

	return issuesList.querySelectorAll(pageConfig.avatarContainerSelector)
}
