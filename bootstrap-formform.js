/* zmip Bootstrap formform v0.1
A JSON to Bootstrap 3 form generator based on the work of https://github.com/cbergmiller

https://github.com/zmip/bootstrap-formform
*/

var FormForm = (function () {

	function FormForm( parentForm, formData )
	{
		this.parentForm = parentForm;
		this.formData = formData;
		this.col1 = 4;
		this.col2 = 8;
		this.isHorizontal = parentForm.hasClass( 'form-horizontal' );
	}
	
	FormForm.prototype.unique_id = 1;
	
	// -----------------------------------------------------------------------------
	
	FormForm.prototype.createItem = function( itemData )
	{
		var type = itemData.type;
		
		if ( type == 'select' ) return new ElementSelect( itemData );
		else if ( type == 'textarea' ) return new ElementTextarea( itemData );
		else if ( type in { 'button':0, 'submit':0, 'reset':0 } ) return new ElementButton( itemData );
		else if ( type == 'static' ) return new ElementStatic( itemData );
		else if ( type == 'radiogroup' ) return new ElementRadiogroup( itemData );
		else if ( type == 'file' ) return new ElementFile( itemData );
		else if ( type == 'hidden' ) return new ElementHidden( itemData );
		else if ( type in {
			text:0,
			password:0,
			datetime:0,
			'datetime-local':0,
			date:0,
			month:0,
			time:0,
			week:0,
			number:0,
			email:0,
			url:0,
			search:0,
			tel:0,
			color:0,
			checkbox:0,
			radio:0
			} ) return new Element( itemData );
		
		if ( ! type ) return new Element( itemData );
		else throw new Error( 'unknown type: ' + itemData.type );
	}
	
	// -----------------------------------------------------------------------------
	
	FormForm.prototype.render = function ()
	{
		var i = 1000;
		var self = this; // will ECMA 6 finally fix this crap?
		var buttons = [];
		var btnsAlignRight = '';
		
		Element.prototype.isHorizontal = this.isHorizontal ? [this.col1, this.col2] : null;
		
		$.each( this.formData, function( index, itemData )
		{
			// create and render
			var item = self.createItem( itemData ).render();
			
			// filter out any buttons on the form root (with added whitespace for proper spacing)
			if ( itemData.type == 'submit' || itemData.type == 'button' )
			{
				if ( itemData.position == 'right' ) btnsAlignRight = ' text-right';
				buttons.push( item, "\n" );
			}
			else self.parentForm.append( item );

		} );

		// append buttons
		if ( buttons.length )
		{
			if ( this.isHorizontal )
			{
				// wrap buttons in 'col-sm-offset' div
				buttons = $('<div>').append( buttons );
				buttons.addClass( 'col-sm-offset-'
					+ Element.prototype.isHorizontal[0]
					+ ' col-sm-' + Element.prototype.isHorizontal[1]
					+ btnsAlignRight );

				
				buttons = $('<div>').addClass('form-group').append( buttons );
			}
			
			// enclose in 'form-group' and add to form
			self.parentForm.append( $('<div>').addClass('form-group'+btnsAlignRight).append( buttons ) );
		}
		

		
		// set up 'additions'
		this.setupAdditions();
		
	};

	// -----------------------------------------------------------------------------
	
	FormForm.prototype.setupAdditions = function ()
	{
		var additions = $('.addition', this.parentForm );
		if ( additions.length )
		{
			var focus = false;
			additions.each( function( index ) {
			
				var addition = $(this);
				var for_id = addition.data( 'for' );
				var for_elem = $('#'+for_id);
				if ( for_elem.length )
				{
					var name = for_elem.attr( 'name' );
					
					// get all other options with this name
					var options = $('[name='+name+']')

					if ( options.length )
					{
						var additionGroup = $(this).closest('div.form-group');

						options.each( function( index2 ) {
				
							if ( $(this).attr( 'id' ) == for_id && ! $(this).is( ':checked' ) )
							{
								focus = false;
								additionGroup.hide();
							}
							
							$(this).click( function( evt ) {
								
								if (  $(this).attr( 'id' ) == for_id ) additionGroup.slideDown( 'fast', function() {
						
										if ( ! focus && ! addition.val().length )
										{
											addition.focus();
											focus = true;
										}
									} );
								else
								{
									focus = false;
									additionGroup.slideUp( 'fast', function () {
										
										addition.val('');
									} );
								}
							} );
						} );
					}
				}
			} );
		}	
	}
	
	// -----------------------------------------------------------------------------
	// FormForm Elements
	// -----------------------------------------------------------------------------
	
	// default <input> constructor, functions as base class
	function Element( itemData )
	{
		// defaults
		this.classes = ['form-control'];
		
		// determine ID
		this.id = itemData.id ? itemData.id : ( itemData.name ? itemData.name : ( 'id_'+FormForm.prototype.unique_id++ ) );
		this.name = itemData.name ? itemData.name : this.id;
		
		// create default attributes
		this.attributes = { id: this.id, name: this.name };		

		// placeholder attribute
		if ( itemData.placeholder ) this.attributes.placeholder = itemData.placeholder;
		
		// data attribute(s)
		if ( itemData.data )
		{
			var self = this; // crap!
			$.each( itemData.data, function( key, val ) {
				
					self.attributes[ 'data-' + key ] = val;
				} );
		}
		
		// classes
		if ( itemData.classes ) this.classes.push( itemData.classes );
		
		// hang on to itemData
		this.itemData = itemData;
	}
	
	// ---------------------------------
	
	Element.prototype.createGroup = function( skip_attributes )
	{
		var group_elements = [];

		// add label (only on radiogroup a label is optional)
		if ( this.itemData.label || this.itemData.type != 'radiogroup' )
		{
			var label = $('<label>')
					.text( this.itemData.label ? this.itemData.label : 'always add a label' )
					.attr( 'for', this.attributes.id )
					.addClass( 'control-label' + ( this.isHorizontal ? ' col-sm-'+this.isHorizontal[0] : '' ) );
			group_elements.push( label );
		}
		
		// apply attributes *and* classes
		if ( ! skip_attributes ) this.applyAttributes();
		
		// create help-block
		var help_block = $('<span>' )
			.html( this.itemData.error ? this.itemData.error : this.itemData[ 'help-block' ] ? this.itemData[ 'help-block' ] : '' )
			.addClass( 'help-block' );
		
		// add element to group
		if ( this.isHorizontal )
		{
			var group2 = $('<div>').addClass( 'col-sm-'+this.isHorizontal[1] );
			group2.append( [ this.elem, help_block ] );
			group_elements.push( group2 );
		}
		else
		{
			group_elements.push( this.elem );
			group_elements.push( help_block );
		}
	
		// enclose in form-group
		var grp = $('<div>' )
			.append( group_elements )
			.addClass( 'form-group' );
		if ( this.itemData.error ) grp.addClass( 'has-error' );
		
		return grp;
	}

	// ---------------------------------

	Element.prototype.applyAttributes = function()
	{
		// add attributes
		this.elem.attr( this.attributes );
	
		// add classes
		if ( this.classes.length ) this.elem.addClass( this.classes.join( ' ' ) );	
	}
	
	// ---------------------------------

	Element.prototype.createAddons = function()
	{
		var addonsLeft = [];
		var addonsRight = [];
		var self = this; //sigh....
		
		// create addons
		$.each( this.itemData.addons, function( index, addonData ) {

			var addon = null;
			var dropdown = null;
			
			// button addon
			if ( addonData.type == 'button' )
			{
				addon = new ElementButton( addonData ).render( true );
				if ( addonData.dropdown ) dropdown = self.createDropdown( addonData.dropdown, addonData.position == 'right' );
			}
			
			// sort left/right
			if ( addon && addonData.position == 'right' )
			{
				addonsRight.push( addon );
				if ( dropdown ) addonsRight.push( dropdown );
			}
			else
			{
				addonsLeft.push( addon );
				if ( dropdown ) addonsLeft.push( dropdown );
			}
		} );
		
		// did addons render successfully?
		if ( addonsLeft.length || addonsRight.length )
		{
			// apply attributes and classes to 'this.elem'
			this.applyAttributes();
			
			// create enclosing 'input-group'
			var grp = $('<div>').addClass( 'input-group' );
			
			// enclose lefthand addons in 'input-group-btn' span and append
			if ( addonsLeft.length ) grp.append( $('<span>').addClass( 'input-group-btn' ).append( addonsLeft ) );
			
			// append this.elem
			grp.append( this.elem );

			// enclose righthand addons in 'input-group-btn' span and append
			if ( addonsRight.length ) grp.append( $('<span>').addClass( 'input-group-btn' ).append( addonsRight ) );
			
			// change this.elem to be the enclosing 'input-group'
			this.elem = grp;
			
			return this.createGroup( true );
		}
		
		// addons failed, return this.elem in enclosed form-group
		return this.createGroup();
	}
	
	// ---------------------------------
	
	Element.prototype.render = function()
	{
		if ( ! this.itemData.type ) this.elem = $('<input type="text">');
		else this.elem = $('<input type="'+this.itemData.type+'">');

		// set value (use 'undefined' check here to allow for falsy values, like 0)
		if ( typeof this.itemData.value != 'undefined' ) this.elem.val( this.itemData.value );
		
		// create (optional) addons and enclosing group
		if ( this.itemData.addons && this.elem.attr( 'type' ) in {
			text:0,
			password:0,
			datetime:0,
			'datetime-local':0,
			date:0,
			month:0,
			time:0,
			week:0,
			number:0,
			email:0,
			url:0,
			search:0,
			tel:0,
			color:0
			}  ) return this.createAddons();
		else return this.createGroup();
	}
	
	// ---------------------------------
	
	Element.prototype.createDropdown = function( options, right )
	{
		// create <ul>
		var dropdown = $('<ul>').addClass( 'dropdown-menu' + ( right ? ' dropdown-menu-right' : '' ) );
		
		// add <li> options
		$.each( options, function( id, label )
		{
			var a = $( '<a>' ).attr( { 'href':'#', 'id':id } ).text( label );
			dropdown.append( $('<li>').append( a ) );
		} );	
		
		return dropdown;
	}
	
	// -----------------------------------------------------------------------------
	
	// Using a dummy to hold the prototype for descendants of Element.
	// It is to avoid calling the Element constructor twice.
	// The constructor is *not* restored, there is no need for that here.
	// In ES5+ we could use Object.create() to more elegantly solve this
	
	var Tmp = function(){}; // 
	Tmp.prototype = Element.prototype;
	
	// ----------------------------------------------------------------------------- select

	function ElementSelect( itemData )
	{
		Element.call( this, itemData ); // call parent constructor

		// overrides
		this.elem = $('<select>');
	}
	
	ElementSelect.prototype = new Tmp();
	
	// ---------------------------------
	
	ElementSelect.prototype.render = function()
	{
		var options = [];
		$.each( this.itemData.options, function( val, label ) {
			options.push( $('<option>').val( val ).text( label ) );
			
		} );
		this.elem.append( options );
		
		// set value (use 'undefined' check here to allow for falsy values, like 0)
		if ( typeof this.itemData.value != 'undefined' ) this.elem.val( this.itemData.value );
		
		return this.createGroup();
	}
	
	// ----------------------------------------------------------------------------- button

	function ElementButton( itemData )
	{
		Element.call( this, itemData ); // call parent constructor

		// overrides
		this.elem = $('<button>').attr('type', itemData.type);
		this.nohelp = true;
		this.classes = ['btn'];
	}
	
	ElementButton.prototype = new Tmp();
	
	// ---------------------------------
	
	ElementButton.prototype.render = function( asAddon )
	{
		// add icon
		if ( this.itemData.icon ) this.elem.append( $('<span>')
										.addClass( 'glyphicon glyphicon-'+this.itemData.icon ) );

		// set label
		this.elem.append( $('<span>').text( 
			( this.itemData.icon ? ' ' : '' ) 
			+ this.itemData.label 
			+ ( this.itemData.dropdown ? ' ' : '' ) ) );

		// add dropdown adornments/attributes
		if ( this.itemData.dropdown )
		{
			this.elem.append( $('<span>').addClass( 'caret' ) );
			this.classes.push( 'dropdown-toggle' );
			this.attributes[ 'data-toggle' ] = 'dropdown';
		}
		
		// add custom or default class
		if ( this.itemData.classes ) this.classes.push( this.itemData.classes );
		else this.classes.push( 'btn-default' );

		// apply attributes and classes
		this.applyAttributes();
		
		// create dropdown 
		if ( ( ! asAddon ) && this.itemData.dropdown )
		{
			// create dropdown options
			var dropdown = this.createDropdown( this.itemData.dropdown, this.itemData.position == 'right' );
			
			// create enclosing btn-group and add btn and dropdown
			return $('<div>').addClass( 'btn-group' ).append( [ this.elem, dropdown ] );
		}
		
		return this.elem;
	}
	
	// ----------------------------------------------------------------------------- textarea

	function ElementTextarea( itemData )
	{
		Element.call( this, itemData ); // call parent constructor

		// overrides
		this.elem = $('<textarea>');
	}
	
	ElementTextarea.prototype = new Tmp();

	// ---------------------------------

	ElementTextarea.prototype.render = function()
	{
		// set value (use 'undefined' check here to allow for falsy values, like 0)
		if ( typeof this.itemData.value != 'undefined' ) this.elem.text( this.itemData.value );
		
		return this.createGroup();
	}

	// ----------------------------------------------------------------------------- static

	function ElementStatic( itemData )
	{
		Element.call( this, itemData ); // call parent constructor

		// overrides
		this.elem = $('<p>');
		this.classes = ['form-control-static'];
	}

	ElementStatic.prototype = new Tmp();

	// ---------------------------------

	ElementStatic.prototype.render = function()
	{
		// set value (use 'undefined' check here to allow for falsy values, like 0)
		if ( typeof this.itemData.value != 'undefined' ) this.elem.text( this.itemData.value );
		
		var grp = this.createGroup();
		
		// remove some attributes
		this.elem.removeAttr('name');
		$('label', grp ).removeAttr( 'for' );
		return grp;
	}
	
	// ----------------------------------------------------------------------------- file

	function ElementFile( itemData )
	{
		Element.call( this, itemData ); // call parent constructor

		// overrides
		this.classes = [ 'btn', 'btn-file' ];
	}

	ElementFile.prototype = new Tmp();

	// ---------------------------------

	ElementFile.prototype.render = function()
	{
		//TODO: improve this element:
		// - it's not working in IE8
		// - needs additional JS to show the file name
		
		// create the button from ElementButton with added 'btn-file' class
		var tmp_data = { 'label': ( this.itemData.btnlabel ? this.itemData.btnlabel : 'set "btnlabel" prop' ) };
		if ( ! this.itemData.classes ) tmp_data.classes = 'btn-default';
		else tmp_data.classes = this.itemData.classes;
		tmp_data.classes += ' btn-file';
		tmp_data.icon = this.itemData.icon;
		var btn = new ElementButton( tmp_data ).render();
		
		// apply some inline styles to hide the original file input
		// not very elegant, but removes the requirement of additonal CSS
		btn.css( {
			position: 'relative',
			overflow: 'hidden'
			} );
		
		// append the file input
		btn.append( $('<input type="file">').css( {
			position: 'absolute',
			top: 0,
			right: 0,
			'min-width': '100%',
			'min-height': '100%',
			'font-size': '100px',
			'text-align': 'right',
			filter: 'alpha(opacity=0)',
			opacity: 0,
			outline: 'none',
			background: 'none',
			cursor: 'inherit',
			display: 'block'
		} ) );
		
		//<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
		
		this.elem = $('<div>')
			.addClass( 'input-group' )
			.append( [	$('<label>').addClass( 'input-group-btn' ).append( btn ),
						$('<input type="text">').addClass( 'form-control' ).attr( 'readonly', '' ) ] );

		return this.createGroup( true );

	}
	
	// ----------------------------------------------------------------------------- hidden

	function ElementHidden( itemData )
	{
		Element.call( this, itemData ); // call parent constructor

		// overrides
		this.elem = $('<input type="hidden">');
	}

	ElementHidden.prototype = new Tmp();

	// ---------------------------------

	ElementHidden.prototype.render = function()
	{
		// add attributes
		this.applyAttributes();

		// set value (use 'undefined' check here to allow for falsy values, like 0)
		if ( typeof this.itemData.value != 'undefined' ) this.elem.val( this.itemData.value );

		return this.elem;
	}
	
	// ----------------------------------------------------------------------------- radiogroup

	function ElementRadiogroup( itemData )
	{
		Element.call( this, itemData ); // call parent constructor

		// overrides
		this.elem = $('<div>');
		this.classes = ['radio-group']; // this is not a Bootstrap class
	}

	ElementRadiogroup.prototype = new Tmp();

	// ---------------------------------

	ElementRadiogroup.prototype.render = function()
	{
		var options = [];
		var itemData = this.itemData;
		
		// add group label (optional)
		//if ( itemData.label ) this.elem.append( $('<label>').text( itemData.label ) );
		
		$.each( itemData.options, function( val, label ) {
			
			var input_elem = $( '<input type="radio">' )
				.attr( 'name', itemData.name )
				.attr( 'id', itemData.name + '_' + val )
				.val( val );
			if ( itemData.value == val ) input_elem.prop( 'checked', true );
			options.push( $('<div>')
				.addClass( 'radio' )
				.append( $('<label>')
					.text( label )
					.prepend( input_elem ) ) );
			
		} );

		// add classes
		this.elem.addClass( this.classes.join( ' ' ) );

		return this.createGroup( this.elem.append( options ), true );
	}

	// -----------------------------------------------------------------------------
	
	return FormForm;
	
})();

