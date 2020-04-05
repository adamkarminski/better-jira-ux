const config = {
	root: 'BJU'
}

export function debug(context, content) {
	console.debug({
		...config,
		'context': context,
		'content': content
	})
}
