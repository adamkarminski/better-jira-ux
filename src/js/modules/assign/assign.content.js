import { log } from '../../lib/logger'

import unassignedAvatar from './components/unassignedAvatar'
import assignDropdown from './components/assignDropdown'

import config from './assign.config'

function checkContext() {
 	if (window.location.indexOf('planning') > -1) {
 		return 'backlog'
 	}
 	else if (window.location.indexOf('RapidBoard') > -1) {
 		return 'board'
 	}
 	else if (window.location.indexOf('browse') > -1) {
 		return 'issue'
 	}

 	return false
}

const init = async () => {
	log('assign::init', 'Initiating assign module.')

	context = checkContext()

	if (context === false) {
		log('assign::init', 'Assigned does not work in this context. Init aborted.')
		return false
	}

	contextConfig = config.context[context]
	contextConfig.issuesContainer = document.getElementById(config.avatars[context].id)

	await unassignedAvatar.init(contextConfig)
	assignDropdown.init(contextConfig)
}

export default {
	init: init
}
