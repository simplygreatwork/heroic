
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $, elements }) => {
		
		const { item, link, bus } = data
		const div = $('div.row'), a = $('a.row')
		
		Object.assign(a, { href: link, innerText: item.title })
		div.onmousedown = () => window.location.hash = link
		bus.on(`item-changed:${item.id}`, ({ item }) => a.innerText = item.title)
	})
}
