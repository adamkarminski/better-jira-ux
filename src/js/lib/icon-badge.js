import { requiredOptions, areRequiredOptionsSet, doesUrlMatchBaseUrl } from '../config'
import { debug } from './logger'

const activeColor = '#5eba7d'
const warningColor = '#f5cc48'

function showActiveIconBadge() {
	chrome.browserAction.setBadgeText({text: 'ON'})
	chrome.browserAction.setBadgeBackgroundColor({color: activeColor})
}

function showWarningIconBadge() {
	chrome.browserAction.setBadgeText({text: 'WARN'})
	chrome.browserAction.setBadgeBackgroundColor({color: warningColor})
}

function hideIconBadge() {
	chrome.browserAction.setBadgeText({text: ''})
}

function setIconForActiveTab(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, currentTab => {
		if (typeof currentTab.url !== 'undefined') {
			debug('iconBadge::setIconForActiveTab::url', currentTab.url)

			setForUrl(currentTab.url)
		} else {
			debug('iconBadge::setIconForActiveTab', 'Current tab URL is undefined.')
		}
	})
}

const setForUrl = (url) => {
	if (typeof chrome.browserAction === 'undefined') {
		debug('iconBadge::setForUrl', 'chrome.browserAction is undefined, aborting.')

		return false
	}

	chrome.storage.sync.get(requiredOptions, (options) => {
		debug('iconBadge::setForUrl::options', options)

		if (!areRequiredOptionsSet(options)) {
			debug('iconBadge::setForUrl', 'Required options not set, show warning badge.')

			showWarningIconBadge()
		} else if (doesUrlMatchBaseUrl(url, options.baseUrl)) {
			debug('iconBadge::setForUrl', 'Required options set, show active badge.')

			showActiveIconBadge()
		} else {
			debug('iconBadge::setForUrl', 'Not a Jira tab, hide badge.')

			hideIconBadge()
		}
	})
}

const init = () => {
	debug('iconBadge::init', 'Initiating icon badge.')

	chrome.tabs.onActivated.addListener(setIconForActiveTab)
}

export default {
	init
}
