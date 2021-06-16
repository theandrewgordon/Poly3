/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../styles/tristyles-carbon-theme.js";
import { isEmptyArray } from "../../utils/triutils-utilities.js";
import { saveDataToLocal } from "../../utils/triutils-localstorage.js";
import "../accordion/tricomp-accordion.js"
import { TrimixinAccordion } from "../accordion/trimixin-accordion.js";
import "../room-card/tricomp-room-card.js";
import { getTriserviceOutlook } from "../../services/triservice-outlook.js";
import { getTriserviceRecurrence } from "../../services/triservice-recurrence.js";

class TricompRoomsAccordion extends TrimixinAccordion(PolymerElement) {
	static get is() { return "tricomp-rooms-accordion"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					display: block;
				}

				tricomp-accordion {
					--tricomp-accordion-header: {
						margin-bottom: 16px;
						padding: 0;
					}
				}

				.building-name {
					color: var(--carbon-link-01);
				}

				tricomp-room-card, .accordion-header {
					cursor: pointer;
				}

				.accordion-header:hover {
					text-decoration: underline;
					text-decoration-color: var(--carbon-link-01);
				}
			</style>

			<tricomp-accordion opened="{{_opened}}">
				<div class="accordion-header" slot="accordion-header" on-tap="_handleHeaderTap">
					<span class="building-name">[[building]]</span> - [[floor]]
				</div>
				<div slot="accordion-content">
					<dom-repeat items="[[rooms]]" as="room">
						<template>
							<tricomp-room-card
								class="bottom-16"
								room="[[room]]"
								on-tap="_handleRoomTap">
								</tricomp-room-card>
						</template>
					</dom-repeat>
				</div>
			</tricomp-accordion>
		`;
	}

	static get properties() {
		return {
			building: {
				type: String
			},

			floor: {
				type: String
			},

			rooms: {
				type: Array
			}
		};
	}

	openAccordionIsLessThan(number) {
		const rooms = this.rooms;
		this._opened = !isEmptyArray(rooms) && rooms.length < number;
	}

	_handleRoomTap(e) {
		e.stopPropagation();
		const room = e.target.room;
		const url = '#!/roomDetail/' + room._id + '/' + 'false';
		saveDataToLocal(room, 'roomDetail');
		saveDataToLocal(getTriserviceRecurrence().isRecurring, 'isRecurring');
		getTriserviceOutlook().openDialog(url);
	}

	_handleHeaderTap(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('building-floor-header-tapped', {
			detail: {
				cityId: this.rooms[0].citySystemRecordID,
				propertyId: this.rooms[0].propertySystemRecordID,
				buildingId: this.rooms[0].buildingSystemRecordID,
				floorId: this.rooms[0].floorSystemRecordID
			},
			bubbles: true,
			composed: true
		}));
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/rooms-accordion/tricomp-rooms-accordion.js");
	}
}

window.customElements.define(TricompRoomsAccordion.is, TricompRoomsAccordion);