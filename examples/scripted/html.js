
export function html(strings, ...keys) {
	
	const result = []
	strings.forEach((string, index) => {
		result.push(string)
		if (keys[index]) result.push(keys[index])
	})
	const element = document.createElement('span')
	element.innerHTML = result.join('')
	return element.innerHTML
}
