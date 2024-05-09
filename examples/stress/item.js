
import { Component } from 'component'

export function _() {
	
	Component.ready(function({ component, data, $ }) {
		
		if (! data.item ) return						// because could be the template
		const { item, link, bus } = data
		const a = $('a.row')
		const div = $('div.row')
		a.href = link
		a.innerText = item.title
		div.onmousedown = function() {
			window.location.hash = link
		}
		bus.on(`item-changed:${item.id}`, function({ item }) {
			a.innerText = item.title
		})
	})
}
