export const findElementByClassName = (elementsList, className) => {
	for (let i = 0; i < elementsList.length; i++) {
		if (elementsList[i].className.indexOf(className) > -1) {
			return elementsList[i]
		}
	}

	return false;
}
