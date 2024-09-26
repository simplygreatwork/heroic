
import { Component } from 'component'

let counter = 0

export function _() {
	
	Component.ready(({ component, $ }) => {
		counter++
		$('.value').innerText = counter
		console.log(`counter: ${counter}`)
	})
}
