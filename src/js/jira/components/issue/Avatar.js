import config from '../../jira.config'

export function getIssueAvatar(issue) {
	return issue.getElementsByClassName(config.avatar.className)[0]
}

export function setIssueAvatarToLoading(issue) {
	setAvatarToLoading(getIssueAvatar(issue))
}

export function setIssueAvatarToLoaded(issue) {
	setAvatarToLoaded(getIssueAvatar(issue))
}

export function setIssueAvatar(issue, imageSource, tooltip) {
	setAvatarData(getIssueAvatar(issue), imageSource, tooltip)
}

export function setIssueAvatarToUnassigned(issue) {
	setAvatarToUnassigned(getIssueAvatar(issue))
}

export function setAvatarToLoading(avatar) {
	avatar.setAttribute('style', 'opacity: 50%;')
}

export function setAvatarToLoaded(avatar) {
	avatar.setAttribute('style', '')
}

export function setAvatarData(avatar, imageSource, tooltip) {
	avatar.setAttribute('style', '')
	avatar.setAttribute('src', imageSource)
	avatar.setAttribute('data-tooltip', tooltip)
}

export function setAvatarToUnassigned(avatar) {
	setAvatarData(avatar, config.avatar.unassigned.url, config.avatar.unassigned.name)
}
