export function function sendMessage(params) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(params, (response) => {
			resolve(response)
		})
	})
}
