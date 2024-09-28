
import { Component } from 'component'

export function _() {
	
	Component.ready(function({ component, data, $ }) {
		
		const { item, link, selection, bus } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		div[1].onmousedown = () => {
			selection.add(component)
			location.hash = link
		}
		bus.on(`item-changed:${item.id}`, (item) => {
			a.innerText = item.title
			item.done ? a.classList.add('done') : a.classList.remove('done')
			if (! item.closed) return
			const nearest = selection.nearest()
			nearest ? false : location.hash = `#/tasks`
			component.remove()
		})
	})
}
