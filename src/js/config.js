import { isUndefined, isEmpty } from 'lodash'

export const requiredOptions = ['baseUrl', 'apiToken']

export function areRequiredOptionsSet(options) {
	let value

	for (let i = 0; i < requiredOptions.length; i++) {
		value = options[requiredOptions[i]]

		if (isUndefined(value) || isEmpty(value)) {
			return false
		}
	}

	return true
}
