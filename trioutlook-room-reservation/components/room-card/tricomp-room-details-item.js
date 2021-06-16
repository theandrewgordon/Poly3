/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/paper-button/paper-button.js";
import "./tricomp-room-details-card.js";
import "./tricomp-room-card-favorite.js";
import "../../styles/tristyles-carbon-theme.js";
import { isEmptyArray } from "../../utils/triutils-utilities.js";

class TricompRoomDetailsItem extends PolymerElement {
	static get is() { return "tricomp-room-details-item"; }

	static get template() {
		return html `
			<style include="carbon-style">
				:host {
					@apply --layout-flex;
				}
				
				.room-details-item {
					@apply (--layout-flex);
					background-color: var(--carbon-ui-01);
					padding: 20px;
					border: 1px solid var(--carbon-ui-03); 
				}

				.room-details-buttons {
					@apply --layout-flex;
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --layout-center-justified;
				}

				.header-top-row {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.unavailable {
					padding-left: 10px;
					padding-right: 10px;
					font-style: italic;
				}

				.favorite {
					padding-left: 4px;
					padding-right: 4px;
					cursor: pointer;
				}

			</style>
			<div class="room-details-item">
				<div class="header-top-row productive-heading-03 bottom-8">
					<span>[[selected.name]]</span>
					<tricomp-room-card-favorite class="favorite" in-popup room="[[selected]]"></tricomp-room-card-favorite>
				</div>
				<tricomp-room-details-card class="bottom-16" is-recurring="[[isRecurring]]" added="[[_computeIsAddedRoom(selected)]]" room="[[selected]]"></tricomp-room-details-card>
				<div class="room-details-buttons">
					<paper-button outlook-secondary on-tap="_handleHideRoomDetails">Close</paper-button>
					<dom-if if="[[_computeIsAddedRoom(selected)]]">
						<template>
							<paper-button outlook-secondary on-tap="_handleRemoveTapped">Remove room</paper-button>
						</template>
					</dom-if>
					<dom-if if="[[!_computeIsAddedRoom(selected)]]">
						<template>
							<dom-if if="[[_computeAvailable(selected)]]">
								<template>
									<paper-button outlook-primary on-tap="_handleAddTapped">Add room</paper-button>
								</template>
							</dom-if>
							<dom-if if="[[!_computeAvailable(selected)]]">
								<template>
									<div class="body-short-01 unavailable">Unavailable</div>
								</template>
							</dom-if>
						</template>
					</dom-if>
				</div>
			</div>
		`
	}

	static get properties() {
		return {
			selected: {
				type: Object,
				notify: true
			},

			addedRooms: {
				type: Array
			},

			isRecurring: {
				type: Boolean
			}
		}
	}

	_handleHideRoomDetails(e) {
		e.stopPropagation();
		this.set("selected", null);
	}

	_computeAvailable(room) {
		return room && !room.isUnavailable;
	}

	_computeIsAddedRoom(room) {
		return (room && !isEmptyArray(this.addedRooms)) ? this.addedRooms.findIndex(addedRoom => addedRoom._id === room._id) !== -1 : false;
	}

	_handleAddTapped(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('add-room-tapped', {bubbles: true, composed: true})); 
	}

	_handleRemoveTapped(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('remove-room-tapped', {bubbles: true, composed: true})); 
	}
}

window.customElements.define(TricompRoomDetailsItem.is, TricompRoomDetailsItem);