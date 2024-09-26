
export function main() {
	
	const value = html`
	<div>
		<section>hello</section>
	</div>
	`
	console.log(`value: ${JSON.stringify(value)}`)	
}

function html(value) {
	
	let element = document.createElement('span')
	element.innerHTML = value
	return element.outerHTML
}
