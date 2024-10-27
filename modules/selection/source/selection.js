
export function Selection({ component, list, kind, selector }) {
	
	kind = kind || './item.html'
	selector = selector || 'div.row'
	let selected = null
	const selection = {
		add: (child) => add(child),
		remove: (child) => remove(child),
		clear: () => clear(),
		adjacent: (bias) => adjacent(bias),
		nearest: () => nearest()
	}
	install_focus()
	install_keyboard()
	return selection
	
	function add(child) {
		
		clear()
		child.element.querySelector(selector).classList.add('selected')
		selected = child
		system.focus = list
	}
	
	function remove(child) {
		
		if (child.is_template) return
		const element = child.element.querySelector(selector)
		if (element) element.classList.remove('selected')
	}
	
	function clear() {
		component.children.forEach((each) => remove(each))
	}
	
	function adjacent(bias) {
		
		let child = find_adjacent(bias)
		location.hash = child.data.link
	}
	
	function nearest() {
		
		if (select_child(1)) return true
		if (select_child(-1)) return true
		clear()
	}
	
	function select_child(bias) {
		
		const child = find_adjacent(bias)
		if (! child) return false
		add(child)
		location.hash = child.data.link
		return true
	}
	
	function install_focus() {
		
		list.addEventListener('focus',  event => {
			system.focus = list
			if (! selected) {
				const { next } = iterator()
				selection.add(next())
			}
		})
	}
	
	function install_keyboard() {
		
		component.element.addEventListener('keydown', (event) => {
			if (list != system.focus) return
			if (event.key == 'ArrowDown') selection.adjacent(1)
			if (event.key == 'ArrowUp') selection.adjacent(-1)
			if (event.key == 'ArrowDown' || event.key == 'ArrowUp') event.preventDefault()
		})
	}
	
	function find_adjacent(bias) {
		
		if (selected) {
			const index = component.children.indexOf(selected)
			const { next, previous } = iterator(index)
			const operation = bias > 0 ? next : previous
			return operation()
		} else {
			const { next } = iterator()
			return next()
		}
	}
	
	function iterator(index) {
		
		index = index || -1
		let child
		return {
			next: next,
			previous: previous
		}
		
		function next() {
			
			while (true) {
				child = component.child(++index)
				if (child && child.is_template) continue
				if (child && child.path != kind) continue
				if (child) return child
				else {
					index = -1
					return next()
				}
			}
		}
		
		function previous() {
			
			while (true) {
				child = component.child(--index)
				if (child && child.is_template) continue
				if (child && child.path != kind) continue
				if (child) return child
				else {
					index = component.children.length
					return previous()
				}
			}
		}
	}
	
}
