/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triblock-search-popup/triblock-image-info-card.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";
import { TriLocationDetailsBehavior } from "./tribehav-location-details.js";
import "./tricomp-location-map-link.js";
import "./tristyles-work-task-app.js";
import "./tricomp-procedure-icon-count.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
					min-width: 0;
					padding: 10px 10px;
				}

				.asset-data {
					@apply --layout-horizontal;
					@apply --layout-top;
				}

				:host([small-layout]) .asset-data {
					@apply --layout-center;
				}
				
				.asset-details {
					min-width: 0;
				}
				
				:host([small-layout]) .asset-details {
					@apply --layout-flex-10;
					min-width: 0;
				}

				.asset-details > div {
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.asset-icons {
					@apply --layout-horizontal;
				}
				:host([small-layout]) .asset-icons {
					@apply --layout-flex-1;
				}

				.icons-divider {
					height: 25px;
					margin: 8px 10px;
				}

				triblock-image-info-card {
					min-width: 0;
					--triblock-image-info-card-image-container: {
						border-radius: 0;
					};

					--triblock-image-info-card-placeholder-icon: {
						height: 29px;
						width: 29px;
					};
					padding: 0px 5px;
				}

				:host([dir=ltr]) triblock-image-info-card {
					--triblock-image-info-card-detail-container: {
						padding: 0 0 0 1em;
					}
				}

				:host([dir=rtl]) triblock-image-info-card {
					--triblock-image-info-card-detail-container: {
						padding: 0 1rem 0 0;
					}
				}
				
				.asset-icons .divider {
					height: 24px;
					margin: 8px 0;
				}

				.remove-icons {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.remove-spinner {
					padding: 8px;
					height: 24px;
					width: 24px;
				}
			
		</style>

		<triblock-image-info-card data="[[asset]]" placeholder-icon="ibm-glyphs:assets" cache-image="" thumbnail="" aria-label\$="[[asset.name]]">
			<div class="asset-data">
				<div class="asset-details">
					<div>[[asset.id]]</div>
					<div>[[asset.name]]</div>
					<div hidden\$="[[_noPrimaryLocation(asset.roomName)]]">
						<div>[[asset.buildingName]]</div>
						<div>[[asset.floorName]] | <b>[[asset.roomName]]</b></div>
					</div>
				</div>
				<div class="divider icons-divider" hidden\$="[[smallLayout]]"></div>
				<div class="asset-icons">
					<tricomp-procedure-icon-count task-id="[[taskId]]" hidden\$="[[hideProcedureCount]]" class="procedure-count" item="[[asset]]"></tricomp-procedure-icon-count>
					<template is="dom-if" if="[[showPinIcon]]">
						<paper-icon-button primary="" icon="ibm-glyphs:location" disabled="[[_disableLocationIcon(asset.hasGraphic, online)]]" on-tap="_locationIconTapped">
						</paper-icon-button>
					</template>
					<div class="divider" hidden\$="[[!showPinIcon]]"></div>
					<tricomp-location-map-link location="[[asset]]" map-link="[[mapLink]]"></tricomp-location-map-link>
					<div class="remove-icons" hidden\$="[[hideRemoveAsset]]">
						<div class="divider icons-divider"></div>
						<paper-icon-button class="remove-icon" noink icon="ibm-glyphs:remove" on-tap="_removeTapped" disabled="[[readonly]]" danger hidden\$="[[asset.loading]]"></paper-icon-button> 
						<paper-spinner class="remove-spinner" active="[[asset.loading]]" hidden\$="[[!asset.loading]]"></paper-spinner>
					</div>
				</div>
			</div>
		</triblock-image-info-card>
	`,

    is: "tricomp-asset-detail-card",

    behaviors: [
		TriLocationDetailsBehavior,
		TriDirBehavior
	],

    properties: {
		asset: {
			type: Object
		},

		mapLink: {
			type: String,
			value: ""
		},

		online: {
			type: Boolean
		},

		showPinIcon: {
			type: Boolean,
			value: false
		},

		hideProcedureCount: {
			type: Boolean,
			value: false
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		},

		readonly: Boolean,

		hideRemoveAsset: {
			type: Boolean,
			value: false
		}
	},

    _noPrimaryLocation: function(room) {
		return !room || room === "";
	},

    _locationIconTapped: function(e) {
		e.stopPropagation();
		this.fire("location-tapped", { item: this.asset });
	},

	_removeTapped: function(e) {
		e.stopPropagation();
		this.fire("remove-tapped");
	}
});