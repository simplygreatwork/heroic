
import { html } from './html.js'

export function sample(data) {
	
	return html`
	<section>
		<span>Hello, my first name is ${data.first}</span> 
		<span>and my last name is ${data.last}!</span>
	</section>
	`
}
