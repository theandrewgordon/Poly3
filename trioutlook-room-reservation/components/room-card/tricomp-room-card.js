/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-icon/iron-icon.js";

import "../../../@polymer/paper-button/paper-button.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/carbon-icons-16.js";
import "../../../triplat-image/triplat-image.js";

import { getTriserviceOutlook } from "../../services/triservice-outlook.js";
import "../../services/triservice-recurrence.js";
import "../../styles/tristyles-app.js";
import "../../styles/tristyles-carbon-theme.js";
import "./tricomp-room-card-amenities.js";
import "./tricomp-room-card-favorite.js";
import "./tricomp-room-card-recurrence.js";
import "./tricomp-room-card-added.js";

class TricompRoomCard extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-room-card"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-horizontal;
					background-color: var(--carbon-ui-01);
				}

				:host([_is-unavailable]) {
					opacity: 0.6;
				}

				.image-container {
					@apply --layout-center;
					@apply --layout-vertical;
					width: 98px;
					min-height: 98px;
					position: relative;
					flex-shrink: 0;
				}

				triplat-image {
					@apply --layout-flex;
					@apply --layout-self-stretch;
					@apply --layout-vertical;
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
						height: 80px;
						width: 80px;
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
					@apply --layout-flex;
					padding: 8px 16px;
				}

				.name {
					@apply --layout-center;
					@apply --layout-horizontal;
					font-weight: bold;
				}

				.name span {
					@apply --layout-flex;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-word;
				}
				:host([dir="ltr"]) .name span {
					margin-right: 4px;
				}
				:host([dir="rtl"]) .name span {
					margin-left: 4px;
				}

				.icons {
					@apply --layout-center;
					@apply --layout-horizontal;
					@apply --layout-wrap;
					font-size: 12px;
				}

				.icons > * {
					padding: 2px 0;
				}

				.avatar-icon {
					height: 16px;
					width: 16px;
				}

				.capacity {
					margin: 0 3px;
				}

				.divider {
					@apply --layout-self-center;
					height: 14px;
					margin: 0 4px;
				}

				tricomp-room-card-amenities {
					@apply --layout-flex;
				}

				:host paper-button {
					display: inline-block;
					margin: 0;
				}

				.unavailable {
					font-style: italic;
				}
			</style>

			<triservice-recurrence is-recurring="{{_isRecurring}}"></triservice-recurrence>

			<div class="image-container">
				<triplat-image src="[[room.image]]" sizing="cover" placeholder-icon="ibm:picturefile"></triplat-image>
				<dom-if if="[[_displayRecurrence(_isRecurring, room.isUnavailable, added)]]" restamp>
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
				<div class="name productive-heading-01 bottom-8">
					<span>[[room.name]]</span>
					<tricomp-room-card-favorite room="[[room]]"></tricomp-room-card-favorite>
				</div>

				<div class="icons bottom-8">
					<iron-icon class="avatar-icon" icon="carbon-16:avatar"></iron-icon><span class="helper-text-01 capacity">[[room.capacity]]</span>

					<dom-if if="[[_hasAnyAmenity(room)]]" restamp>
						<template>
							<div class="divider divider-vertical"></div>
							<tricomp-room-card-amenities room="[[room]]"></tricomp-room-card-amenities>
						</template>
					</dom-if>
				</div>

				<div>
					<dom-if if="[[!_isUnavailable]]" restamp>
						<template>
							<dom-if if="[[!added]]" restamp>
								<template>
									<paper-button outlook-primary on-tap="_onAddRoomTapped">Add room</paper-button>
								</template>
							</dom-if>
							<dom-if if="[[added]]" restamp>
								<template>
									<paper-button outlook-secondary on-tap="_onRemoveRoomTapped">Remove room</paper-button>
								</template>
							</dom-if>
						</template>
					</dom-if>

					<dom-if if="[[_isUnavailable]]" restamp>
						<template>
							<div class="body-short-01 unavailable">Unavailable</div>
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

			/**
			 * Flag to indicate an added room.
			 */
			added: {
				type: Boolean,
				value: false
			},

			_isRecurring: {
				type: Boolean
			},

			_isUnavailable: {
				type: Boolean,
				value: false,
				computed: "_computeIsUnavailable(room)",
				reflectToAttribute: true
			}
		};
	}

	_displayRecurrence(isRecurring, isUnavailable, added) {
		return isRecurring && !isUnavailable && !added;
	}

	_hasAnyAmenity(room) {
		return room && (room.cateringAvailable === "Yes" || room.adaAvailable === "Yes" || room.inRoomProjector === "Yes" || room.telephoneConference === "Yes" || room.whiteboard === "Yes" ||room.videoConferenceRoom === "Yes");
	}

	_computeIsUnavailable(room) {
		return room.isUnavailable;
	}

	_onAddRoomTapped(e) {
		e.stopPropagation();
		getTriserviceOutlook().addRoomToOutlookMeeting(this.room);
	}

	_onRemoveRoomTapped(e) {
		e.stopPropagation();
		getTriserviceOutlook().removeRoomFromOutlookMeeting(this.room);
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-card/tricomp-room-card.js");
	}
}

window.customElements.define(TricompRoomCard.is, TricompRoomCard);