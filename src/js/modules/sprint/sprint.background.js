import { debug } from '../../lib/logger'
import { jiraSprintSwap } from '../../lib/jira-web-api'

async function swap(params) {
	let response = await jiraSprintSwap(params.sprintId, params.sprintToSwapWith)

	return response
}

export default {
	swap
}
