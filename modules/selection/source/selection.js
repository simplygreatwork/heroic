
export function Selection({ component, kind, selector }) {
	
	kind = kind || './item.html'
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
		
		if (select_child(1)) return true
		if (select_child(-1)) return true
		clear()
		return false
	}
	
	function select_child(bias) {
		
		const child = find_adjacent(selection, bias)
		if (! child) return false
		add(child)
		location.hash = child.data.link
		return true
	}
	
	function find_adjacent(child, bias) {
		
		let result =  null
		component.children.forEach((each, index) => {
			if (result) return
			if (each != child) return
			if (each.path != kind) return
			const adjacent = component.child(index + bias)
			if (! adjacent) return
			if (adjacent.path != kind) return
			if (adjacent.is_template) return
			result = adjacent
		})
		return result
	}
	
	function install_keyboard() {
		
		document.onkeydown = (event) => {
			if (event.key == 'ArrowDown') select_adjacent(1)
			if (event.key == 'ArrowUp') select_adjacent(-1)
		}
	}
	
	function select_adjacent(bias) {
		
		const child = find_adjacent(selection, bias)
		if (! child) return
		window.location.hash = child.data.link
		return true
	}
}
