
import { html } from './html.js'

export function listing(data) {
	
	return html`
	<ul>
		${data.items.map(item => `<li>${item}</li>`).join('')}
	</ul>
	`
}
