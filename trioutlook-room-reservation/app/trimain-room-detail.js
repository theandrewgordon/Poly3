/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../@polymer/polymer/lib/utils/render-status.js";
import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../@polymer/paper-icon-button/paper-icon-button.js";
import "../../triplat-icon/ibm-icons-glyphs.js";
import "../../triplat-routing/triplat-route.js";
import { TriDirBehavior } from "../../tricore-dir-behavior/tricore-dir-behavior.js";
import { TriPlatGraphicUtilitiesBehavior } from "../../triplat-graphic/triplat-graphic-utilities-behavior.js";
import "../components/room-card/tricomp-room-details-card.js";
import "../components/room-card/tricomp-room-card-favorite.js";
import "../components/floor-plan/tricomp-floor-plan.js";
import "../styles/tristyles-carbon-theme.js";
import "../services/triservice-favorite-rooms.js";
import "../services/triservice-rooms-search.js";
import { getTriserviceOutlook } from "../services/triservice-outlook.js";
import { getDataFromLocal } from "../utils/triutils-localstorage.js";

class TrimainRoomDetail extends mixinBehaviors([TriDirBehavior, TriPlatGraphicUtilitiesBehavior], PolymerElement) {
	static get is() { return "trimain-room-detail"; }

	static get template() {
		return html`
			<style include="carbon-style room-reservation-popup-styles">
				:host {
					@apply --layout-vertical;
					background-color: var(--carbon-ui-01);
					min-width: 600px;
				}

				.header {
					padding: 20px;
					background-color: var(--carbon-ui-02);
				}

				.content {
					@apply --layout-flex; 
					@apply --layout-vertical;
					padding: 20px;
				}

				.header-top-row {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.button {
					margin: 16px 0px 0px !important;
				}

				.room-location {
					padding: 0px 5px 8px;
					border-bottom: 2px solid var(--carbon-ui-03);
				}

				.floor-plan {
					@apply --layout-flex; 
					@apply --layout-vertical;
				}

				.favorite {
					padding-left: 4px;
					padding-right: 4px;
					cursor: pointer;
				}

				.unavailable {
					padding-left: 10px;
					padding-right: 10px;
					font-style: italic;
				}

			</style>

			<triservice-favorite-rooms></triservice-favorite-rooms>
			<triservice-rooms-search id="roomSearchService" reservable-room="{{_room}}" space-label-styles="{{_spaceLabelStyles}}"></triservice-rooms-search>

			<triplat-route name="roomDetail" on-route-active="_onRouteActive" active="{{_opened}}" params="{{_roomParams}}"></triplat-route>

			<paper-icon-button noink class="close" icon="ibm-glyphs:clear-input" alt="Close" on-tap="_handleClose"></paper-icon-button>
			<div class="header">
				<div class="header-top-row bottom-8">
					<div class="productive-heading-03">[[_room.name]]</div>
					<tricomp-room-card-favorite class="favorite" in-popup room="[[_room]]"></tricomp-room-card-favorite>
					<dom-if if="[[_computeShowUnavailable(_room, _roomParams.added)]]">
						<template>
							<div class="body-short-01 unavailable">Unavailable</div>
						</template>
					</dom-if>
				</div>
				<div class="helper-text-01">[[_computeLocation(_room)]]</div>
				
				<dom-if if="[[_computeShowAdd(_room.isUnavailable, _roomParams.added)]]">
					<template>
						<paper-button class="button" outlook-primary on-tap="_handleAdd">Add room</paper-button>
					</template>
				</dom-if>
				<dom-if if="[[_computeShowRemove(_room.isUnavailable, _roomParams.added)]]">
					<template>
						<paper-button class="button" outlook-secondary on-tap="_handleRemove">Remove room</paper-button>
					</template>
				</dom-if>
			</div>
			<div class="content">
				<div class="bottom-32">
					<tricomp-room-details-card room="[[_room]]" is-recurring="[[_isRecurring]]" added="[[_computeAdded(_roomParams.added)]]"></tricomp-room-details-card>
				</div>
				<div class="floor-plan">
					<div class="productive-heading-01 room-location">Room Location</div>
					<tricomp-floor-plan id="floorPlan"></tricomp-floor-plan>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			_room: {
				type: Object
			},

			_roomParams: {
				type: Object
			},

			_spaceLabelStyles: {
				type: Array
			},

			_opened: {
				type: Boolean
			},

			_isRecurring: {
				type: Boolean
			}
		}
	}

	constructor() {
		super();
		this._handleFaveRoomChangedListener = this._handleFaveRoomChanged.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('favorite-room-changed', this._handleFaveRoomChangedListener);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('favorite-room-changed', this._handleFaveRoomChangedListener);
	}

	_onRouteActive(e) {
		if (e.detail.active) {
			afterNextRender(this, () => {
				this.set('_room', getDataFromLocal('roomDetail'));
				this.set('_isRecurring', getDataFromLocal('isRecurring'));
				this.getDrawingId(this._room.floorSystemRecordID)
					.then(result => {
						this._room.hasGraphic = (result) ? true : false;
						const roomSearchService = this.shadowRoot.querySelector("#roomSearchService");
						const floorPlan = this.shadowRoot.querySelector("#floorPlan");
						if (this._room.hasGraphic) {
							this._room.drawingId = result;
							this._room.typeENUS = "Space";
							floorPlan.location = this._room;
							floorPlan.locationId = this._room._id;
							roomSearchService.getSpaceLabelStyles()
								.then(() => {
									floorPlan.labelStyles = this._spaceLabelStyles;
								});
						}
						floorPlan.opened = this._opened;
					});
			});
		}
	}

	_computeLocation(room) {
		return `${room.city ? room.city + ' - ' : ''}${room.property ? room.property + ' - ' : ''} ${room.building} - ${room.floor}`;
	}

	_handleClose(e) {
		e.stopPropagation();
		const messageObject = {messageType: "dialogClosed"};
		getTriserviceOutlook().messageParent(messageObject);
	}

	_computeShowAdd(unavailable, added) {
		return !unavailable && !this._computeAdded(added);
	}

	_computeShowRemove(unavailable, added) {
		return !unavailable && this._computeAdded(added);
	}

	_computeAdded(added) {
		return added === "true";
	}

	_handleAdd(e) {
		e.stopPropagation();
		const messageObject = {
			messageType: "dialogAction",
			message: "addRoom",
			room: this._room
		};
		getTriserviceOutlook().messageParent(messageObject);
	}

	_handleRemove(e) {
		e.stopPropagation();
		const messageObject = {
			messageType: "dialogAction",
			message: "removeRoom",
			room: this._room
		};
		getTriserviceOutlook().messageParent(messageObject);
	}

	_handleFaveRoomChanged(e) {
		e.stopPropagation();
		const messageObject = {
			messageType: "dialogAction",
			message: "favoriteToggled",
			room: this._room,
			isFavorite: e.detail.isFavorite
		};
		getTriserviceOutlook().messageParent(messageObject);
	}

	_computeShowUnavailable(room, added) {
		return room && room.isUnavailable && !this._computeAdded(added);
	}
};

window.customElements.define(TrimainRoomDetail.is, TrimainRoomDetail);