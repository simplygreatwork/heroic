
import { Component } from 'component'
import { bind } from 'bind'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { item, link, selection, bus, scope } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		
		bind(div[1], 'mousedown', () => {
			location.hash = link
			selection.add(component)
		}, scope)
		
		bus.on(`item-changed:${item.id}`, (item) => {
			a.innerText = item.title
			item.done ? a.classList.add('done') : a.classList.remove('done')
			if (! item.closed) return
			const nearest = selection.nearest()
			nearest ? false : location.hash = `#/tasks`
			component.remove()
		}, scope)
	})
}
