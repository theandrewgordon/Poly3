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
import '../@polymer/polymer/lib/elements/dom-repeat.js';
import '../@polymer/paper-icon-button/paper-icon-button.js';
import '../@polymer/paper-tooltip/paper-tooltip.js';
import '../office-365/outlook-calendar-ds.js';
import '../office-365/outlook-user-ds.js';
import '../triplat-date-picker/triplat-date-picker.js';

var __dictionary__prevDay   = "Previous Day";
var __dictionary__nextDay   = "Next Day";
var __dictionary__attendees = "Attendees";

var standatdTime = [ "12:00am", "1:00am", "2:00am", "3:00am", "4:00am", "5:00am", "6:00am", "7:00am", "8:00am", "9:00am", "10:00am", "11:00am",
	                 "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm", "11:00pm",
	                 "12:00am" ];

// To convert day returned by Outlook to index used by Date object
var dayNames = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "satuerday" ];

class FreebusyGrid extends PolymerElement 
{
	static get template() {
		return html`
			<style>
				html, body {
					margin           : 0;
					padding          : 0;
					height           : 100%;
					width            : 100%;
				    overflow-x       : scroll;
				}
				.header {
					width            : 100%;
				}
				div.title {
					width            : 100%; 
				}
				div.picker {
					width            : 124px;
					margin           : auto;
				}
				div.dayline {
					width            : 100%; 
					height           : 60px;
					white-space      : nowrap;
					text-align       : center;
				}
				div.grid {
				    overflow         : auto;
				}
				div.timelist {
					width            : 100%; 
					white-space      : nowrap;
				    overflow-y       : hidden;
				}
				div.prevDay {
					display          : inline-block;
					float            : left;
					cursor           : pointer;
				}
				div.nextDay {
					display          : inline-block;
					float            : right;
					cursor           : pointer;
				}
				div.attendee {
					width              : 40px;
				}
				th.timebar {
					min-width          : 90px;
					padding-left       : 0;
					padding-right      : 0;
				  	border-bottom      : 1px solid black;
				}
				th.names {
					min-width          : 120px;
				  	border-bottom      : 1px solid black;
				}
				
				div.timeBlock {
					position           : absolute;
					top                : 0;
					white-space        : nowrap;
					overflow           : hidden;
					text-overflow      : ellipsis;
			        text-align         : center;
					color              : white;
				}
				eventCardTitle {
					background    : #204080;
					color         : white;
					padding       : 10px;
					white-space   : nowrap;
					overflow      : hidden;
					text-overflow : ellipsis;
				}
				
				table {
					border-collapse    : collapse;
				}
				td.grid {
					padding            : 0;
				    border-bottom      : 1px solid;
				    border-left        : 1px solid;
				    border-right       : 1px solid;
    				position           : relative;
				}
				td.name {
				  	border-bottom      : 1px solid black;
				}
				
				triplat-date-picker {
					--triplat-date-picker-width : 120px;
				}
				paper-tooltip {
					background       : white;
					box-shadow       : 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4);
					--paper-tooltip-background : white;
					--paper-tooltip-text-color : black;
				}
			</style>
			
		<table class="header">
			<tr>
				<td>
					<div class="prevDay" on-click="_prevDay">
						<paper-icon-button id="drawerToggle" icon="chevron-left" class="icons" on-click="_prevDay" alt="[[__dictionary__prevDay]]">
						</paper-icon-button>
						Previous Day 
					</div>
				</td><td>
					<div class="title">
						<div>
							<slot id="titleSlot" name="title"></slot>
						</div><div>
							<div class="picker">
								<triplat-date-picker id="day"  value="{{localDate}}" on-date-picker-change="_onDateChange" >
								</triplat-date-picker>
							</div>
						</div>
					</div>
				</td class="picker"><td>
					<div class="nextDay" on-click="_nextDay">
						Next Day 
						<paper-icon-button id="drawerToggle" icon="chevron-right" class="icons" on-click="_nextDay" alt="[[__dictionary__nextDay]]">
						</paper-icon-button>
					</div>
				</td>
			</tr>
		</table>
		
		<div class="grid">
			<table id="fbTable">
			    <col/>
				<template id="repeat" is="dom-repeat" items="[[timelist]]">
				    <col width="43px" />
				    <col width="43px" />
				</template>
				<tr>
					<th class="names">[[resourcetitle]]</th>
					<template id="repeat" is="dom-repeat" items="[[timelist]]">
						<th colspan="2" class="timebar">[[item]]</th>
					</template>
				</tr>
				<template id="freeBusyList" is="dom-repeat" items="[[freebusy]]">
					<tr>
						<td colspan="2" class="name">[[item.name]]</td>
						<template id="repeat" is="dom-repeat" items="[[timeBlocks]]">
							<td colspan="2" class="grid"></td>
						</template>
						<td<</td>
					</tr>
				</template>
			</table>
		</div>

		<outlook-calendar-ds id="calendarStorage" authtoken="[[authtoken]]" 
		                  on-calendar-freebusy-list="_onFreeBusyList">
		</outlook-calendar-ds>
		<outlook-user-ds id="userStorage"></outlook-user-ds>
		`;
		
	}

