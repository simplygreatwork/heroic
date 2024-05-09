
import { Component } from 'component'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		if (! data.item ) return
		const { item, link, bus } = data
		const a = $('a.row')
		const div = $('div.row')
		a.href = link
		a.innerText = item.title
		div.onmousedown = () => {
			window.location.hash = link
		}
		bus.on(`item-changed:${item.id}`, ({ item }) => {
			a.innerText = item.title
		})
	})
}
