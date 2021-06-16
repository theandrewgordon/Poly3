/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../triplat-icon/ibm-icons.js";
import { TriLocationDetailsBehavior } from "./tribehav-location-details.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[!_computeDisableDirections(location)]]" restamp="">
			<a href\$="[[mapLink]]" target="_blank" on-tap="_onMapLinkTapped" tabindex="-1">
				<paper-icon-button primary="" icon="ibm:booklet-guide" alt="Open map view">
				</paper-icon-button>
			</a>
		</template>

		<template is="dom-if" if="[[_computeDisableDirections(location)]]" restamp="">
			<paper-icon-button primary="" icon="ibm:booklet-guide" disabled="[[_computeDisableDirections(location)]]" alt="Open map view">
			</paper-icon-button>
		</template>
	`,

    is: "tricomp-location-map-link",

    behaviors: [
		TriLocationDetailsBehavior
	],

    properties: {
		location: {
			type: Object
		},

		mapLink: {
			type: String,
			value: ""
		}
	},

    _onMapLinkTapped: function(e) {
		e.stopPropagation();
	}
});