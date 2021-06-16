/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/paper-button/paper-button.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-image/triplat-image.js";
import "../../../triplat-icon/ibm-icons.js";

import "../../styles/tristyles-app.js";
import "../../styles/tristyles-carbon-theme.js";
import "./tricomp-room-card-amenities.js";
import "./tricomp-room-card-recurrence.js";
import "./tricomp-room-card-added.js";

class TricompRoomDetailsCard extends PolymerElement {
	static get is() { return "tricomp-room-details-card"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-horizontal;
					background-color: var(--carbon-ui-01);
				}

				.image-container {
					@apply --layout-center;
					@apply --layout-vertical;
					width: 140px;
					height: 140px;
					min-height: 98px;
					position: relative;
					flex-shrink: 0;
				}

				triplat-image {
					@apply --layout-vertical;
					width: 140px;
					height: 140px;
					min-height: 98px;
					--triplat-image-wrap: {
						@apply --layout-flex;
						@apply --layout-self-stretch;
					};
					--triplat-image-iron-image: {
						@apply --layout-flex;
						@apply --layout-self-stretch;
					};
					--triplat-image-placeholder-icon: {
						color: var(--carbon-icon-02);
						height: 130px;
						width: 130px;
					};
				}

				.recurrence {
					@apply --layout-vertical;
					position: absolute;
					right: 0px;
					bottom: 0px;
					left: 0px;
				}

				.content {
					@apply --layout-horizontal;
					padding: 0px 16px;
				}

				tricomp-room-card-amenities {
					@apply --layout-flex;
				}

				.details {
					@apply --layout-vertical;
				}

				.right-section {
					padding-left: 15px;
					padding-right: 15px;
				}
			</style>

			<div class="image-container">
				<triplat-image src="[[room.image]]" sizing="cover" placeholder-icon="ibm:picturefile"></triplat-image>
				<dom-if if="[[_displayRecurrence(isRecurring, room.isUnavailable, added)]]" restamp>
					<template>
						<tricomp-room-card-recurrence class="recurrence" room="[[room]]"></tricomp-room-card-recurrence>
					</template>
				</dom-if>

				<dom-if if="[[added]]" restamp>
					<template>
						<tricomp-room-card-added></tricomp-room-card-added>
					</template>
				</dom-if>
			</div>
			<div class="content">
				<div class="details">
					<div class="details">
						<span class="productive-heading-01 bottom-8">Capacity</span>
						<span class="body-short-01 bottom-20">[[room.capacity]] [[_calcPersonStr(room.capacity)]]</span>
					</div>
					<div class="details">
						<span class="productive-heading-01 bottom-8">Room Layout</span>
						<span class="body-short-01 bottom-8">[[room.layoutType]]</span>
					</div>
				</div>
				<div class="right-section details">
					<span class="productive-heading-01 bottom-8">Room Amenities</span>
					<dom-if if="[[_hasAnyAmenity(room)]]" restamp>
						<template>
							<tricomp-room-card-amenities room="[[room]]" more-detail></tricomp-room-card-amenities>
						</template>
					</dom-if>
				</div>

			</div>
		`;
	}

	static get properties() {
		return {
			room: {
				type: Object
			},

			isRecurring: {
				type: Boolean
			},
			
			added: {
				type: Boolean
			}
		};
	}

	_hasAnyAmenity(room) {
		return room && (room.cateringAvailable === "Yes" || room.adaAvailable === "Yes" || room.inRoomProjector === "Yes" || room.telephoneConference === "Yes" || room.whiteboard === "Yes" ||room.videoConferenceRoom === "Yes");
	}

	_calcPersonStr(capacity) {
		const __dictionary__person = "person";
		const __dictionary__people = "people";
		return capacity > 1 ? __dictionary__people : __dictionary__person;
	}

	_displayRecurrence(isRecurring, isUnavailable, added) {
		return isRecurring && !isUnavailable && !added;
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-card/tricomp-room-details-card.js");
	}
}

window.customElements.define(TricompRoomDetailsCard.is, TricompRoomDetailsCard);