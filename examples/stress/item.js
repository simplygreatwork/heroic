
import { Component } from 'component'

export function _() {
	
	Component.ready(function({ component, data, $, elements }) {
		
		const { item, link, bus } = data
		const { div, a } = elements
		
		Object.assign(a, { href: link, innerText: item.title })
		div.onmousedown = () => window.location.hash = link
		bus.on(`item-changed:${item.id}`, ({ item }) => a.innerText = item.title)
	})
}
