export default {
	'page': {
		'backlog': {
			'type': 'backlog',
			'issuesListId': 'ghx-backlog',
			'avatarContainerSelector': 'span.ghx-end'
		},
		'board': {
			'type': 'board',
			'issuesListId': 'ghx-pool',
			'avatarContainerSelector': 'div.ghx-stat-2'
		},
	},
	'avatar': {
		'unassigned': {
			'name': 'Unassigned',
			'url': chrome.runtime.getURL('unassigned.png')
		},
		'className': 'ghx-avatar-img',
	},
	'issue': {
		'className': 'js-issue',
	}
}
