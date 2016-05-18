# Bootstrap-FormForm

This is a complete rewrite of [cbergmiller's formform](https://github.com/cbergmiller/bootstrap-formform) JSON to Bootstrap 3 form renderer.

## Changes/differences

* dependency on underscore.js was entirely removed (hence the rewrite)
* support was added for:
 * addons
 * dropdowns
 * radiogroups
 * help-blocks
 * `.has-error` validation class
* support for IE8 (needs more testing)

## Compatibility issues:

"choices" were renamed "options" and is not an array, but an object with key-value pairs
selectmultiple2 is not implemented

## Example

no online example yet, in progress

## Dependencies

- jQuery
- Underscore.js
- Select2 (optional)

## Usage

```javascript
var fields, form;

fields = [
	{
		name: 'username',
		label: 'Benutzername',
		type: 'text'
	}, {
		name: 'password',
		label: 'Passwort',
		type: 'password'
	}, {
		label: 'Anmelden',
		type: 'submit',
		class: 'btn-default',
		icon: 'ok'
	}
];

form = new FormForm( $('form'), fields );
form.render();
```

## Options

### Horizontal forms

Horizontal forms are supported. Add `class="form-horizontal` to the form-tag.
