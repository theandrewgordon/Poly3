/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="iron-flex iron-flex-alignment iron-flex-factors iron-positioning tristyles-theme">

				:host {
					@apply --layout-vertical;
					padding-left: 10px;
					background-color: var(--ibm-neutral-2);
					overflow: hidden;
				}

				:host([small-screen-width]) {
					padding-left: 0px;
				}

				.container {
					@apply --layout-horizontal;
					@apply --layout-wrap;
					overflow: auto;
				}

				:host([small-screen-width]) .container {
					@apply --layout-veritical;
				}

				tricomp-floor-directory-card {
					margin: 10px;
					padding: 25px;
					max-height: 70px;
					min-height: 60px;
					flex-basis: 300px;
					background-color: var(--tri-primary-content-background-color);
					cursor: pointer;
				}

				:host(:not([small-screen-width])) .selected-card {
					border: 2px solid var(--tri-primary-color);
					box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, .2);
				}

				:host([small-screen-width]) .selected-card {
					background-color: var(--tri-primary-color-10) !important;
				}

				:host([small-screen-width]) tricomp-floor-directory-card:nth-child(even){
					background-color: var(--ibm-neutral-2);
				}

				:host([small-screen-width]) tricomp-floor-directory-card {
					border: none;
					margin: 0px;
					flex-basis: 600px;
					display: block;
				}
			
		</style>

		<div id="container" class="container" role="listbox">
			<template is="dom-repeat" items="[[floorDirectory]]" index-as="index">
				<tricomp-floor-directory-card class\$="[[_computeSelectedCard(item, index)]]" person="[[item]]" index="[[index]]" on-tap="_handleSelectPerson" aria-label\$="[[_computeAriaLabel(item.room)]]"></tricomp-floor-directory-card>
			</template>
		</div>
	`,

    is: "tripage-floor-directory",

    behaviors: [
		TriBlockViewResponsiveBehavior,
	],

    properties: {
		floorRecordId: String, 
		personRecordId: String,
		floorDirectory: Array,
		scroller: {
			type: Object,
			notify: true
		}
	},

    attached: function() {
		this.set('scroller', this.$.container);
	},

    _handleSelectPerson: function(e){
		if (this.personRecordId) {
			this._highlightedElement.classList.remove("selected-card");
			this._highlightedElement = e.currentTarget;
			this._highlightedElement.classList.add("selected-card");
		}
		this.fire('person-selected', e.model.item);
	},

    _computeSelectedCard: function(item, index){
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (item._id == this.personRecordId) {
			this.async(function(){
				this._getHighlightedElement(index);
			});
			return "selected-card";
		}
	},

    _getHighlightedElement: function(index){
		this._highlightedElement = this.$$('tricomp-floor-directory-card[class*="selected-card"]');
	},

    _computeAriaLabel: function(room) {
		return "Room: " + room;
	}
});