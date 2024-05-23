
export function Selection(component, selector) {
	
	selector = selector || 'div.row'
	let selection = null
	
	install_keyboard()
	
	return {
		add: (child) => add(child),
		remove: (child) => remove(child),
		clear: () => clear(),
		nearest: () => nearest()
	}
	
	function add(component) {
		
		clear()
		component.element.querySelector(selector).classList.add('selected')
		selection = component
	}
	
	function remove(component) {
		
		if (component.is_template) return 
		const element = component.element.querySelector(selector)
		if (element) element.classList.remove('selected')
	}
	
	function clear() {
		component.children.forEach((each) => remove(each))
	}
	
	function nearest() {
		
		if (! selection) return
		const children = component.children
		const index = children.indexOf(selection)
		if (index < 0) return
		let child = children[index + 1]
		if (! child) child = children[index - 1]
		if (! child) return
		if (! child.data.link) return
		add(child)
		location.href = child.data.link
	}
	
	function install_keyboard() {
		
		document.onkeydown = (event) => {
			if (event.key == 'ArrowDown') adjacent(1)
			if (event.key == 'ArrowUp') adjacent(-1)
		}
	}
	
	function adjacent(direction) {
		
		const child = find_adjacent(selection, direction)
		if (! child) return
		window.location.hash = child.data.link
		return true
	}
	
	function find_adjacent(child, direction) {
		
		component.children.forEach((each, index) => {
			if (each == child) return component.child(index + direction)
		})
	}
}
