
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { item, link, bus } = data
		const { div, a } = $()
		
		Object.assign(a, { href: link, innerText: item.title })
		div[1].onmousedown = () => window.location.hash = link
		bus.on(`item-changed:${item.id}`, ({ item }) => a.innerText = item.title)
	})
}
