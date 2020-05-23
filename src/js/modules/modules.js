import { debug } from '../lib/logger'

import Assign from './assign/assign.content'
import Sprint from './sprint/sprint.content'

function init() {
	Assign.init()
	Sprint.init()
}

export default {
	init
}
