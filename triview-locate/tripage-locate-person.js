/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

import { TriPlatDs } from "../triplat-ds/triplat-ds.js";

import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import { TriLocateAppUtilsBehavior } from "./tribehav-locate-app-utils.js";
import "./tristyles-locate-app.js";
import "./tricomp-search-person.js";
import "./tricomp-person-details.js";
import "./tricomp-location-details-person.js";

Polymer({
    _template: html`
		<style include="shared-page-styles shared-locate-app-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
				}
				
				.page-header {
					padding: 20px 20px 12px 20px;
				}

				:host(:not([small-screen-width])) .search {
					padding: 20px 20px 10px 20px;
				}

				:host([small-screen-width]) .search {
					padding: 15px;
				}
				
				:host(:not([small-screen-width])) .person-details {
					padding: 10px 20px;
				}
				
				:host([small-screen-width]) .person-details {
					padding: 0;
				}

				.not-search-container {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.location-details {
					@apply --layout-flex;
				}
			
		</style>

		<triplat-ds id="personDetailsDs" name="peopleLookup" data="{{_personDetails}}" manual>
			<triplat-ds-instance id="personDetailsDsInstance"></triplat-ds-instance>
		</triplat-ds>

		<template is="dom-if" if="[[!smallScreenWidth]]">
			<div class="page-header">
				<div class="header-text tri-h2" hidden\$="[[smallScreenWidth]]" aria-label="Locate">Locate Person</div>
			</div>
		</template>

		<tricomp-search-person class="search" on-person-selected="_handlePersonSelectedFromSearch"></tricomp-search-person>
		<template is="dom-if" if="[[_personDetails]]"> 
			<div class="not-search-container" hidden\$="[[!_personDetails._id]]">
				<tricomp-person-details class="person-details" person-details="[[_personDetails]]"></tricomp-person-details>
				<template is="dom-if" if="[[_hasPrimaryLocation]]">
					<tricomp-location-details-person class="location-details" floor-record-id="[[_personDetails.floor.id]]" pin-details="[[_createPinDetails(_personDetails)]]" person-record-id="[[_personDetails._id]]" small-screen-max-height="450px" on-person-selected="handlePersonSelected" hidden="[[!_personDetails.floor.id]]"></tricomp-location-details-person>
				</template>
				<template is="dom-if" if="[[!_hasPrimaryLocation]]">
					<div class="location-details empty-placeholder">
						No primary location is defined for this person.
					</div>
				</template>
			</div>
		</template> 
	`,

    is: "tripage-locate-person",

    behaviors: [
		TriBlockViewResponsiveBehavior,
		TriLocateAppUtilsBehavior
	],

    properties: {
		personRecordId: {
			type: String
		},

		opened: {
			type: Boolean,
			value: false
		},
		
		_personDetails: Object,

		_hasPrimaryLocation: {
			type: Boolean,
			value: false,
			computed: '_computeHasPrimaryLocation(_personDetails.building)'
		}
	},

    observers: [
		"_handlePersonRecordIdChanged(opened, personRecordId)",
	],

    _handlePersonSelectedFromSearch: function(e) {
		if (e) {
			this.handlePersonSelected(e);
			this.fire('navigate-locate-person', { personId: e.detail._id });
		}
	},

    handlePersonSelected: function(e) {
		if (e) {
			var personDetails = e.detail;
			this.set('_personDetails', personDetails);
		}
	},

    _handlePersonRecordIdChanged: function (opened, personRecordId) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (!opened) {
			return;
		}

		afterNextRender(this, function() {
			if (this._isValidString(personRecordId)) {
				if (!this._personDetails || personRecordId != this._personDetails._id) {
					this.$.personDetailsDsInstance.instanceId = personRecordId;
					this.$.personDetailsDs.refresh();
				}
			} else {
				this._personDetails = null;
			}
		});
	},

    _createPinDetails: function(personDetails) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var pinDetails = null;

		if (personDetails) {
			pinDetails =  {
				spaceRecordId: personDetails.roomId
			}
		}

		return pinDetails;
	},

    _computeHasPrimaryLocation: function(primaryLocation) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !!primaryLocation && this._isValidString(primaryLocation.id) && this._isValidString(primaryLocation.value);
	}
});