/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-routing/triplat-route.js";
import "../triblock-search-popup/triblock-image-info-card.js";
import "../triblock-table/triblock-table.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "./tristyles-work-task-app.js";
import { TriLocationDetailsBehavior } from "./tribehav-location-details.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import "./tricomp-location-address-city-state.js";
import "./tricomp-location-map-link.js";
import "./tricomp-task-detail-section.js";
import "./tricomp-task-id.js";
import { TriroutesTask } from "./triroutes-task.js";
import "./triservice-location.js";
import "./tricomp-procedure-icon-count.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-detail-section tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				tricomp-location-detail-card {
					cursor: pointer;
					padding-top: 10px;
					padding-bottom: 10px;
				}

				tricomp-task-detail-section {
					--tricomp-task-detail-section-collapse: {
						overflow-y: auto;
					};
				}

				:host([dir="ltr"]) tricomp-location-detail-card {
					padding-left: 15px;
				}

				:host([dir="rtl"]) tricomp-location-detail-card {
					padding-right: 15px;
				}

				tricomp-location-detail-card:nth-child(even) {
					background-color: var(--ibm-neutral-2);
				}

				tricomp-location-detail-card:hover {
					background-color: var(--ibm-neutral-4);
				}

				triblock-table {
					@apply --layout-flex;
					min-height: 50px;
					margin: 0px 15px 15px 15px;
					border-bottom: 1px solid var(--ibm-gray-30);
					overflow: hidden;
					--triblock-table-cell: {
						height: auto !important;
						min-height: 44px;
					};

					--triblock-table-column-divider: {
						display: none;
					};
				}

				:host {
					--triblock-image-info-card-image-container: {
						border-radius: 0;
					};

					--triblock-image-info-card-placeholder-icon: {
						height: 29px;
						width: 29px;
					};
				}

				label {
					font-size: 12px;
				}

				.location-name {
					@apply --layout-vertical;
				}

				.small-screen-border {
					border-bottom: 1px solid var(--ibm-gray-30);
				}

				.icons-group {
					max-width: 140px;
				}
			
		</style>

		<triplat-route name="taskLocations" on-route-active="_onRouteActive" params="{{_taskLocationsParams}}"></triplat-route>

		<triservice-location id="locationService" locations-with-primary="{{_locations}}"></triservice-location>

		<tricomp-task-detail-section small-layout="[[smallLayout]]" header="[[_header]]" aria-label="[[_header]]" count="[[_locationsCount]]" opened="{{opened}}" loading="[[_loading]]" alt-expand="[[_altExpand]]" alt-collapse="[[_altCollapse]]">
			<div class="section-content" slot="section-content">
				<template is="dom-if" if="[[smallLayout]]" restamp="">
					<tricomp-task-id task="[[task]]"></tricomp-task-id>
					<template is="dom-repeat" items="[[_locationsList]]">
						<tricomp-location-detail-card  small-layout="[[smallLayout]]" location="[[item]]" on-tap="_navigateToLocationDetails" map-link="[[_buildMapLink(item)]]" task-id="[[_taskLocationsParams.taskId]]" show-pin-icon="" show-directions-icon="" show-address="" online="[[online]]">
						</tricomp-location-detail-card>
					</template>
					<div class="small-screen-border"></div>
				</template>
				<template is="dom-if" if="[[!smallLayout]]" restamp="">
					<triblock-table data="[[_locationsList]]" on-row-tap="_navigateToLocationDetails" fixed-header="" row-aria-label-callback="[[_computeRowAriaLabelCallback]]">
						<triblock-table-column class="fixed-width-column" property="picture">
							<template>
								<triblock-image-info-card class="building-image" data="[[item]]" placeholder-icon="[[_computePlaceholderIcon(item)]]" cache-image="" thumbnail="" aria-label="Primary location">
								</triblock-image-info-card>
							</template>
						</triblock-table-column>
						<triblock-table-column title="Location">
							<template>
								<div class="location-name">
									<template is="dom-if" if="[[item.isPrimary]]" restamp="">
										<label>Primary location</label>
									</template>
									<div>[[_computeLocationName(item)]]</div>
									<tricomp-location-address-city-state location="[[item]]"></tricomp-location-address-city-state>
								</div>
							</template>
						</triblock-table-column>
						<triblock-table-column title="Floor">
							<template>
								<div>[[_locationFloor(item)]]</div>
							</template>
						</triblock-table-column>
						<triblock-table-column title="Room">
							<template>
								<div>[[_locationRoom(item)]]</div>
							</template>
						</triblock-table-column>
						<triblock-table-column class="fixed-width-column icons-group right-aligned">
							<template>
								<tricomp-procedure-icon-count id="proceduresLink" class="procedure-count" item="{{item}}" task-id="[[_taskLocationsParams.taskId]]"></tricomp-procedure-icon-count>
								<paper-icon-button primary="" icon="ibm-glyphs:location" disabled="[[_disableLocationIcon(item.hasGraphic, online)]]" alt="Open floor plan"></paper-icon-button>
								<div class="divider icons-divider"></div>
								<tricomp-location-map-link location="[[item]]" map-link="[[_buildMapLink(item)]]"></tricomp-location-map-link>
							</template>
						</triblock-table-column>
					</triblock-table>
				</template>
			</div>
		</tricomp-task-detail-section>
	`,

    is: "tricomp-task-detail-locations",

    behaviors: [
	    IronResizableBehavior,
	    TriTaskDetailSectionBehavior,
	    TriLocationDetailsBehavior,
	    TriDirBehavior
	],

    properties: {
		online: {
			type: Boolean
		},

		task: Object,

		_header: {
			type: String
		},

		_locations: {
			type: Array
		},

		_locationsCount: {
			type: Number,
			computed: "_computeLocationsCount(_locations)"
		},

		_locationsList: {
			type: Array,
			computed: "_computeLocationsList(_locations, opened)"
		},

		_taskLocationsParams: {
			type: Object
		},

		_altExpand: {
			type: String
		},

		_altCollapse: {
			type: String
		},

		_computeRowAriaLabelCallback: {
			type: Function,
			value: function () {
				return this._computeRowAriaLabel.bind(this);
			}
		}
	},

    observers: [
		"_notifyResize(_locations, opened, 500)",
	],

    attached: function () {
		var __dictionary__header = "Locations";
		this.set("_header", __dictionary__header);

		var __dictionary__altExpand = "Expand locations section";
		var __dictionary__altCollapse = "Collapse locations section";
		this.set("_altExpand", __dictionary__altExpand);
		this.set("_altCollapse", __dictionary__altCollapse);
	},

    _onRouteActive: function (e) {
		if (e.detail.active) {
			afterNextRender(this, function () {
				this.$.locationService.refreshTaskLocations(this._taskLocationsParams.taskId);
			});
		}
	},

    _computeLocationName: function (item) {
		return this._locationAlternative(item) !== "" ? this._locationAlternative(item) : this._locationBuilding(item);
	},

    _navigateToLocationDetails: function (e) {
		e.stopPropagation();
		var selectedLocation = e.detail.item || e.model.item;
		TriroutesTask.getInstance().openTaskLocationDetails(selectedLocation._id);
	},

    _computeLocationsCount: function (locations) {
		return locations.length;
	},

    _computeLocationsList: function (locations, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (opened) ? locations : [];
	},

    _computePlaceholderIcon: function (location) {
		return (location && location.typeENUS == "Building") ? "ibm:buildings" : "ibm-glyphs:room-function";
	},

    _computeRowAriaLabel: function (item) {
		var __dictionary__locationRowAriaLabel = "This location is in";
		return __dictionary__locationRowAriaLabel + " " + this._computeLocationName(item) + "."
	}
});