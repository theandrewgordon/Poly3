/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../triplat-icon/ibm-icons.js";
import { TriLocationPinBehaviorImpl, TriLocationPinBehavior } from "../triview-work-task/tribehav-location-pin.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				.task-topic {
					@apply --layout-horizontal;
					flex-basis: 100%;
					padding-top: 8px;
					@apply --tricomp-task-list-location-container;
				}
				.topic-label {
					color: var(--ibm-gray-50);
					white-space: nowrap;
				}

				:host([dir="ltr"]) .topic-label {
					padding-right: 3px;
				}

				:host([dir="rtl"]) .topic-label {
					padding-left: 3px;
				}

				paper-icon-button {
					--iron-icon-height: 16px;
					--iron-icon-width: 16px;
					height: 16px;
					width: 20px;
					padding: 0px 2px;
				}

				.link {
					color: var(--ibm-blue-40);
				}

			
		</style>

		<div class="task-topic" hidden\$="[[_hideLocationSection(_building, _floor, _room, _location)]]">
			<div class="topic-label" hidden\$="[[!showLabel]]">Location:</div>
			<div hidden\$="[[!_hideAlternateLocation(_location)]]">
				<span hidden\$="[[!locationIdField]]">[[locationIdField]],</span><span hidden\$="[[!locationIdField]]">&nbsp;</span>
				<span id="building" hidden\$="[[!_building]]">[[_building]]</span><span id="floor" hidden\$="[[!_floor]]">, [[_floor]]</span><span id="room" hidden\$="[[!_room]]">, [[_room]]</span>
				<paper-icon-button hidden\$="[[!enableOpenDetail]]" disabled="[[_disableLocationIcon(_hasGraphic, online)]]" primary="" icon="ibm-glyphs:location" on-tap="_onLinkTap" alt="Open floor plan"></paper-icon-button>
			</div>
			<div id="altLocation" hidden\$="[[_hideAlternateLocation(_location)]]">
				<span hidden\$="[[!locationIdField]]">[[locationIdField]],</span>
				<span>[[_location]]</span>
				<paper-icon-button hidden\$="[[!enableOpenDetail]]" disabled="[[_disableLocationIcon(_hasGraphic, online)]]" primary="" icon="ibm-glyphs:location" on-tap="_onLinkTap" alt="Open floor plan"></paper-icon-button>
			</div>
			
		</div>
	`,

    is: "tricomp-task-list-location",
    behaviors: [TriLocationPinBehavior, TriDirBehavior],

    properties: {
		/*
		* Location Path.
		*/
		locationPath: {
			type: Object
		},

		/*
		* Location Type in English US.
		*/
		locationTypeEnUs: {
			type: String,
			value: ""
		},

		/*
		* Location record id.
		*/
		locationId: {
			type: String
		},

		/*
		 * Location ID.
		 */
		locationIdField: {
			type: String,
			value: ""
		},

		/*
		 * Work task building.
		 */
		_building: {
			type: String,
			value: ""
		},

		/*
		 * Work task floor.
		 */
		_floor: {
			type: String,
			value: ""
		},

		/*
		 * Work task room.
		 */
		_room: {
			type: String,
			value: ""
		},

		/*
		 * Work task location different from building, floor and room.
		 */
		_location: {
			type: String,
			value: ""
		},

		/*
		 * Indicate whether the location label should show
		 */
		showLabel: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		/*
		 * Indicate whether the open location detail link should be enabled and show the location pin.
		 */
		enableOpenDetail: {
			type: Boolean,
			value: false
		},

		online: {
			type: Boolean
		}

	},

    observers: [
		"_setWorkTaskLocation(locationPath, locationTypeEnUs)",
		"_checkIfLocationHasGraphic(locationPath)"
	],

    /*
	 * Set work task location based on the primary location path.
	 */
	_setWorkTaskLocation: function(locationPath, type) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.set("_building", "");
		this.set("_floor", "");
		this.set("_room", "");
		this.set("_location", "");

		if (locationPath && locationPath.value && locationPath.value !== "" && type !== null && type !== "") {
			var locationString = locationPath.value;
			var locationArray = locationString.trim().split("\\");
			var length = locationArray.length;
			var locationLink; 

			if (type === "Building") {
				this.set("_building", (locationArray[length - 1]) ? locationArray[length - 1] : "");
				locationLink = this.$.building;
			} else if (type === "Floor") {
				this.set("_building", (locationArray[length - 2]) ? locationArray[length - 2] : "");
				this.set("_floor", (locationArray[length - 1]) ? locationArray[length - 1] : "");
				locationLink = this.$.floor;
			} else if (type === "Space") {
				this.set("_building", (locationArray[length - 3]) ? locationArray[length - 3] : "");
				this.set("_floor", (locationArray[length - 2]) ? locationArray[length - 2] : "");
				this.set("_room", (locationArray[length - 1]) ? locationArray[length - 1] : "");
				locationLink = this.$.room;
			} else {
				this.set("_location", (locationArray[length - 1]) ? locationArray[length - 1] : "");
				locationLink = this.$.altLocation;
			}
			if (this.enableOpenDetail) {
				locationLink.classList.add("link");
				this.listen(locationLink, 'tap', '_onLinkTap');
			}
		}
	},

    /*
	 * Indicate when to hide the location section.
	 */
	_hideLocationSection: function(building, floor, room, location) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !(building !== "" || floor !== "" || room !== "" || location !== "");
	},

    /*
	 * Indicate when to hide the alternate location string.
	 * This will make building, floor and room string visible.
	 */
	_hideAlternateLocation: function(location) {
		return location === "";
	},

    _onLinkTap: function(e) {
		e.stopPropagation();
		if(this.locationId && this.online)
			this.fire("location-tapped", {locationId: this.locationId});
	}
});