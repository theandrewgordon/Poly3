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
import './message-box.js';

var __dictionary__RESTError       = "REST Error";
var __dictionary__AuthError       = "Exchange Authentication Error";
var __dictionary__ServiceError    = "Exchange Service Error";
var __dictionary__TimeStamp       = "Time Stamp";

var __dictionary__AccessDenied     = "Access Denied";

var __dictionary__OAuth            = "Microsoft Login";
var __dictionary__Profile          = "Office 365 Profile";
var __dictionary__EventList        = "Event List";
var __dictionary__EventInstance    = "Event Instance";
var __dictionary__EventCreate      = "Create Event";
var __dictionary__EventUpdate      = "Update Event";
var __dictionary__FreeBusyList     = "FreeBusy List";
var __dictionary__TimeZoneList     = "Time Zone List";

var __dictionary__TririgaUsert     = "TRIRIGA User Lookup";
var __dictionary__UserList         = "User List";
var __dictionary__UserCreate       = "User Create";
var __dictionary__UserUpdate       = "User Update";
var __dictionary__UserDetail       = "User Detail";
var __dictionary__UserDelete       = "User Delete";
var __dictionary__UserMe           = "Get Current User";


const SOURCES = {
	"Office365-OAuth" : 	 __dictionary__OAuth, 
	"Office365-Profile" :    __dictionary__Profile,
	"Event List" : 	         __dictionary__EventList, 
	"Event Instance" : 	     __dictionary__EventInstance, 
	"Create Event" : 	     __dictionary__EventCreate, 
	"Update Event" : 	     __dictionary__EventUpdate, 
	"FreeBusy List" : 	     __dictionary__FreeBusyList, 
	"Time Zone List" :       __dictionary__TimeZoneList,
	"TRIRIGA User" :         __dictionary__TririgaUsert,
	"User List" :            __dictionary__UserList,
	"User Create" :          __dictionary__UserCreate,
	"User Detail" :          __dictionary__UserDetail,
	"User Delete" :          __dictionary__UserDelete,
	"User Me" :              __dictionary__UserMe,

}

class MessageMgr extends PolymerElement 
{
	static get is() { return 'message-mgr' }
	
	ready()
	{
		super.ready();

		window.addEventListener( "reserve-message",       ( evt ) => { this._onMessage( evt ); } );
		window.addEventListener( "tririga-http-error",    ( evt ) => { this._onHTTPError( evt ); } );
		window.addEventListener( "office-365-http-error", ( evt ) => { this._onHTTPError( evt ); } );
		window.addEventListener( "office-365-auth-error", ( evt ) => { this._onAuthError( evt ); } );
	}
	
	displayHttpError(
		message
	) {
		var value = {
			"title"  : "",
			messages : []
		}
		
		if( message.source )
		{
			value.messages.push( SOURCES[ message.source ] ? SOURCES[ message.source ] :  message.source );
		} 
		if( message.object ) value.messages.push( message.object );
		if( message.response )
		{
			value.label = "HTTP " + message.response.status;
			message.response.text().then(
				( data ) => {
					if( data && data != "" )
					{
						try
						{
							var json = "";
							json = JSON.parse( data );
							
							// No session established
							if( message.response.status == 401 )
							{
								value.title = __dictionary__AuthError;
							}
							else if( message.response.status == 403  )
							{
								value.title = __dictionary__AccessDenied;
							}
							else
							{
								value.title = __dictionary__ServiceError;
							}
							if( json.error )
							{
								this.parseMSGraphAPIError( json, value );
							}
							else
							{
								for( var msg in json )
								{
									if( msg == "more info" )
									{
										value.link = json[ msg ];
										continue;
									}
									if( json[ msg ].startsWith( "<HTML") || json[ msg ].startsWith( "<html") )
									{
										value.body = json[ msg ];
										continue;
									}
									value.messages.push( json[ msg ] );
								}
							}
						}
						catch( e )
						{
							if( value.title == "" ) value.title = __dictionary__RESTError;
							value.messages.push( message.response.statusText );
							if(    data.startsWith( "<HTML") 
								|| data.startsWith( "<html") 
								|| data.startsWith( "<H1>") 
								|| data.startsWith( "<!DOCTYPE" ) )
							{
								value.body = data;
							}
							else
							{
								value.messages.push( data );
							}
						}
					}
					if( message.response.responseText )
					{
						value.messages.push( message.response.responseText );
					} 
					if( message.response.statusText )
					{
						try
						{
							var json = JSON.parse( message.response.statusText );
							if( json && json.error )
							{
								this.parseMSGraphAPIError( json, value );
							}
							else
							{
								value.messages.push( message.response.statusText );
							}
						}
						catch( e )
						{
							value.messages.push( message.response.statusText );
						}
					} 
					this._open( value );
				},
				( err ) => { 
					if( value.title == "" ) value.title = __dictionary__RESTError;
					var txt = message.response.statusText;
					if( txt.startsWith( "<HTML") || txt.startsWith( "<html") || txt.startsWith( "<H1>") )
					{
						value.body = txt;
					}
					else
					{
						value.messages.push( txt );
					}
					if( message.response.responseText )
					{
						value.messages.push( message.response.responseText );
					} 
					this._open( value );
				} ); 
		}
	};
	
	parseMSGraphAPIError(
		json, value
	) {
		var type = typeof(json);
		if( typeof(json.error ) == "object" )
		{
			if( json.error.code )
			{
				value.messages.push( json.error.code );
			}
			if( json.error.message )
			{
				value.messages.push( json.error.message );
			}
			if( json.error.innerError )
			{
				for( var msg in json.error.innerError )
				{
					value.messages.push( msg + " : " + json.error.innerError[ msg ] );
				}
			}
		}
		else
		{
			value.messages.push( json.error );
		}
		if( json.error_description )
		{
			value.messages.push( json.error_description );
		}
		if( json.correlation_id )
		{
			value.messages.push( json.correlation_id );
		}
		if( json.timestamp )
		{
			value.messages.push( __dictionary__TimeStamp = " : " + json.timestamp );
		}
	}
	
	displayMessage(
		message
	) {
		if( message.key )
		{
			if( _messages[ message.key ] )
			{
				message = _messages[ message.key ];
			} 
		}
		this._open( message );
	}
	
	_onHTTPError(
		event
	) {	
		this.displayHttpError( event.detail );
	}
	
	_onAuthError(
		event
	) {	
		var value = {
				"title"  : __dictionary__AuthError,
				messages : [ event.detail.error_description ]
			}
		this._open( value );
	}
		
	_onMessage(
		event
	) {	
		this.displayMessage( event.detail );
	}
	
	_open(
		value
	) {
		var messageBox = document.createElement( 'message-box' );
		messageBox.value = value;
		this.parentNode.appendChild( messageBox );
		messageBox.open();
	}
}

// Register custom element definition using standard platform API
customElements.define( MessageMgr.is, MessageMgr );
