
import { Bus } from 'bus'

function Selection(component, selector) {
	
	selector = selector || 'div.row'
	const bus = new Bus()
	const selection = null
	
	install_keyboard()
	
	return {
		add: () => add(child),
		remove: () => remove(child),
		clear: () => clear()
	}
	
	function add(component) {
		
		clear()
		component.element.querySelector(selector).classList.add('selected')
	}
	
	function remove(component) {
		component.element.querySelector(selector).classList.remove('selected')
	}
	
	function clear() {
		component.children.forEach((each) => deselect(each))
	}
	
	install_keyboard() {
		
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


