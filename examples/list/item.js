
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $, elements }) => {
		
		const { item, link, bus } = data
		const div_ = $('div.row'), a_ = $('a.row')
		
		Object.assign(a_, { href: link, innerText: item.title })
		div_.onmousedown = () => window.location.hash = link
		bus.on(`item-changed:${item.id}`, ({ item }) => a_.innerText = item.title)
	})
}