	static get is() { return 'freebusy-grid' };
	
	static get properties() {
		return {
			  /**
			   * Microsoft OAuth access token. typical returned from azure-oauth2
			   */
			authtoken : {
				type                : String,
			},
			/**
			 * UTC data in this format: 2019-10-21T21:36:59.000-04:00
			 */
			start : {
				type               : Object,
				notify             : true
			   },
			/**
			 * UTC data in this format: 2019-10-21T21:36:59.000-04:00
			 */
			end : {
				type               : Object,
				notify             : true
			   },
		    freebusy : {
				type               : Array,
				value              : [],
		    	observer           : '_onFreeBusyChanged'
		    },
		   /**
		    * Title of list of attendees 
		    */
		    resourcetitle : {
				type               : Array,
		    },
		    timelist : {
				type               : Array,
		    },
		    showWorkingHours : {
		    	type               : Boolean,
		    	value              : true,
		    }
		}
	}
	
	constructor()
	{
		super();
		this.freebusy     = [];
		this.calendarlist = [];
		this.markers      = [];
		
		var d = new Date();
		d.setHours( 0, 0, 0, 0 );
		this.localDate = this._formatDate( d );
	}
	
	ready() 
	{
		super.ready();
		
		if( this.start )
		{
			try {
				var d = new Date(this.start).setHours( 0, 0, 0, 0 );
				d.setMinutes( d.getTimezoneOffset() );			// Assume start is UTC
				this.set( "localDate", this._formatDate( d ) );
			}
			catch( err )
			{
				this.start = this.localDate;
				console.error( err );
			}
		}
		else
		{
			this.start = this.localDate;
		}
		
		var d = new Date(this.start);
		d.setHours( d.getHours() + 24 );
		this.end = this._formatDate( d );

		if( !this.resourcetitle ) this.resourcetitle = __dictionary__attendees;
		if( !this.timelist ) this.set( "timelist", standatdTime );
		
		this.timeBlocks = [];
		for( var i = 0; i < this.timelist.length - 1; i++ ) this.timeBlocks.push( "" );
	}
	
	
	/**
	 * Display a 1 day hourly grid with a row for each address in the list and time block
	 * for each period that the address is scheduled
	 *  
	 * {
	 *		attendee.emailAddress = {
	 *			address : event.attendee[i].emailAddress.address,
	 *			name    : event.attendee[i].emailAddress.name
	 *		};
	 *	}
	 */
	display( schedules )
	{
		this.addresses = [];
		this.namesByAddress = {};
		for( var i = 0; schedules && i < schedules.length; i++ )
		{
			if( schedules[i].emailAddress && schedules[i].emailAddress.address )
			{
				this.addresses.push( schedules[i].emailAddress.address);
				this.namesByAddress[ schedules[i].emailAddress.address ] = schedules[i].emailAddress;
			}
		}
		this.$.calendarStorage.getFreeBusyList( this.start, this.end, this.addresses, "UTC" );
	}

	_formatDate( date )
	{
		var year   = "" + date.getFullYear();
		var month  = "" + ( date.getMonth() + 1);
		var day    = "" + date.getDate();
		var hour   = "" + date.getHours();
		var minute = "" + date.getMinutes();
		var second = "" + date.getSeconds()
		var ms     = "" + date.getMilliseconds();
		if( month.length < 2 )  month   = "0" + month;
		if( day.length < 2 )    day     = "0" + day;
		if( hour.length < 2 )   hour    = "0" + hour;
		if( minute.length < 2 ) minute  = "0" + minute;
		return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":00.0000";
	}
	
