const config = {
	root: 'BJU'
}

export function debug(context, content) {
	if (process.env.NODE_ENV !== 'production') {
		console.debug({
			...config,
			'context': context,
			'content': content
		})
	}
}
