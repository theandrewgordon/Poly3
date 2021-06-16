/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/iron-collapse/iron-collapse.js";
import "../@polymer/iron-pages/iron-pages.js";
import "../@polymer/paper-button/paper-button.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-route.js";
import "../triblock-popup/triblock-popup.js";
import "../triblock-tabs/triblock-tabs.js";
import "././tricomp-room-floorplan-selector.js";
import "././tricomp-room-list-selector.js";
import "././triservice-new-work-task.js";
import "./tristyles-work-task-app.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="work-task-tabs tristyles-theme">

				#popup {
					@apply --layout-vertical;
					width: 80%;
					height: 80%;
					max-width: 650px;
					padding: 15px 0px 0px 0px;
				}

				:host(:not([small-layout])) #popup {
					border:5px solid var(--tri-primary-content-accent-color);
				}

				:host([small-layout]) #popup {
					max-width: none;
				}

				.no-spaces-alert {
					@apply --layout-flex;
					@apply --layout-vertical;
					@apply --layout-center-center;
					font-weight: bolder;
				}

				.popup-header {
					@apply --layout-horizontal;
					border-bottom: 1px solid var(--tri-primary-content-accent-color);
				}

				:host([small-layout]) .popup-header {
					@apply --layout-vertical;
				}

				.building-room-header {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				:host([dir="ltr"]) .building-room-text {
					padding-left: 15px;
				}

				:host([dir="rtl"]) .building-room-text {
					padding-right: 15px;
				}

				.building-room-text {
					font-size: 18px;
					color:#464646;
				}

				.header-divider {
					height: 32px;
				}

				:host([small-layout]) .header-divider {
					display: none;
				}

				:host([dir="ltr"]) .header-divider {
					padding-right: 15px;
					border-right: 1px solid var(--tri-primary-content-accent-color);
				}

				:host([dir="rtl"]) .header-divider {
					padding-left: 15px;
					border-left: 1px solid var(--tri-primary-content-accent-color);
				}

				triblock-tabs {
					min-width: 250px;
					--triblock-tabs-height: 45px;
				}

				:host(:not([small-layout])) triblock-tabs {
					@apply --layout-flex;
				}

				iron-pages {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				iron-pages * {
					@apply --layout-flex;
				}

				.loading-indicator {
					--triplat-loading-indicator-clear-background: transparent;
				}
				
				.room-details-collapse {
					@apply --layout-horizontal;
					position: absolute;
					right: 0;
					bottom: 0;
					left: 0;
					background-color: var(--tri-body-background-color);
				}
				
				.room-details-container {
					@apply --layout-flex;
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 11px;
				}
				
				.room-details-text {
					@apply --layout-flex;
					@apply --layout-vertical;
				}
				
				.room-name {
					font-weight: bolder;
				}

				:host([small-layout]) triblock-popup {
					padding: 10px;
				}
			
		</style>

		<triplat-route name="taskFloorplanDetail" on-route-active="_onRouteActive"></triplat-route>
		
		<triservice-new-work-task id="newWorkTaskService" rooms-for-floor="{{_roomsList}}">
		</triservice-new-work-task>

		<triblock-popup id="popup" with-backdrop="" title="Select a Room" modal="" on-iron-overlay-canceled="_historyBack" aria-label="Select a Room" restore-focus-on-close="" small-screen-width="[[smallLayout]]" disable-screen-size-detection>
			<template is="dom-if" if="[[!_showNoRoomMessage]]">
				<div class="popup-header">
					<div class="building-room-header">
						<span class="building-room-text">[[building.value]], [[floor.value]]</span>
						<div class="header-divider"></div>
					</div>
					<triblock-tabs selected="{{_selectedTab}}" hidden\$="[[_showOnlyList]]" fit-container="">
						<triblock-tab id="floorplanTab" label="Floor Plan" slot="tab"></triblock-tab>
						<triblock-tab id="listTab" label="List" slot="tab"></triblock-tab>
					</triblock-tabs>
				</div>

				<iron-pages selected="{{_selectedTab}}" selected-attribute="enabled" attr-for-selected="tab">
					<tricomp-room-floorplan-selector tab="floorplanTab" rooms-list="[[_roomsList]]" floor-id="[[_floorId]]" selected-space="{{_selectedSpace}}" current-room="[[_currentRoom]]" loading="{{_graphicLoading}}" has-graphic="{{_hasGraphic}}" svg-aria-label="[[floor.value]]">
					</tricomp-room-floorplan-selector>

					<tricomp-room-list-selector id="listSelector" tab="listTab" rooms-list="[[_roomsList]]" selected-space="{{_selectedSpace}}" current-room="[[_currentRoom]]">
					</tricomp-room-list-selector>
				</iron-pages>
			</template>

			<template is="dom-if" if="[[_showNoRoomMessage]]">
				<div class="no-spaces-alert">
					<span class="tri-h2">There are no rooms to display.</span>
				</div>
			</template>

			<triplat-loading-indicator class="loading-indicator" show="[[_computeLoading(_graphicLoading)]]">
			</triplat-loading-indicator>

			<iron-collapse class="room-details-collapse" opened="[[_computeShowRoomDetails(_selectedSpace)]]">
				<div class="room-details-container">
					<div class="room-details-text">
						<div class="room-name tri-h3">[[_selectedSpace.space]]</div>
						<template is="dom-repeat" items="[[_selectedSpace.peopleList]]">
							<span>[[item]]</span>
						</template>
						<span>[[_selectedSpace.spaceClass]]</span>
					</div>
					<paper-button id="selectRoomButton" on-tap="_selectRoom">Select Room</paper-button>
				</div>
			</iron-collapse>
		</triblock-popup>
	`,

    is: "tricomp-room-search-popup",
    behaviors: [ 
			TriDirBehavior
		],

    properties: {
		building: {
			type: Object
		},

		floor: {
			type: Object
		},

		room: {
			type: Object,
			notify: true
		},

		_selectedSpace: {
			type: Object
		},

		_roomsList: {
			type: Array,notify: true,
			observer: "_handleRoomListChange"
		},

		_showNoRoomMessage: {
			type: Boolean,
			value: false
		},

		_floorId: {
			type: String
		},

		_currentRoom: {
			type: Object,
			value: null
		},

		_graphicLoading: {
			type: Boolean,
			value: false
		},

		_hasGraphic: {
			type: Boolean,
			value: false
		},

		_selectedTab: {
			type: String
		},

		_showOnlyList: {
			type: Boolean,
			value: false
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		"_computeShowOnlyList(_hasGraphic, _graphicLoading)"
	],

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this._selectedSpace = null;
				if (this._isNotEmpty(this.building) && this._isNotEmpty(this.floor)) {
					this.$$("#listSelector").refresh();
					this.$.popup.openPopup();
					if (this._floorId != this.floor.id) {
						this._selectedTab = "floorplanTab";
						this._floorId = this.floor.id;
					}
					this._currentRoom = this._isNotEmpty(this.room) ? { _id: this.room.id } : null;
				}
			});
		} else {
			this.$.popup.closePopup();
		}
	},

    _historyBack: function(e) {
		window.history.back();
	},

    _isNotEmpty: function (obj) {
		return obj != null && obj.id != null && obj.id != "";
	},

    _computeLoading: function (graphicLoading) {
		return graphicLoading;
	},

    _computeShowRoomDetails: function (selectedSpace) {
		if (selectedSpace != null && (this._currentRoom == null || selectedSpace._id != this._currentRoom._id)) {
			this.$.selectRoomButton.setAttribute('aria-hidden', 'false');
			return true;
		} else {
			this.$.selectRoomButton.setAttribute('aria-hidden', 'true');
			return false;
		}
	},

    _selectRoom: function () {
		this.room = {
			id: this._selectedSpace._id,
			value: this._selectedSpace.space
		};
		this._historyBack();
	},

    _handleRoomListChange: function (newRoomList) {
		this._showNoRoomMessage = newRoomList && newRoomList.length == 0;
	},

    _computeShowOnlyList: function(hasGraphic, graphicLoading) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this._showOnlyList = !graphicLoading && !hasGraphic;
		var  selectedTab = "";

		if (this._showOnlyList) {
			selectedTab = "listTab";
		} else {
			selectedTab = "floorplanTab";
		}

		this.debounce(
			"tricomp-room-selector-popup-set-selected-tab",
			this.set.bind(this, "_selectedTab",  selectedTab),
			20
		);
	}
});