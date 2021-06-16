/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { importJs, getModuleUrl } from "../tricore-util/tricore-util.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";

import "../triplat-routing/triplat-routing.js";

import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../triblock-tabs/triblock-tabs.js";
import "../triblock-side-nav/triblock-side-nav.js";
import "../@polymer/iron-pages/iron-pages.js";
import "./tristyles-locate-app.js";
import { TriLocateAppUtilsBehavior } from "./tribehav-locate-app-utils.js";
import "./tripage-locate-person.js";
import "./tripage-locate-room.js";

Polymer({
    _template: html`
		<style include="shared-app-layout-styles shared-page-styles tristyles-theme">

				:host {
					background-color: var(--ibm-neutral-2);
				}

				:host(:not([small-screen-width])) {
					@apply --layout-horizontal;
				}
				
				:host([small-screen-width]) {
					@apply --layout-vertical;
				}

				iron-pages {
					overflow-y: auto;
				}

				.side-nav-container {
					@apply --layout-vertical;
				}

				triblock-side-nav {
					background-color: var(--tri-header-background-color);
					padding-top: 71px;
					@apply --layout-flex;
				}

				triblock-tabs {
					--triblock-tabs-height: 60px;
					--triblock-tabs-tricontent: {
						@apply --layout-vertical;
						@apply --layout-center;
					}
					--triblock-tabs-icon: {
						padding: 0;
					}
				}

				triblock-popup {
					padding: 0px;
				}
			
		</style>

		<triplat-route id="locatePersonRoute" name="locatePerson" path="/person/:personId" active="{{_personRouteActive}}" on-params-changed="_handlePersonParamsChanged">
		</triplat-route>
		<triplat-route id="locateRoomRoute" name="locateRoom" path="/room/:roomId" active="{{_roomRouteActive}}" on-params-changed="_handleRoomParamsChanged">
		</triplat-route>
		
		<div class="side-nav-container" hidden\$="[[smallScreenWidth]]">
			<triblock-side-nav>
				<triblock-side-nav-item id="personNav" icon="ibm-glyphs:user" label="Person" triplat-route-id="locatePersonRoute" triplat-route-params="[[_personRouteParams]]" slot="side-nav-item">
				</triblock-side-nav-item>
				<triblock-side-nav-item id="roomNav" icon="ibm-glyphs:room-function" triplat-route-id="locateRoomRoute" label="Room" triplat-route-params="[[_roomRouteParams]]" slot="side-nav-item"></triblock-side-nav-item>
			</triblock-side-nav>
		</div>

		<triplat-route-selector>
			<iron-pages selected-attribute="opened">
				<div route="locatePerson">
					<dom-if if="[[_personRouteActive]]">
						<template>
							<tripage-locate-person id="locatePersonPage" opened="[[_personRouteActive]]"
								person-record-id="[[_personRecordId]]">
							</tripage-locate-person>
						</template>
					</dom-if>
				</div>
				<div route="locateRoom">
					<dom-if if="[[_roomRouteActive]]">
						<template>
							<tripage-locate-room id="locateRoomPage" override-building-id="[[overrideBuildingId]]" opened="[[_roomRouteActive]]"
								room-record-id="[[_roomRecordId]]">
							</tripage-locate-room>
						</template>
					</dom-if>
				</div>				
			</iron-pages>
		</triplat-route-selector>

		<div hidden\$="[[!smallScreenWidth]]">
			<triblock-tabs primary="" fit-container="" hide-scroll-buttons="">
				<triblock-tab id="personTab" icon="ibm-glyphs:user" triplat-route-id="locatePersonRoute" label="Person" triplat-route-params="[[_personRouteParams]]" slot="tab">
				</triblock-tab>
				<triblock-tab id="roomTab" icon="ibm-glyphs:room-function" triplat-route-id="locateRoomRoute" label="Room" triplat-route-params="[[_roomRouteParams]]" slot="tab"></triblock-tab>
			</triblock-tabs>
		</div>
	`,

    is: "trimain-locate",

    behaviors: [
		TriBlockViewResponsiveBehavior,
		TriLocateAppUtilsBehavior
	],

    properties: {
		overrideBuildingId: {
			type: String
		},
		_personRouteActive: Boolean,
		_roomRouteActive: Boolean,

		_personRouteParams: {
			type: Object,
			value: function() {
				return { personId: -1 };
			}
		},

		_roomRouteParams: {
			type: Object,
			value: function() {
				return { roomId: -1 };
			}
		},

		_roomRecordId: {
			type: String,
			value: null
		},

		_personRecordId: {
			type: String,
			value: null
		}
	},

    listeners: {
		'navigate-default': '_navigateDefaultRoute',
		'navigate-locate-person': '_navigateToPersonRoute',
		'navigate-locate-room': '_navigateToRoomRoute'
	},

    _navigateDefaultRoute: function (e) {
		this.$.locatePersonRoute.navigate({ personId: "-1" });
	},

    _navigateToPersonRoute: function(e) {
		this.$.locatePersonRoute.navigate(e.detail);
	},

    _navigateToRoomRoute: function(e) {
		this.$.locateRoomRoute.navigate(e.detail);
	},

    _handlePersonParamsChanged: function(e) {
		afterNextRender(this, () => {
			if (this.$.locatePersonRoute.active) {
				var personRouteParams = this.$.locatePersonRoute.params;
				this._personRecordId = personRouteParams.personId == -1 ? null : personRouteParams.personId;
				this._personRouteParams = { personId: !personRouteParams.personId ? -1 : personRouteParams.personId};
			}
		})
	},

    _handleRoomParamsChanged: function(e) {
		afterNextRender(this, () => {
			if (this.$.locateRoomRoute.active) {
				var roomRouteParams = this.$.locateRoomRoute.params;
				this._roomRecordId = roomRouteParams.roomId == -1 ? null : roomRouteParams.roomId;
				this._roomRouteParams = { roomId: !roomRouteParams.roomId ? -1 : roomRouteParams.roomId};
			}
		});
	},

    importMeta: getModuleUrl("triview-locate/trimain-locate.js")
});