/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "./tristyles-work-task-app.js";
import "./tricomp-procedure-status-bar.js";
import { TriLocationPinBehaviorImpl, TriLocationPinBehavior } from "./tribehav-location-pin.js";
import "../triapp-task-list/tricomp-task-list-location.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
					padding: 10px 15px;
				}

				.name {
					color: var(--ibm-blue-40);
					margin: 5px 0px 10px;
				}

				.asset-value {
					padding: 0px 5px;
				}

				.location-path {
					@apply --layout-flex-5;
				}

				.icons-divider {
					margin: 8px 10px;
					@apply --layout;
					@apply --layout-self-stretch;
				}

				.location-button {
					@apply --layout-flex-4;
				}

				.rule-section {
					@apply --layout-horizontal;
					@apply --layout-start;
					margin-bottom: 10px;
				}

				.status {
					margin-bottom: 10px;
				}
 
			
		</style>

		<div class="name">[[procedure.procedureName]]</div>	
		<template is="dom-if" if="[[_showLocation(procedure)]]">
			<div class="rule-section">
				<tricomp-task-list-location class="location-path" location-path="[[procedure.location]]" location-type-en-us="[[procedure.location.typeENUS]]" location-id-field="[[procedure.locationID]]"></tricomp-task-list-location>
				<div class="divider icons-divider"></div>
				<div class="location-button">
					<paper-icon-button primary="" icon="ibm-glyphs:location" on-tap="_openLocationDetails" disabled="[[_disableLocationIcon(_hasGraphic, online)]]"></paper-icon-button>
				</div>
			</div>
		</template>
		<template is="dom-if" if="[[_showAsset(procedure)]]">
			<div class="rule-section">
				<span>[[procedure.assetID]],</span>
				<span class="asset-value">[[procedure.asset.value]]</span>
			</div>
		</template>
		<tricomp-procedure-status-bar class="status" procedure="[[procedure]]" opened="[[opened]]"></tricomp-procedure-status-bar>
	`,

    is: "tricomp-procedure-detail-card",

    behaviors: [
		TriLocationPinBehavior
	],

    properties: {
		opened: Boolean,

		online: {
			type: Boolean
		},

		procedure: {
			type: Object
		}
	},

    observers: [
		'_checkIfLocationHasGraphic(procedure.location)'
	],

    _showAsset: function(procedure) {
		return procedure.rule == "per Asset";
	},

    _showLocation: function(procedure) {
		return procedure.rule == "per Location";
	},

    _openLocationDetails: function(e) {
		e.stopPropagation();
		var location = this.procedure.location;
		if(location.id)
			this.fire("location-tapped", {locationId: location.id});
	}
});