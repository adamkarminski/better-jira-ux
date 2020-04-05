import { local } from 'brownies'

let init = () => {
	// TODO: Move it to a function
	let unassignedAvatarURL = 'https://wnl-platform-production-storage.s3.eu-central-1.amazonaws.com/public/unassigned.png'
	let backlog = document.getElementById('ghx-backlog')
	let board = document.getElementById('ghx-pool')
	let issuesContainer, avatarContainer, unassignedAvatarHTML, avatarContainerSelector

	if (backlog !== null) {
		console.log('BJU - It is a backlog')
		issuesContainer = backlog
		avatarContainerSelector = 'span.ghx-end'
		unassignedAvatarHTML = `
			<img src="${unassignedAvatarURL}" class="ghx-avatar-img" data-tooltip="Unassigned">
		`
	} else if (board !== null) {
		console.log('BJU - It is a board')
		issuesContainer = board
		avatarContainerSelector = 'div.ghx-stat-2'
		unassignedAvatarHTML = `
			<span class="ghx-field">
				<img src="${unassignedAvatarURL}" class="ghx-avatar-img" data-tooltip="Unassigned">
			</span>
		`
	} else {
		console.log('BJU - Not a project page')
		return false;
	}


	let issuesAvatarContainers = issuesContainer.querySelectorAll(
		avatarContainerSelector
	)

	issuesAvatarContainers.forEach(e => {
		if (e.innerHTML.indexOf('ghx-avatar-img') === -1) {
			e.innerHTML = unassignedAvatarHTML + e.innerHTML
		}
	})

	function findElementByClassName(elementsList, className) {
		console.log('BJU - findElementByClassName')
		console.log(className)
		console.log(elementsList)

		for (let i = 0; i < elementsList.length; i++) {
			console.log(elementsList[i].className)
			if (elementsList[i].className.indexOf(className) > -1) {
				return elementsList[i]
			}
		}

		return false;
	}

	function sendMessage(params) {
		return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(params, (response) => {
				resolve(response)
			})
		})
	}

	async function getJiraUsers() {
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

	async function assignUser(issueKey, accountId) {
		chrome.runtime.sendMessage(
			{
				"action": "assignUser",
				"params": {
					"issueKey": issueKey,
					"accountId": accountId,
				},
			}
		)
	}

	async function createUsersDropdown() {
		console.log('BJU - createUsersDropdown')
		let node = document.createElement('div')
		let html = ''
		let usersList = await getJiraUsers()
		let activeUsers = usersList.filter(
			user => user.accountType === 'atlassian' && user.active
		)

		activeUsers.unshift({
			'accountId': '',
			'avatarUrls': {
				'32x32': unassignedAvatarURL
			},
			'displayName': 'Unassigned',
		})

		activeUsers.forEach(user => {
			let listItem = `
				<div class="usersDropdownItem" data-accountId="${user.accountId}">
					<img class="usersDropdownImage" src="${user.avatarUrls['32x32']}">
					<span class="usersDropdownText">${user.displayName}</span>
				</div>
			`
			html += listItem
		})

		node.innerHTML = `
			<div id="usersDropdown" class="usersDropdown" data-issueKey="">
				<div class="usersDropdownControls">
					<input type="text" class="usersDropdownFilter">
					<span class="usersDropdownRefresh">♻️</span>
				</div>
				${html}
			</div>
		`

		document.getElementsByTagName('body')[0].appendChild(node)

		let dropdown = document.getElementById('usersDropdown')

		dropdown.getElementById('')

		dropdown.querySelectorAll('.usersDropdownItem').forEach((element) => {
			element.addEventListener('click', (e) => {
				console.log(e)
				console.log(e.path)

				let itemElement = findElementByClassName(e.path, 'usersDropdownItem')
				if (itemElement === false) {
					console.log('No element found')
					return
				}

				console.log(itemElement)

				let dropdown = itemElement.parentElement
				let image = itemElement.getElementsByClassName('usersDropdownImage')[0]
				let accountId = itemElement.getAttribute('data-accountId')
				let issueKey = dropdown.getAttribute('data-issueKey')

				console.log({
					'accountId': accountId,
					'issueKey': issueKey,
				})

				assignUser(issueKey, accountId).then((response) => {
					let activeIssue = issuesContainer
						.querySelectorAll(`div.js-issue[data-issue-key=${issueKey}]`)[0]
					let activeIssueAvatar = activeIssue.getElementsByClassName('ghx-avatar-img')[0]

					document.getElementById('usersDropdown').setAttribute(
						'style', 'display: none;'
					)

					activeIssueAvatar.setAttribute('style', '')
					activeIssueAvatar.setAttribute('src', image.getAttribute('src'))
				})
			})
		})

		document.addEventListener('click', (e) => {
			if (e.target.className.indexOf('usersDropdown') === -1) {
				document.getElementById('usersDropdown').setAttribute(
					'style', 'display: none;'
				)
			}
		})

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