	_prevDay()
	{
		var d = new Date( this.localDate );
		d.setHours( d.getHours() - 24 );
		this.set( "localDate", this._formatDate( d ) );
	}
	
	_nextDay()
	{
		var d = new Date( this.localDate );
		d.setHours( d.getHours() + 24 );
		this.set( "localDate", this._formatDate( d ) );
	}
	
	_onDateChange( event, newDate )
	{
		var d = new Date( newDate.date );
		d.setMinutes( d.getTimezoneOffset());
		this.start = this._formatDate( d );
		d.setHours( d.getHours() + 24 );
		this.end = this._formatDate( d );

		if( !this.addresses || this.addresses.length == 0 ) return;
		
		this.$.calendarStorage.getFreeBusyList( this.start, this.end, this.addresses, "UTC" );
	}
	
	/*
	   {
		 	@odata.context: "https://graph.microsoft.com/v1.0/$metadata#Collection(microsoft.graph.scheduleInformation)"
			value: [
				0:
				availabilityView: "000000000000000022220000000000000000000000000000000000000000000000000000000000000000000000000000"
				scheduleId: "doug.wood@dougwood.onmicrosoft.com"
				scheduleItems: [
					end: {
						dateTime: "2019-07-30T05:00:00.0000000"
						timeZone: "UTC"
					}
					isPrivate: false
					location: ""
					start: {
						dateTime: "2019-07-30T04:00:00.0000000"
						timeZone: "UTC"
					}
					status: "busy"
					subject: "Test"
				]
			]
		}
	 */
	_onFreeBusyList( event )
	{
		var freeBusy = event.detail;
		for( var i = 0; freeBusy && i < freeBusy.length; i++ )
		{
			var person = this.namesByAddress[ freeBusy[i].scheduleId];
			if( person )
			{
				if( person.name )
				{
					freeBusy[i].name = person.name;
				}
				else if( person.address )
				{
					freeBusy[i].name = person.address;
				}
				freeBusy[i].type = person.type;
			}
		}
		this.freebusy = freeBusy;
	}

	_onFreeBusyChanged( value )
	{
		for( var i = 0; i < this.markers.length; i++ )
		{
			this.markers[i].parentNode.removeChild( this.markers[i] );
		}
		this.markers = [];
		
		this.$.freeBusyList.render();

		var tzOffset = new Date( this.localDate ).getTimezoneOffset();

		for( var i = 0; i < value.length; i++ )
		{
			var fbTable = this.$.fbTable;
			var row     = fbTable.rows[i+1];
			var cell    = row.cells[ row.cells.length - 1 ];

			this.MakeWorkingHourMarkers( value[i].workingHours, tzOffset, row.cells[1] );

			if( value[i].scheduleItems && value[i].scheduleItems.length > 0 )
			{
				for( var j = 0; j < value[i].scheduleItems.length; j++ )
				{
					var id = "id_" + i + "_" + j;
					this.MakeBusyMarker( value[i].scheduleItems[j], tzOffset, cell, id );
				}
			}
		}
	}
	
