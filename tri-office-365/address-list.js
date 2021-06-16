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
import '../@polymer/paper-dialog/paper-dialog.js';
import '../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../@polymer/paper-item/paper-item.js';
import '../office-365/outlook-people-ds.js';
import './email-address.js';

class AddressList extends PolymerElement 
{
	static get template() {
		return html`
			<style>
				.header {
					width            : 100%; 
				}
				paper-icon-button.icons {
					height           : 48px;
					width            : 48px;
					padding          : 8px;
				}
				div.icons {
					display          : inline-flex;
					float            : right;
				}
				paper-dialog.lookup {
					padding          : 5px;
					width            : 300px;
					height           : 500px;
				}
				paper-dialog-scrollable {
					width            : 100%;
					height          : 350px;
					margin           : 0;
				}
				paper-input {
					margin          : 0;
					padding         : 0;
				}
				div.addresses {
					min-height       : 62px;
				}
				div.lookup {
					width            : 100%;
					height           : 300px;
				}
				div.list {
					height          : 350px;
					width           : 100%;
					padding         : 0;
					margin          : 0;
				}
				.listitem {
					cursor           : pointer;
					padding          : 0;
					margin           : 2px;
					height           : 16px;
					background-color : #B0BEC5;
				}
				.title {
					width            : 100%; 
				}
				paper-button {
					background-color : #204080;
					color            : white;
				}		
			</style>

			<div class="header">
				<slot id="titleSlot" name="title" class="title"></slot>
			</div>
			<div class="addresses">
				<template id="repeat" is="dom-repeat" items="[[addresses]]">
					<email-address address="{{item}}" readonly="[[readonly]]"
					               on-email-address-delete="_onAddressDelete"
					               on-search="_onAddressEdit"
					               on-next-page="_onAddressPage">
					</email-address>
				</template> 
					<div class="icons">
						<template is="dom-if" if="[[showadd]]">
							<paper-icon-button id="search" icon="add" on-click="_onAdd" class="icons"></paper-icon-button>
						</template>
						<template is="dom-if" if="[[showlookup]]">
							<paper-icon-button id="search" icon="search" on-click="_onLookup" class="icons"></paper-icon-button>
						</template>
					</div>
				</template>
			</div>

			<paper-dialog id="searchPoepleDlg" class="lookup">
				<h2 style="padding:0px; margin:0px;">People Lookup</h2>
				<paper-input id="peopleSearch" label="Address" value="{{peopleSearch}}" on-on-input="_onSearchKey"></paper-input>
				<div class="list">
					<paper-dialog-scrollable id="scroller" >
						<template id="repeat" is="dom-repeat" items="[[peoplelist]]">
							<paper-item value="{{item.from.emailAddress.name}}" on-click="_addPerson" class="listitem">
								{{item.displayName}}
							</paper-item>
						</template>
					</paper-dialog-scrollable>
				</div>
				<div class="buttons">
					<paper-button dialog-dismiss="" autofocus="" raised="">Cancel</paper-button>
				</div>
			</paper-dialog>

			<outlook-people-ds id="peopleStorage" authtoken="[[authtoken]]" peoplelist="{{peoplelist}}" 
			                fieldlist="[[fieldList]]"
			                on-people-list="_onPeopleList"
			                onoffice-365-http-error="_onHttpError">
			</outlook-people-ds>
		`;
	}

	static get is() { return 'address-list' }

	static get properties() {
		return {
			addresses : {
				type     : Array,
				notify   : true,
			},
			authtoken : {
				type     : String,
			},
			readonly : {
				type     : Boolean,
				value    : false,
				observer : 'onReadOnlyChanged'
			},
			showadd : {
				type     : Boolean,
				value    : true,
			},
			showlookup : {
				type     : Boolean,
				value    : false,
			},
		}
	}

	constructor()
	{
		super();
		this.peoplelist = [];
		this.fieldList = [
			"displayName",
			"scoredEmailAddresses"
		]
	}

	ready() 
	{
		super.ready();
		window.addEventListener( "office-365-authenticate", ( evt ) => { this._onAuthenticate( evt ); } );

		if( this.readonly )
		{
			this.set( "showlookup", false );
			this.set( "showadd", false );
		}
		if( !this.addresses ) this.addresses = [];
		
		this.$.scroller.$.scrollable.onscroll = ( evt )=>{ this._scroll( evt ) };
	}
	
	_onAdd(
		event
	) {
		if( !this.addresses ) this.addresses = [];
		var newAddress = {
			name    : "",
			address : ""
		};
		this.push( "addresses", newAddress );
		this.$.repeat.render();
	}

	// Popup lookup dialog
	_onLookup(
		event
	) {
		this.peopleSearch = "";
		this.$.peopleStorage.getList();
		this.$.searchPoepleDlg.open();
	}

	// Search in lookup dialog
	_onSearchKey(
		event
	) {
		this.$.peopleStorage.getList( this.$.peopleSearch.value );
	}
	
	_onAddressEdit( event )
	{
		this.activeEll = event.srcElement;
		if( !this.activeEll ) return;
		this.$.peopleStorage.getList( this.activeEll.getSearchValue() );
	}
	
	_onAddressPage( event )
	{
		this.activeEll = event.srcElement;
		if( !this.activeEll ) return;
		this.$.peopleStorage.getNextPage();
	}
	
	_onPeopleList( 
		event 
	) {
		if( this.activeEll )
		{
			this.set( "activeEll.peoplelist", event.detail );
			if( event.detail.length > 0 )
			{
				this.activeEll.openSearch()
			}
		}
	}
	
	_onHttpError(
		event
	) {
		event.stopPropagation();
	}

	_accept(
		event
	) {
		if( !this.addresses ) this.addresses = [];
		var newAddress = {
				name    : this.peopleSearch,
				address : this.peopleSearch
			};
		this.push( "addresses", newAddress );
		this.$.repeat.render();
		this.$.searchPoepleDlg.close();
	}
	
	_addPerson(
		event 
	) {
		if( !this.addresses ) this.addresses = [];
		var newAddress = {
			name    : event.model.item.displayName,
			address : event.model.item.scoredEmailAddresses[0].address
		};
		this.push( "addresses", newAddress );
		this.$.repeat.render();
		this.$.searchPoepleDlg.close();
	}
	
	_onAddressDelete(
		event
	) {
		if( this.addresses )
		{
			for( var i = 0; i < this.addresses.length; i++ )
			{
				if( this.addresses[i].address == event.detail.address )
				{
					this.splice( "addresses", i, 1 );
					break;
				}
			}
		}
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
			&& top + client.clientHeight >= client.scrollHeight -20 
			&& this.$.peopleStorage.hasnextpage )
		{
			this.$.peopleStorage.getNextPage();
		}
	}

	onReadOnlyChanged(
		newValue, oldValue
	) {
		if( newValue )
		{
			this.set( "showlookup", false );
			this.set( "showadd", false );
			this.$.lookup.render();
		}
	}
	
	_onAuthenticate( event )
	{
		this.authtoken = event.detail;
	}
}

customElements.define( AddressList.is, AddressList );
