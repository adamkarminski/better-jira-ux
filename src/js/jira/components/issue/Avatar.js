import config from '../../jira.config'

export function getIssueAvatar(issue) {
	return issue.getElementsByClassName(config.avatar.className)[0]
}

export function setIssueAvatarToLoading(issue) {
	getIssueAvatar(issue).setAttribute('style', 'opacity: 50%;')
}

export function setIssueAvatarToLoaded(issue) {
	getIssueAvatar(issue).setAttribute('style', '')
}

export function setIssueAvatar(issue, imageSource, tooltip) {
	let avatar = getIssueAvatar(issue)

	avatar.setAttribute('style', '')
	avatar.setAttribute('src', imageSource)
	avatar.setAttribute('data-tooltip', tooltip)
}

export function setIssueAvatarToUnassigned(issue) {
	setIssueAvatar(issue, config.avatar.unassigned.url, config.avatar.unassigned.name)
}
