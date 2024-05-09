
export class Scope {
	
	constructor(name) {
		
		this.name = name
		this.unpluggables = []
	}
	
	plug(fn) {
		this.unpluggables.push(fn)
	}
	
	unplug() {
		
		this.unpluggables.forEach(function(unplug) {
			unplug()
		})
	}
}
