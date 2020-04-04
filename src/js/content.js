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

	document.querySelectorAll('img.ghx-avatar-img').forEach(element => {
		if (element.getAttribute('listener') !== 'true') {
			element.addEventListener('click', (e) => {
				let parent = e.target.parentElement,
					issueId = parent.getElementsByClassName('ghx-key')[0].innerText

				e.preventDefault();

				console.log('BJU - Sending content message...')

				chrome.runtime.sendMessage(`{"type":"assign","values":{"issueId":"${issueId}"}}`)
			}, true)

			element.setAttribute('listener', 'true')
		}
	})
}

window.onload = init;
