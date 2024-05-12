
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $, elements }) => {
		
		const { item, link, bus } = data
		const div_row = $('div.row'), a_row = $('a.row')
		
		Object.assign(a_row, { href: link, innerText: item.title })
		div_row.onmousedown = () => window.location.hash = link
		bus.on(`item-changed:${item.id}`, ({ item }) => a_row.innerText = item.title)
	})
}
