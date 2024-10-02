
import { html } from './html.js'

export function list(data) {
	
	return html`
	<ul>
		${data.items.map(item => `<li>${item}</li>`).join('')}
	</ul>
	`
}
