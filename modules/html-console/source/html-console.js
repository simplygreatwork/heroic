
let console_log = console.log
let selector_

export function console_init(selector) {
	
	selector_ = selector						// closure?
	console.log = function(message) {
		console_log_terminal(console, message)
		console_log_browser(console, message)
	}
}

export function console_log_terminal(console, string) {
	
	string = dedent(string)
	string = string.replaceAll('\t', '  ')
	console_log(string)
}

export function console_log_browser(console, string) {
	
	if (! window.document) return 
	string = dedent(string)		
	string = string.replaceAll(' ', '&nbsp;')
	string = string.replaceAll('\n', '<br>')
	string = string.replaceAll('\t', '&nbsp;&nbsp;')
	let div
	div = document.createElement('div')
	div.style.cssText = 'font-family:mono;font-size:75%'
	div.innerHTML = string
	console.selector = 'body'
	document.querySelector(selector_).appendChild(div)
}

function dedent(string) {
	
	let array = string.split('\n')
	if (array.length < 2) return string
	let delta = array[1].length - array[1].trimLeft().length
	return array.map(function(each) {
		return each.slice(delta)
	}).join('\n')
}
