import '../img/icon-128.png'
import '../img/icon-34.png'

console.log('BJU - Im from backgroundaa')

chrome.runtime.onMessage.addListener((message) => {
	var messageObject = JSON.parse(message)

	console.log('BJU - Halo')

	sendJiraRequest(`issue/${messageObject.values.issueId}/assignee`)
})
