import { isUndefined, isEmpty } from 'lodash'

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
	return window.location.href.indexOf(baseUrl) > -1
}
