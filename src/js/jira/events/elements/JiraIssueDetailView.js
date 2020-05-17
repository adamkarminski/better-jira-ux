import { debug } from '../../../lib/logger'
import IsVisible from './JiraIssueDetailView/IsVisible'
import FinishedRerender from './JiraIssueDetailView/FinishedRerender'

const element = document.getElementById('ghx-detail-view')

function init() {
	if (element instanceof Node) {
		IsVisible.init(element)
		FinishedRerender.init(element)
	}
}

function disconnect() {
	IsVisible.disconnect()
	FinishedRerender.disconnect()
}

export default {
	init,
	disconnect
}
