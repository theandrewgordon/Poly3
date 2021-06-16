/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-pages/iron-pages.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-route.js";
import "../triblock-tabs/triblock-tabs.js";
import { TriLocationDetailsBehavior } from "./tribehav-location-details.js";
import "./triservice-work-task.js";
import "./triservice-location.js";
import "./tristyles-work-task-app.js";
import "./tricomp-task-id.js";
import "./tricomp-floor-plan.js";
import "./tricomp-procedures-link.js";
import "./tricomp-location-detail-card.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import "../triplat-bim/triplat-bim-model.js";
import "../triplat-bim/triplat-bim-viewer.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-tabs tristyles-theme">

				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.container, iron-pages, #floorplanPage {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				#bimPage {
					@apply --layout-flex;
				}

				.location-details {
					@apply --layout-horizontal;
					@apply --layout-center;
					box-shadow: var(--location-shadow,0);
				}

				.no-data-placeholder {
					@apply --layout-flex;
					@apply --layout-vertical;
					padding: 10px;
					min-height: 0;
					text-align: center;
				}

				tricomp-location-detail-card {
					padding: 20px 20px 10px 20px;
				}

				triblock-tabs {
					padding: 0 20px;
				}

				tricomp-floor-plan {
					--tricomp-floor-plan-expand-icon: {
						bottom: 60px;
					};

					--tricomp-floor-plan-footer-container: {
						bottom: 53px;
					}
				}
			
		</style>

		<triplat-route name="locationDetails" params="{{_locationDetailsParams}}" active="{{_opened}}" on-route-active="_onRouteActive"></triplat-route>

		<triservice-work-task id="workTaskService" small-layout="{{_smallLayout}}" space-label-styles="{{_spaceLabelStyles}}"></triservice-work-task>

		<triservice-location id="locationService" locations-with-primary="{{_locations}}" loading-locations="{{_loadingLocations}}"></triservice-location>

		<dom-if if="[[_loadBIM]]">
			<template>
				<triplat-bim-model id="bimModel" buildingspec="[[_buildingId]]" hasmodel="{{_hasBimModel}}" model="{{_bimModel}}"></triplat-bim-model>
			</template>
		</dom-if>


		<triplat-loading-indicator class="loading-indicator" show="[[_loadingLocations]]"></triplat-loading-indicator>

		<tricomp-task-id task="[[task]]" hidden\$="[[!_smallLayout]]"></tricomp-task-id>
		
		<div class="container">
			<div class="location-details">
				<tricomp-location-detail-card small-layout="[[_smallLayout]]" location="[[_location]]" map-link="[[_buildMapLink(_location)]]" show-directions-icon="" show-address="" hide-procedure-count="">
				</tricomp-location-detail-card>
				<tricomp-procedures-link id="proceduresLink" hidden\$="[[_smallLayout]]"></tricomp-procedures-link>
			</div>
			<template is="dom-if" if="[[_displayFloorBimStatus(_hasBimModel, _location, online)]]" restamp="">
				<div class="no-data-placeholder">Floor plan and BIM not available.</div>
			</template>
			<template is="dom-if" if="[[_displayOfflineStatus(online)]]" restamp="">
				<div class="no-data-placeholder">Floor plan and BIM not available in offline mode.</div>
			</template>
			<template is="dom-if" if="[[_displayBimFloorTab(_hasBimModel, online, _location)]]" restamp="">
				<triblock-tabs class="page-tabs" hide-scroll-buttons="" fit-container="[[_smallLayout]]" selected="{{_selectedTab}}">
					<triblock-tab id="floorPlanTab" label="Floor Plan" slot="tab"></triblock-tab>
					<triblock-tab id="bimTab" label="BIM" slot="tab"></triblock-tab>
				</triblock-tabs>
			</template>
			<iron-pages id="locationDetailsTabPages" selected="[[_selectedTab]]" attr-for-selected="tab">
				<div id="floorplanPage" tab="floorPlanTab">
					<tricomp-floor-plan id="floorPlan" small-layout="[[_smallLayout]]" online="[[online]]"></tricomp-floor-plan>
				</div>
				<div id="bimPage" tab="bimTab">
					<dom-if if="[[_loadBIM]]">
						<template>
							<triplat-bim-viewer id="bim" features="[[_viewerFeatures]]" recordkey="[[task._id]]"></triplat-bim-viewer>
						</template>
					</dom-if>
				</div>
			</iron-pages>
		</div>
	`,

    is: "tripage-location-details",

    behaviors: [
		TriLocationDetailsBehavior
	],

    properties: {
		currentUser: Object,
		task: Object,

		_locationDetailsParams: {
			type: Object,
			value: function() {
				return {};
			}
		},

		_locations: Array,
		_location: Object,

		_opened: {
			type: Boolean,
			value: false
		},

		_spaceLabelStyles: {
			type: Array
		},

		online: {
			type: Boolean,
			value: false
		},

		_selectedTab: {
			type: String,
			value: ""
		},

		_loadingLocations: {
			type: Boolean
		},

		_bimModel: {
			type: Object
		},

		_hasBimModel: {
			type: Boolean,
			value: false
		},

		_buildingId: {
			type: String,
			value: ""
		},

		_viewerFeatures: {
			type: Object,
			value: function() {
				return {
					views: true,
					markup: true,
					measure: true
				};
			}
		},

		_loadBIM: {
			type: Boolean,
			value: false
		},

		_smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		"_getLocationById(_locations, _locationDetailsParams)",
		"_onTabAndOnlineChanged(_location, _selectedTab, online)",
		"_onLocationChanged(_location, _opened)",		
		"_onGraphicBimLoaded(_location.hasGraphic,_hasBimModel, online)"
	],

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.locationService.refreshTaskLocations(this._locationDetailsParams.taskId).then(function() {
					this._buildingId = this._computeBuildingId(this._location);
				}.bind(this));
				if (this.online) {
					this.set("_loadBIM", true);
				}
			});
		} else {
			this._selectedTab = "";
			this.$.floorPlan.location = {};
			this.$.floorPlan.locationId = "";
		}
	},

    _onGraphicBimLoaded: function(hasGraphic,hasBim,online) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (hasGraphic) {
			this._selectedTab = "floorPlanTab";
			this.updateStyles({
				'--location-shadow': ""
			}, {});
		} else if (hasBim && online) {
			this.updateStyles({
				'--location-shadow': ""
			}, {});
			afterNextRender(this, function() {
				this._selectedTab = "bimTab";
			});
		} else {
			this._selectedTab = "";
			this.updateStyles({
				'--location-shadow': "0 2px 4px 0 rgba(0, 0, 0, .2)"
			}, {});
		}
	},

    _getLocationById: function(locations, params) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (locations && params && locations.length > 0) {
			var location = locations.find(function(location) {
					return location._id == params.locationId;
				}.bind(this)
			);
			this.set('_location', location);
		}
	},

    _onLocationChanged: function(location, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (location && opened) {
			afterNextRender(this, function() {
				this.$.proceduresLink.refreshLocationProcedures(this._locationDetailsParams.taskId, location);
			});
		}
	},

    _onTabAndOnlineChanged: function(location, selectedTab, online) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (location && location._id && selectedTab && selectedTab == "floorPlanTab" && online) {
			this.$.floorPlan.location = this._location;
			this.$.floorPlan.locationId = this._locationDetailsParams.locationId;
			this.$.floorPlan.labelStyles = this._spaceLabelStyles;
			this.$.floorPlan.opened = this._opened;
		} else if (location && location._id && selectedTab && selectedTab == "bimTab" && online) {
			this.shadowRoot.querySelector("#bim").model = this._bimModel;
			this.shadowRoot.querySelector("#bim").spaceid = this._computeBimViewerSpaceId(location);
		}
	},

    _computeBuildingId: function(location) {
		if (location && (location.typeENUS == "Space" || location.typeENUS == "Floor")) {
			return location.parentBuildingId;
		} else if (location && location.typeENUS == "Building") {
			return location._id;
		} else {
			return "";
		}
	},

    _displayBimFloorTab: function(hasBimModel, online, location) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return hasBimModel && online && location.hasGraphic;
	},

    _displayFloorBimStatus: function(hasBimModel, location, online) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !hasBimModel && !location.hasGraphic && online;
	},

    _displayOfflineStatus: function(online) {
		if(!online) {
			return true;
		}
	},

    _computeBimViewerSpaceId: function(location) {
		return (location && location.typeENUS == "Space") ? location._id : null;
	},

	importMeta: getModuleUrl("triview-work-task/tripage-location-details.js")
});