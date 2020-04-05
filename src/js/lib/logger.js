const config = {
	root: 'BJU'
}

export function log (context, content) {
	console.log({
		...config,
		'context': context,
		'content': content
	})
}
