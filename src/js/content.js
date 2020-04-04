import { local } from 'brownies'

let init = () => {
	// TODO: Load it when the UI is ready
	let avatarHtml = '<img src="https://wnl-platform-production-storage.s3.eu-central-1.amazonaws.com/public/unassigned.png" class="ghx-avatar-img" data-tooltip="Unassigned">'

	let issuesEndAreas = document.querySelectorAll('span.ghx-end')

	console.log('BJU' + avatarHtml)

	issuesEndAreas.forEach(e => {
		if (e.innerHTML.indexOf('ghx-avatar-img') === -1) {
			e.innerHTML = avatarHtml + e.innerHTML
		}
	})

	function sendMessage(params) {
		return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(params, (response) => {
				resolve(response)
			})
		})
	}

	async function getJiraUsers() {
		delete local.jiraUsers

		console.log(`BJU - getJiraUsers - typeof jiraUsers - ${local.jiraUsers}`)
		if (local.jiraUsers === null) {
			console.log(`BJU - getJiraUsers - sending message...`)

			let usersList = await sendMessage({ "action": "getJiraUsers" })

			console.log(`BJU - getJiraUsers - Received list - ${usersList}`)

			local.jiraUsers = usersList

			return usersList
		}

		console.log(`BJU - getJiraUsers - List found Local storage...`)
		return local.jiraUsers
	}

	async function assignUser(issueId, accountId) {
		chrome.runtime.sendMessage(
			{
				"action": "assignUser",
				"values": {
					"issueId": issueId,
					"accountId": accountId,
				},
			}
		)
	}

	async function createUsersDropdown() {
		console.log('BJU - createUsersDropdown')
		let html = ''
		let usersList = await getJiraUsers()

		usersList.forEach(user => {
			let listItem = `
				<li>
					<a href="" data-accountId="${user.accountId}">
						${user.displayName}
					</a>
				</li>
			`
			html += listItem
		})

		html = `
			<div id="usersDropdown" class="usersDropdown" data-issueKey="">
				<ul>
					${html}ą
				</ul>
			</div>
		`

		console.log('BSU - Users dropdown', html)

		document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', html)

		return
	}

	function bindUserAssign() {
		console.log('BJU - Bind user assign asdasdfasdfasdf')
		createUsersDropdown().then(() => {

			document.querySelectorAll('img.ghx-avatar-img').forEach(element => {
				if (element.getAttribute('listener') !== 'true') {
					element.addEventListener('click', (e) => {
						e.preventDefault()
						e.stopPropagation()

						let parent = e.target.parentElement
						let issueKey = parent.getElementsByClassName('ghx-key')[0].innerText
						let dropdown = document.getElementById('usersDropdown')

						console.log(`BJU - Bind assign ${issueKey}`)

						dropdown.setAttribute('data-issueKey', issueKey)
						dropdown.setAttribute('style',
						`display: inherit; top: ${e.clientY}px; left: ${e.clientX-150}px;`)
					}, true)

					element.setAttribute('listener', 'true')
				}
			})
		})
	}

	bindUserAssign()
}

window.onload = init;
