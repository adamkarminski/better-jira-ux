import JiraIssueDetailView from '../elements/JiraIssueDetailView'
import JiraLoader from '../elements/JiraLoader'

function init() {
	JiraIssueDetailView.init()
	JiraLoader.init()
}

function disconnect() {
	JiraIssueDetailView.disconnect()
	JiraLoader.disconnect()
}

export default {
	init,
	disconnect
}
