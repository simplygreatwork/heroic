
const selector = '.content'

export class Focus {
	
	constructor() {
		
		const last = {}
		document.addEventListener('focusin', event => {
			uninstall(last)
			install(event.target.closest(selector))
		})
		
		// use class instead of style
		// how to handle arrow keys if editing an input? prohibit?
		// 	allow the field to have precedence (caret must be at right or left) 
		
		function install(element) {
			
			if (! element) return
			element.style.border = '1px solid orange'
			element.addEventListener('keydown', listen)
			last.element = element
			last.listener = listen
			const all = Array.from(document.querySelectorAll(selector))
			const closest = element.closest(selector)
			last.index = all.indexOf(closest)
		}
		
		function uninstall(last) {
			
			if (! last.element) return
			last.element.style.border = '0px'
			last.element.removeEventListener('keydown', last.listener)
		}
		
		function listen(event) {
			
			if (event.key == 'ArrowRight') next_panel(event)
			if (event.key == 'ArrowLeft') previous_panel(event)
		}
		
		// if next panel is showing, focus
		// if next panel is not showing, load it
		// if no child has focus, focus first child
		
		function next_panel(event) {
			
			const all = Array.from(document.querySelectorAll(selector))
			if (last.index >= all.length - 1) return
			uninstall(last)
			const element = all[last.index + 1]
			install(element)
			focus_first(element)
			event.preventDefault()
		}
		
		function previous_panel(event) {
			
			const all = Array.from(document.querySelectorAll(selector))
			if (last.index <= 0) return
			uninstall(last)
			const element = all[last.index - 1]
			install(element)
			focus_first(element)
			event.preventDefault()
		}
		
		function focus_first(element) {
			
			const selector = 'button, [href], input, [tabindex="0"]'
			const focusables = element.querySelectorAll(selector)
			const focusable = focusables[0]
			if (document.activeElement != focusable) focusable.focus()
		}
	}
}
