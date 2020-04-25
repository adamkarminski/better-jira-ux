import { isUndefined, isEmpty } from 'lodash'

import { debug } from './lib/logger'

export const requiredOptions = ['baseUrl', 'apiToken']
export const apiOptions = requiredOptions.concat(['usersMaxResults'])

export function areOptionsSet(options, optionsToCheck) {
	let value

	for (let i = 0; i < optionsToCheck.length; i++) {
		value = options[optionsToCheck[i]]

		if (isUndefined(value) || isEmpty(value)) {
			return false
		}
	}

	return true
}

export function areRequiredOptionsSet(options) {
	return areOptionsSet(options, requiredOptions)
}

export function doesLocationHrefMatchBaseUrl(baseUrl) {
	return doesUrlMatchBaseUrl(window.location.href, baseUrl)
}

export function doesUrlMatchBaseUrl(url, baseUrl) {
	debug('config::doesUrlMatchBaseUrl::url', url)
	debug('config::doesUrlMatchBaseUrl::baseUrl', baseUrl)

	return url.indexOf(baseUrl) > -1
}
