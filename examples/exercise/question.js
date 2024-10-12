
import { Component } from 'component'
import { bind } from 'bind'

export function _() {
	
	Component.ready(({ component, data, $ }) => {
		
		const { item, link, bus, cloud } = data
		const { div, h3, input } = $()
		
		Object.assign(h3, { href: link, innerText: item.title })
		bind(input[3], 'click', (event) => {
			event.preventDefault()
			const answer = $(':checked').value
			bus.emit('submitted', { item, answer })
			// cloud.on_change((key, value) => {
			// 	console.log(`cloud change: ${key} ${value}`)	
			// })
			// cloud.update(`scores/${item.id}`, value, item)
			// cloud.set(`scores/${item.id}`, [])
			// cloud.get(`scores/${item.id}`, (score) => {
			// 	console.log('got')
			// 	score = score || []
			// 	score.push(true)
			// 	cloud.set(`scores/${item.id}`, score)
			// })
		}, cloud.scope)
	})
}
