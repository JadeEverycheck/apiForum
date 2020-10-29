function createElement(e) {
	if (typeof e === "string") {
		return document.createTextNode(e)
	}
	const element = document.createElement(e.tag)
	for (const key in e.properies){
		element[key] = e.properies[key]
	}
	if (e.children !== undefined) {
		for (const child of e.children) {
			element.appendChild(createElement(child))
		}
	}
	return element
}