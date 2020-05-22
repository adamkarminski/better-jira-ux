const config = {
	root: 'BJU'
}

export function debug(context, content) {
	if (process.env.NODE_ENV !== 'production') {
		console.log({
			...config,
			'context': context,
			'content': content
		})
	}
}
