
import { Component } from 'component'

export function _() {
	
	Component.ready(function({ component, data, $, elements }) {
		
		console.log(`elements: ${elements}`)
		let { item, link, bus } = data
		const div = $('div.row'), a = $('a.row')
		// const { div, a } = elements
		
		Object.assign(a, { href: link, innerText: item.title })
		div.onmousedown = () => window.location.hash = link
		bus.on(`item-changed:${item.id}`, ({ item }) => {
			a.innerText = item.title
			item.done ? a.classList.add('done') : a.classList.remove('done')
			if (item.closed) {
				component.remove()
				window.location.hash = `#/tasks`	
			}
		})
	})
}
