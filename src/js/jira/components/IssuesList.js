import { debug } from '../../lib/logger'

import config from '../jira.config'
import { getCurrentPageConfig } from './Page'

export function getIssuesList() {
	let pageConfig = getCurrentPageConfig()

	return document.getElementById(pageConfig.issuesListId)
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
