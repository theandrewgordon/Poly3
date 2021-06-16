/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../components/room-card/tricomp-room-card.js";
import "../../styles/tristyles-app.js";
import "../../styles/tristyles-carbon-theme.js";
import { getTriserviceOutlook } from "../../services/triservice-outlook.js";
import { saveDataToLocal } from "../../utils/triutils-localstorage.js";

class TricompAddedRooms extends PolymerElement {
	static get is() { return "tricomp-added-rooms"; }

	static get template() {
		return html`
			<style include="room-reservation-app-styles carbon-style">
				:host {
					@apply --layout-vertical;
				}
				
				tricomp-room-card {
					cursor: pointer;
				}
			</style>

			<div class="productive-heading-03 bottom-16">Added Meeting Rooms</div>

			<div class="divider divider-horizontal bottom-20"></div>

			<dom-repeat items="[[rooms]]" as="room">
				<template>
					<tricomp-room-card
						class="bottom-16"
						room="[[room]]"
						added
						on-tap="_handleRoomTap">
						</tricomp-room-card>
				</template>
			</dom-repeat>
		`;
	}

	static get properties() {
		return {
			rooms: {
				type: Array
			}
		};
	}

	_handleRoomTap(e) {
		e.stopPropagation();
		const room = e.target.room;
		const url = '#!/roomDetail/' + room._id + '/' + true;
		saveDataToLocal(room, 'roomDetail');
		getTriserviceOutlook().openDialog(url);
	}

}

window.customElements.define(TricompAddedRooms.is, TricompAddedRooms);