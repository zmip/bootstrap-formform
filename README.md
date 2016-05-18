# Bootstrap-FormForm

This is a complete rewrite of [cbergmiller's formform](https://github.com/cbergmiller/bootstrap-formform) JSON to Bootstrap 3 form renderer. The main reason for this was to remove the dependency on underscore.js. The underscore.js string templating in the original bootstrap-formform was quickly getting unmanageable when more attrubutes/options/features were added.

## Changes/differences

* dependency on underscore.js was entirely removed (hence the rewrite)
* support was added for:
 * addons
 * dropdowns
 * radiogroups
 * help-blocks
 * `.has-error` validation class
* support for IE8 (needs more testing)
* render multiple forms

## Compatibility issues:

* `choices` were renamed `options` and is no longer an array, but an object with key-value pairs
* selectmultiple2 is not implemented
* `class` has been renamed `classes` because `class` is a reserved name in MSIE's DOM and because multiple classes can be applied using this property

## Example

no online example yet, but the formform_demo.html demo file will show what is possible.

## Dependencies

- jQuery
- Bootstrap JS (for dropdowns)

## Usage

```javascript

var form1_input = [
        {
            name: "username",
            label: "With placeholder and unspecified type",
            placeholder: "This is a placeholder"
        },
        {
            type: "button",
            label: "Primary",
            classes: "btn-primary"
        },
        {
            type: "button",
            label: "Info",
            classes: "btn-info"
        },
        {
            type: "button",
            label: "Success",
            classes: "btn-success",
        },
        {
            type: "button",
            label: "Button dropdown",
            dropdown":
            { 
                id_one: "Dropdown option 1",
                id_two: "Dropdown option 2",
                id_three: "Dropdown option 3"
            }
        },
        {
            type: "text",
            name: "withaddon",
            label: "With left-hand button addon of class 'btn-warning'",
            addons": 
            [
                {
                type: "button",
                classes: "btn-warning",
                label: "OK",
                icon: "ok"
                }
            ]
        },
        {
            type: "text",
            name: "withaddon2",
            label: "With left-hand button dropdown addon",
            addons": 
                [
                    {
                        type: "button",
                        label: "Choose...",
                        dropdown":
                        {
                            id_one12: "Addon dropdown 1",
                            id_two12: "Addon dropdown 2",
                            id_three12: "Addon dropdown 3"
                        }
                    }
                ]
        },
        {
            type: "text",
            name: "withaddon2",
            label: "With right-hand button and dropdown addon",
            "help-block": "Help-block: note that the alignment of the dropdown itself is adjusted",
            addons": 
                [
                    {
                        type: "button",
                        position: "right",
                        label: "OK",
                    },
                    {
                        type: "button",
                        position: "right",
                        label: "",
                        dropdown":
                        {
                            id_one1: "Addon dropdown 1",
                            id_two1: "Addon dropdown 2",
                            id_three1: "Addon dropdown 3"
                        }
                    }
                ]
        },
        {
            type: "radiogroup",
            name: "radiogrp",
            value: "no",
            label: "A radiobutton group (with additions, an experimental feature)",
            options":
            {
                no: "Yes, option 1, with 1 additional field",
                yes: "No, option 2, with 2 additional fields"
            }
        },
        {
            type: "text",
            name: "addition1",
            id: "addition1",
            classes: "addition",
            data: "for: "radiogrp_no"},
            label: "What is the cause of this?",
            value: ""
        },
        {
            type: "text",
            name: "addition2",
            id: "addition2",
            classes: "addition",
            data: "for: "radiogrp_yes"},
            label: "How many times in the past six months?",
            value: ""
        },
        {
            type: "text",
            name: "addition3",
            id: "addition3",
            classes: "addition",
            data: "for: "radiogrp_yes"},
            label: "Who is responsible for this?",
            value: ""
        },
        {
            type: "text",
            name: "withValue",
            label: "With value and error",
            value: "This is a value with <unsafe> \"characters\" & such",
            error: "This is the error message"
        },
        {
            type: "password",
            name: "password",
            label: "Password label with <unsafe> \"characters\""
        },
        {
            type: "textarea",
            name: "my_textarea",
            label: "A textarea with placeholder and value",
            value: "Remove this text to see the placeholder",
            placeholder: "This is a placeholder"
        },
        {
            type: "file",
            name: "file_upload",
            label: "A file input",
            btnlabel: "Choose a file...",
            icon: "file",
            classes: "btn-primary"
        },
        {
            type: "static",
            name: "static",
            label: "Bootstrap 'static' control",
            value: "This is static text"
        },
        {
            type: "select",
            name: "fruit",
            label: "Select input",
            value: "two",
            options": 
            { 
                one: "Option 1",
                two: "This is the selected option",
                three: "Option 3"
            }
        },
        {
            type: "submit",
            label: "Search",
            classes: "btn-default",
            icon: "search",
            id: "test_id",
            name: "test_name"
        }
        ];

var form2_input = [
        {
            name: "username",
            label: "This is form 2",
            placeholder: "This is a placeholder"
        },
        {
            type: "button",
            label: "Cancel",
            classes: "btn-default",
        },
        {
            type: "submit",
            label: "OK",
            position: "right",
            classes: "btn-primary",
            icon: "ok"
        }
    ];
	
var form = new FormForm( $('myform1'), form1_input );
form.render();

var form2 = new FormForm( $('myform2'), form2_input );
form2.render();

```

## Options

### Horizontal forms

Horizontal forms are supported. Add `class="form-horizontal` to the form-tag.
