export default {
	'page': {
		'backlog': {
			'type': 'backlog',
			'issuesListId': 'ghx-backlog',
			'avatarContainerSelector': 'span.ghx-end',
			'hasIssuesList': true,
			'hasSubtasks': true,
			'isAvatarWrapped': false,
		},
		'board': {
			'type': 'board',
			'issuesListId': 'ghx-pool',
			'avatarContainerSelector': 'div.ghx-stat-2',
			'hasIssuesList': true,
			'hasSubtasks': true,
			'isAvatarWrapped': true,
		},
		'issue': {
			'type': 'issue',
			'hasIssuesList': false,
			'hasSubtasks': true,
		}
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
