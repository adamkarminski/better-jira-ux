import { debug } from '../../lib/logger'

import config from '../jira.config'

const hrefTermsToPageMap = {
	'planning': 'backlog',
	'RapidBoard': 'board',
	'browse': 'issue'
}

export function getCurrentPageType() {
	let searchTerms = Object.keys(hrefTermsToPageMap)

	for (let i = 0; i < searchTerms.length; i++) {
		let searchTerm = searchTerms[i]

		if (window.location.href.indexOf(searchTerm) > -1) {
			return hrefTermsToPageMap[searchTerm]
		}
	}

	return false
}

export function getCurrentPageConfig() {
	let type = getCurrentPageType()

	if (type !== false) {
		return config.page[type]
	}

	return null
}
