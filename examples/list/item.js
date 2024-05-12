
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $, elements }) => {
		
		const { item, link, bus } = data
		const a = $('a.row')
		const div = $('div.row')
		
		Object.assign(a, { href: link, innerText: item.title })
		div_row.onmousedown = () => window.location.hash = link
		bus.on(`item-changed:${item.id}`, ({ item }) => a_row.innerText = item.title)
	})
}