	/**
	 * workingHours {
     *     daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday" ],
     *     endTime : "17:00:00.0000000", 
     *     startTime : "08:00:00.0000000",
     *     timeZone : {
     *     name : {
     *         "Eastern Standard Time"
     *     }
     * }
	 */
	MakeWorkingHourMarkers( workingHours, tzOffset, cell )
	{
		try
		{
			if( !this.showWorkingHours ) return;
			if( !workingHours || !this.IsWWorkingDay( workingHours.daysOfWeek ) ) return;
			
			var offset = 0;
			
			var hours     = parseInt( workingHours.startTime.substring( 0, 2 ) );
			var minutes   = parseInt( workingHours.startTime.substring( 3, 5 ) );
			var startMins = hours * 60 + minutes;
			hours         = parseInt( workingHours.endTime.substring( 0, 2 ) );
			minutes       = parseInt( workingHours.endTime.substring( 3, 5 ) );
			var endMins   = hours * 60 + minutes;
			var tz;
			
			if( workingHours.timeZone && workingHours.timeZone.name == "Customized Time Zone" )
			{
				offset = tzOffset - workingHours.timeZone.bias;
				var now = new Date( this.localDate );
				if( workingHours.timeZone.daylightOffset.month < workingHours.timeZone.standardOffset.month )
				{
					if(    now.getDate() > workingHours.timeZone.daylightOffset.month
					    && now.getDate() < workingHours.timeZone.standardOffset.month )
					{
						offset -= workingHours.timeZone.daylightOffset.daylightBias;
					}
					if( now.getDate() == workingHours.timeZone.daylightOffset.month )
					{
					
					}
					if( now.getDate() == workingHours.timeZone.standardOffset.month )
					{
					
					}
				}
				else
				{
					if(    now.getDate() < workingHours.timeZone.daylightOffset.month
					    || now.getDate() > workingHours.timeZone.standardOffset.month )
					{
						offset -= workingHours.timeZone.daylightOffset.daylightBias;
					}
					if( now.getDate() == workingHours.timeZone.daylightOffset.month )
					{
					
					}
					if( now.getDate() == workingHours.timeZone.standardOffset.month )
					{
					
					}
				}
			}
			else
			{
				try
				{
					var ianaTZ = this.$.userStorage.lookupTimeZoneByMSName( workingHours.timeZone.name );
					if( ianaTZ != null )
					{
						tz = ianaTZ.abbr;
						var date = new Date( this.localDate );
					    var utcDate  = new Date( date.toLocaleString('en-US', { timeZone: "UTC" } ));
					    var aestTime = new Date( date.toLocaleString('en-US', { timeZone: ianaTZ.iana } ));
						offset = tzOffset - ( utcDate.getTime() - aestTime.getTime() ) / 60000;
					}
					else
					{
						offset = tzOffset + this.$.calendarStorage.getTimeZoneOffset( workingHours.timeZone.name );
					}
				}
				catch( err ) 
				{ 
					offset = tzOffset + this.$.calendarStorage.getTimeZoneOffset( workingHours.timeZone.name );
					console.error( err ); 
				}
			}
			startMins -= offset;
			endMins   -= offset;
			if( startMins < endMins )
			{
				this.AddWorkingHourMArker( 0, startMins, cell, tz, "l" );
				if( endMins < 1440 )
				{
					this.AddWorkingHourMArker( endMins, 1440, cell, tz, "r" );
				}
			}
			else
			{
				// WOrking hours wrap around midnight
				this.AddWorkingHourMArker( endMins, startMins, cell, tz, "c" );
			}
		}
		catch( err )
		{
			console.error( err );
		}
	}
	
	IsWWorkingDay( daysOfWeek )
	{
		var dayName = dayNames[ new Date( this.localDate ).getDay() ];
		for( var i = 0; i < daysOfWeek.length; i++ )
		{
			if( dayName == daysOfWeek[i] ) return true;
		}
		return false;
	}
	
	AddWorkingHourMArker( startMins, endMins, cell, tz, loc )
	{
		var duration  = endMins - startMins;
		var id = "wh_" + cell.parentNode.rowIndex + "_" + loc;

		var ell              = document.createElement("DIV");
		ell.id               = id;
		ell.className        = "timeBlock";

		ell.style.width      = "" + Math.trunc( duration * 1.5 ) + "px";
		ell.style.height     = "" + cell.clientHeight + "px";
		ell.style.left       = "" + Math.trunc( startMins * 1.5 ) + "px";
		ell.style.background = "rgba( 80, 80, 80, 0.3 )";
		ell.style.zIndex     = 1;
		cell.appendChild( ell );
		this.markers.push( ell );
		
		if( tz )
		{
			var tooltip = document.createElement("paper-tooltip");
			tooltip.setAttribute( "for", id );
			tooltip.setAttribute( "animation-delay", 0 );
			tooltip.style.background = "white";
			tooltip.style.color      = "black";
			tooltip.style.whiteSpace = "nowrap";
			tooltip.style.textAlign  = "center";
			tooltip.innerHTML        = tz;

			this.$.fbTable.appendChild( tooltip );
			this.markers.push( tooltip );
		}
	}
	
