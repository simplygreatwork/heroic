
let active = null

export function Selection({ component, kind, selector }) {
	
	kind = kind || './item.html'
	selector = selector || 'div.row'
	let selected = null
	let selection = {
		add: (child) => add(child),
		remove: (child) => remove(child),
		clear: () => clear(),
		adjacent: (bias) => adjacent(bias),
		nearest: () => nearest()
	}
	install_keyboard()
	return selection
	
	function add(child) {
		
		clear()
		child.element.querySelector(selector).classList.add('selected')
		selected = child
		active = selection
	}
	
	function remove(child) {
		
		if (child.is_template) return
		const element = child.element.querySelector(selector)
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
	
	function adjacent(bias) {
		
		const child = find_adjacent(bias)
		if (! child) return
		location.hash = child.data.link
		return true
	}
	
	function select_child(bias) {
		
		const child = find_adjacent(bias)
		if (! child) return false
		add(child)
		location.hash = child.data.link
		return true
	}
	
	function install_keyboard() {
		
		document.addEventListener('keydown', (event) => {
			if (selection != active) return
			if (event.key == 'ArrowDown') selection.adjacent(1)
			if (event.key == 'ArrowUp') selection.adjacent(-1)
		})
	}
	
	function find_adjacent(bias) {
		
		let result =  null
		component.children.forEach((each, index) => {
			if (result) return
			if (each != selected) return
			if (each.path != kind) return
			const adjacent = component.child(index + bias)
			if (! adjacent) return
			if (adjacent.path != kind) return
			if (adjacent.is_template) return
			result = adjacent
		})
		return result
	}	
}
