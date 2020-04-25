import { debug } from '../../lib/logger'

import { getCurrentPageType } from '../../jira/components/Page'

import unassignedAvatar from './components/unassignedAvatar'
import unassignShortcut from './components/unassignShortcut'
import assignDropdown from './components/assignDropdown'

const init = async () => {
	debug('assign::init', 'Initiating assign module.')

	const supportedPages = ['backlog', 'board', 'issue']
	if (supportedPages.indexOf(getCurrentPageType()) === -1) {
		return false
	}

	debug('assign::init', 'Loading components.')

	await unassignedAvatar.init()
	assignDropdown.init()
	unassignShortcut.init()
}

export default {
	init: init
}
