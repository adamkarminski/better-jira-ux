export const findElementByClassName = (elementsList, classToCheck) => {
	for (let i = 0; i < elementsList.length; i++) {
		if (typeof elementsList[i].className !== 'undefined' && elementsList[i].className.indexOf(classToCheck) > -1) {
			return elementsList[i]
		}
	}

	return false;
}
