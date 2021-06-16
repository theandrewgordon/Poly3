/*
 * @license
 *
 * IBM Confidential
 *
 * OCO Source Materials
 *
 * (C) COPYRIGHT IBM CORP. 2019
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 *
 * @Author Doug Wood
 */
import { PolymerElement, html } from '../@polymer/polymer/polymer-element.js';

import '../@polymer/paper-icon-button/paper-icon-button.js';
import '../@polymer/paper-input/paper-input.js';
import '../@polymer/paper-item/paper-item.js';
import '../@polymer/paper-tooltip/paper-tooltip.js';

class EmailAddress extends PolymerElement 
{
	static get template() {
		return html`
			<style>
				.body {
					padding          : 0;
					height           : 48px;
					display          : inline-flex;
					position         : relative;
				}
				.name {
					minwidth         : 40px;
					display          : inline-flex;
				}
				.lookup {
					display          : none;
					z-index          : 10;
					position         : absolute;
					top              : 52px;
					height           : 200px;
					padding          : 0;
					overflow         : auto;
					background       : white;
					box-shadow       : 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4);
				}
				.listitem {
					cursor           : pointer;
					padding          : 0;
					margin           : 2px;
					height           : 16px;
			        --paper-item-focused: {
						background-color : #204080;
						color            : white;
				        font-weight      : bold;
				     };
				}
				paper-icon-button {
					height           : 24px;
					width            : 24px;
					padding          : 2px;
					margin           : 0;
					display          : block;
				}
				paper-tooltip {
					background       : white;
					box-shadow       : 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4);
				}
  			</style>
			
			<div on-focusout="_onLooseFocus" class="body">
				<div id="lookup" class="lookup"  on-scroll="_scroll">
					<template id="peopelRepeat" is="dom-repeat" items="[[peoplelist]]">
						<paper-item value="[[item.displayName]]" on-click="_onItemSelect" on-keydown="_onKey" class="listitem">
							[[item.displayName]]
						</paper-item>
					</template>
				</div>

				<paper-input id="name" class="name"
				             label="Name" 
				             value="{{address.name}}" 
				             readonly="[[readonly]]"
				             on-focus="_onFocus"
				             on-input="_onInput"
				             on-keydown="_onKey">
	            </paper-input>
				<paper-tooltip for="name"  animation-delay="0">[[address.address]]</paper-tooltip>
				<div>
					<template is="dom-if" if="[[showcopy]]">
						<paper-icon-button on-click="_copy" icon="icons:content-copy" alt="Copy to Clipboard" title="Copy to Clipboard">
						</paper-icon-button>
					</template>
					<template is="dom-if" if="[[showdelete]]">
						<paper-icon-button on-click="_delete" icon="clear" alt="delete" title="delete">
						</paper-icon-button>
					</template>
				</div>
			</div>
		`;
	}

	static get is() { return 'email-address' }

    /**
	 * Fired when the delete button/icon is clicked
	 *
	 * @event email-address-delete
	 */

    /**
	 * Fired when when a search of available people and email addresses is needed.
	 * When the input field receives focus, when, when the user types in the input field, or when the down arrow
	 * key is pressed in the input field
	 *
	 * @event search
	 */

	static get properties() {
		return {
			address : {
				type     : Object,
				value    : { address : "", name : ""},
			},
			peoplelist : {
				type     : Array,
				observer : '_onPeopleListChanged'
			},
			readonly : {
				type     : Boolean,
				value    : true
			},
			showcopy : {
				type     : Boolean,
				value    : true
			},
		}
	}

	constructor()
	{
		super();
		this.hastooltip = false;
	}

	ready() 
	{
		super.ready();
		this.showdelete = !this.readonly;
		this.$.name.$.container.style.padding = 0;
	}
	
	openSearch()
	{
		if( this.$.lookup.style.display != "block" )
		{
			var width = this.$.name.clientWidth;
			this.$.lookup.style.display = "block";
			/*
			if( !this.top )
			{
				this.top   = this.$.lookup.offsetTop;
				this.$.lookup.style.top   = "" + (this.top + 52) + "px";
			}
			*/
			this.$.lookup.style.width = "" + (width + 38) + "px";
			return true;
		} 
		return false;
	}
	
