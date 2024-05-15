
import { Component } from 'component'

export function _() {
	
	Component.ready(function({ component, data, $ }) {
		
		const { item, link, bus } = data
		const { div, a } = component.get_elements(component.elements)
		
		Object.assign(a, { href: link, innerText: item.title })
		div[1].onmousedown = () => window.location.hash = link
		bus.on(`item-changed:${item.id}`, ({ item }) => {
			a.innerText = item.title
			item.done ? a.classList.add('done') : a.classList.remove('done')
			item.closed ? component.remove() : null
			item.closed ? location.hash = `#/tasks` : null
		})
	})
}
