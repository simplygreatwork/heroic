
# Intro

Create an html page "index.html"

```html
<html></html>
```

Add a component.

```html
<div name="child" data-component="./child.html"></div>
```

When "index.html" loads, "./child.html" loads, and Component.start runs.

```javascript
Component.start(({ component }) => { ... })
```

Redirect the child component to show other content.

```javascript
Component.start(({ component }) => {
	component.child('child').redirect('./another.html')
})
```

# Routing

Watch a url endpoint.

```javascript
router.register('products', {
	enter: () => { ... }
})
```

Redirect a child component.

```javascript
router.register('products', {
	enter: () => child.redirect('./products.html')
})
```

Inject data from the router's url into the component.

```javascript
router.register('products', {
	enter: (data) => child.redirect('./products.html', data)
})
```

The router provides path, last path part, index of the last path part, and matched values.

```javascript
router.register('products', {
	enter: ({ path, part, index, values }) => child.redirect('./products.html', { path, part, index, values })
})
```

After "products.html" loads, watch another endpoint: "products/:id".

```javascript
router.register('products/:id', {
	enter: () => { ... }
})
```

A path part beginning with a colon represents a variable; e.g. ":product_id"

```javascript
router.register('products/:product_id', {
	enter: ({ values }) => {
		const product_id = values.product_id
	}
})
```

You pass these values, which contain "product_id", along to the next component, "product.html"

```javascript
router.register('products/:product_id', {
	enter: ({ values, then }) => child.redirect('./product.html', { values }, then )
})
```

Register "enter" and "exit" handlers. When the url changes and a path part appears, it enters. When a path part leaves, it exits.

```javascript
router.register('products', {
	enter: ({ then }) => child.redirect('./products.html', {}, then ),
	exit: ({ then }) => child.redirect('./empty.html', {}, then )
})
```

Imagine, the url changes from "1/2/3" to "1/b/c". "3" exits. "2" exits. "b" enters. "c" enters.

Handlers are called only when a change to each url path part is detected.

```javascript
router.register('products', {
	enter: ({ then }) => child.redirect('./products.html', {}, then ),
	exit: ({ then }) => child.redirect('./empty.html', {}, then )
})
router.register('products/:product_id', {
	enter: ({ then }) => child.redirect('./product.html', {}, then ),
	exit: ({ then }) => child.redirect('./empty.html', {}, then )
})
```

- When the url changes from "" to "products", "products" will enter.
- When the url changes from "products" to "products/1", "products/:product_id" will enter.
- When the url changes from "products/1" to "products", "products/:product_id" will exit.
- When the url changes from "products" to "", "products" will exit.

# Components

Components are always created inside the html.

```html
<div name="child" data-component="./child.html"></div>
```

Find a component's child by it's name.

```javascript
Component.ready(({ component }) => {
	const child = component.child('name')
})
```

Or find a component's child by it's index.

```javascript
Component.ready(({ component }) => {
	const child = component.child(0)
})
```

Redirect a child component.

```javascript
Component.ready(({ component }) => {
	const child = component.child('name')
	child.redirect('./another.html')
})
```

Clone a component.

```javascript
Component.ready(({ component }) => {
	const clone = component.child('template').clone()
})
```

When you clone a component, it's inserted in the DOM directly above the subject. This is mostly used for creating lists of items.

# Cloud

Create a cloud and share it.

```javascript
const cloud = Cloud()
```

Service providers subscribe and listen to the cloud.

```javascript
const { on_set, on_get } = cloud
on_set((key, value) => { ... })
on_get((key) => { ... })
```

Send a value to the cloud.

```javascript
const { set } = cloud
set('key', 'value')
```

Watch for a value to change.

```javascript
const { on_change } = cloud
on_change('key', (key, value, old) => { ... })
```

Interact with data in the cloud. Announce changes and requests. Providers listen to changes and provide responses.

# Bind


# Scope

Clouds have a scope.

```javascript
const scope = cloud.scope
```

Register functions to cleanup for when you're finished with a scope.

```javascript
const off = register_some_event_listener()
scope.plug(off)
```

When you're finished with a scope, unplug to dispose.

```javascript
scope.unplug()
```

This scope is unplugged and disposed when the router path part exits.

```javascript
router.register(`realm`, {
	exit: () => cloud.scope.unplug()
})
```
