
export function test_suite_new() {
	
	let tests = []
	let it = function(label, fn) {
		tests.push({ label: label, fn: fn })
	}
	return { tests, it }
}

export function test_suite_run(suite, done) {
	
	suite.passed = true
	test_suite_run_test(suite, 0, done)
}

export function test_suite_run_test(suite, index, done) {
	
	if (index === suite.tests.length) {
		done(suite.passed)
	} else {
		if (false) console.log(`Running "${suite.tests[index].label}"`)
		let test = suite.tests[index]
		let passed = test.fn(function(passed) {
			post_test(suite, index, done, test, passed)
		})
		post_test(suite, index, done, test, passed)
	}
}

function post_test(suite, index, done, test, passed) {
	
	if (passed !== undefined) {
		if (passed === false) suite.passed = false
		let label = test.label == '' ? `test ${index}` : test.label
		console.log(`${passed === false ? 'Failed test' : 'Passed test'} "${label}".`)
		test_suite_run_test(suite, ++index, done)
	}
}