	/**
	 * scheduleItems: [
	 *     {
	 *         end: {
     *             dateTime: "2019-09-03T04:30:00.0000000",
     *             timeZone: "UTC"
     *         },
     *         isPrivate: false,
     *         location: "Conference Room 211",
     *         start: {
     *             dateTime: "2019-09-03T03:00:00.0000000"
     *             timeZone: "UTC"
     *         },
     *         status: "busy",
     *         subject: "Team Meeting",
     *     }
     * ]
	 */
	MakeBusyMarker( item, tzOffset, cell, id )
	{
		var start = new Date( item.start.dateTime.substring( 0, 23 ) );
		var end   = new Date( item.end.dateTime.substring( 0, 23 ) );
		
		// Convert from UTL to local time
		start.setMinutes( start.getMinutes() - tzOffset )
		end.setMinutes( end.getMinutes() - tzOffset )
		
		var startMins = start.getHours() * 60 + start.getMinutes();
		var endMins   = end.getHours() * 60 + end.getMinutes();
		
		// test for starting before the current day or ending after the current day
		var startDate = this._formatDate( start ).substring( 0, 10 );
		var endDate   = this._formatDate( end ).substring( 0, 10 );
		var curDate   = this.localDate.substring( 0, 10 );
		if( startDate < curDate ) startMins -= 1440;
		if( endDate > curDate )   endMins += 1440;
		
		var duration  = endMins - startMins;

		if( startMins < 0 )
		{
			if( duration + startMins <= 0 ) return;
			duration += startMins;
			startMins = 0;
		}
		if( startMins + duration > 60 * 24 )
		{
			duration = 60 * 24 - startMins;
			if( duration <= 0 ) return;
		}
		
		var ell              = document.createElement("DIV");
		ell.id               = id;
		ell.className        = "timeBlock";
		ell.scheduleitem     = item;
		ell.style.zIndex     = 2;
		if( item.subject && item.subject != "" ) ell.innerHTML = item.subject;

		ell.style.width      = "" + Math.trunc( duration * 1.5 ) + "px";
		ell.style.height     = "" + cell.clientHeight + "px";
		ell.style.left       = "" + ( Math.trunc( startMins * 1.5 ) - 2070 ) + "px";
		cell.appendChild( ell );

		if( item.status == "tentative" )
		{
			ell.style.background = "rgba( 20, 40, 80, 0.5 )";
		}
		else
		{
			ell.style.background = "#204080";
		}

		this.markers.push( ell );

		if( item.subject && item.subject != "" )
		{
			var tooltip = document.createElement("paper-tooltip");
			tooltip.setAttribute( "for", id );
			tooltip.setAttribute( "animation-delay", 0 );
			tooltip.style.background = "white";
			
			var title = document.createElement("DIV");
			title.innerHTML = item.subject;
			title.style.background = "#204080";
			title.style.whiteSpace = "nowrap";
			title.style.textAlign  = "center";
			title.style.color      = "white"
			title.style.padding    = "12px"
			tooltip.appendChild( title );

			var startTime = start.toLocaleTimeString();
			var endTime   = end.toLocaleTimeString();

			var start = document.createElement("DIV");
			start.style.background = "white";
			start.style.color      = "black"
			start.style.whiteSpace = "nowrap";
			start.style.padding    = "4px"
			start.innerHTML = "Start: " + startTime;
			tooltip.appendChild( start );

			var end = document.createElement("DIV");
			end.style.background = "white";
			end.style.color      = "black"
			end.style.whiteSpace = "nowrap";
			end.style.padding    = "4px"
			end.innerHTML = "End:   " + endTime;
			tooltip.appendChild( end );
			
			if( item.location && item.location != "" )
			{
				var loc = document.createElement("DIV");
				loc.style.background = "white";
				loc.style.color      = "black"
				loc.style.whiteSpace = "nowrap";
				loc.style.padding    = "4px"
				loc.innerHTML = "Location: " + item.location;
				tooltip.appendChild( loc );
			}

			this.$.fbTable.appendChild( tooltip );
			this.markers.push( tooltip );
		}
	}
}

customElements.define(FreebusyGrid.is, FreebusyGrid );