	closeSearch()
	{
		this.$.lookup.style.display = "none";
		if( this.address && !this.address.address )
		{
			this.address.address = this.address.name;
		}
	}
	
	getSearchValue()
	{
		var search = this.$.name.value;
		if( search ) search = search.trim();
		return search;
	}
	
	_copy()
	{
		var el = document.createElement('textarea');
		el.value = this.address.address;
		el.setAttribute('readonly', '');
		el.style = {position: 'absolute', left: '-9999px'};
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}
	
	_delete()
	{
		this.dispatchEvent( new CustomEvent('email-address-delete', { bubbles: false, composed: true, detail: this.address } ));
	}
	
	_onFocus( event )
	{
		if( this.$.name.value && this.$.name.value.trim() != "" ) return;
		if( this.openSearch() )
		{
			this.dispatchEvent( new CustomEvent('search', { bubbles: false, composed: true, detail: this.getSearchValue() } ));
		}
	}
	
	_onInput( event	) 
	{
		if( this.address ) this.set( "address.address",  this.$.name.value );
		this.dispatchEvent( new CustomEvent('search', { bubbles: false, composed: true, detail: this.getSearchValue() } ));
	}
	
	_onItemSelect( event )
	{
		if( event.model.item.displayName && event.model.item.displayName != "" )
		{
			this.set( "address.name", event.model.item.displayName );
		}
		else
		{
			this.set( "address.name", event.model.item.scoredEmailAddresses[0].address );
		}
		this.set( "address.address", event.model.item.scoredEmailAddresses[0].address );

		this.closeSearch();
	}

	_onLooseFocus( event )
	{
		if( this.$.lookup.style.display == "block" )
		{
			var focusEll = event.relatedTarget;
			while( focusEll )
			{
				if( focusEll.host && focusEll.host == this )
				{ 
					return;
				}
				focusEll = focusEll.parentNode;
			}
			this.closeSearch();
		}
	}
	
	_onKey( event )
	{
		if( event.key != "ArrowDown" && event.key != "ArrowUp" ) return true;
		if( this.$.lookup.children.length == 0 ) return true;
		
		event.preventDefault();
		
		var activeItem = -1;
		var count = this.$.lookup.children.length - 1;	// DOM Repeat is last child
		for( var i = 0; i < count; i++ )
		{
			var item = this.$.lookup.children[i];
			if( item.active )
			{
				activeItem = i;
				break;
			}
		}
		
		if( activeItem >= 0 )
		{
			this.$.lookup.children[ activeItem ].active = false;
		}

		if( event.key == "ArrowDown"  )
		{
			this.openSearch();
			if( activeItem + 1 < count ) activeItem++;
		}
		if( event.key == "ArrowUp"  )
		{
			if( activeItem == 0 )
			{
				this.$.name.focus();
				return true;
			}
			this.openSearch();
			if( activeItem == -1 ) activeItem = count;
			if( activeItem > 0 ) activeItem--;
		}
		if( this.$.lookup.children[ activeItem ] )
		{
			this.$.lookup.children[ activeItem ].active = true;
			this.$.lookup.children[ activeItem ].focus();
		}
		
		return false;
	}
	
	_scroll( evt )
	{
		var client = evt.srcElement;
		var top = client.scrollTop;
		if( top < this.top )
		{
			this.top = top;
			return;
		}

		this.top = top;
		if(    client.scrollHeight > client.clientHeight		// Is data larger than window?
			&& top + client.clientHeight >= client.scrollHeight -20 )
		{
			this.dispatchEvent( new CustomEvent('next-page', { bubbles: false, composed: true, detail: this.getSearchValue() } ));
		}
	}

	_onPeopleListChanged( value )
	{
		if( !value || value.length == 0 ) this.closeSearch();
	}
}

customElements.define( EmailAddress.is, EmailAddress );
