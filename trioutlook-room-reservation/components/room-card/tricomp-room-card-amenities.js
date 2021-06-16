/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import { getModuleUrl } from  "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";

import "../../../triplat-icon/carbon-icons-16.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../../triplat-icon/triplat-icon.js";
import "../../styles/tristyles-carbon-theme.js";

class TricompRoomCardAmenities extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-room-card-amenities"; }

	static get template() {
		return html`
			<style include="carbon-style">
				.container {
					@apply --layout-center;
					@apply --layout-horizontal;
					@apply --layout-wrap;
				}

				:host([more-detail]) .container {
					@apply --layout-vertical;
					@apply --layout-start;
					@apply --layout-flex;
					height: 100%;
					max-height: 110px;
				}

				triplat-icon {
					margin: 0 2px;
					--triplat-icon-height: 16px;
					--triplat-icon-width: 16px;
				}

				:host([more-detail]) triplat-icon {
					margin: 0px;
				}

				.list-item {
					@apply --layout-horizontal;
				}

				:host([dir="ltr"]) .list-item {
					margin-right: 5px;
				}

				:host([dir="rtl"]) .list-item {
					margin-left: 5px;
				}

				:host([more-detail]) .list-item {
					margin-bottom: 8px;
				}

				.body-short-01 {
					padding: 0px 5px;
				}
			</style>

			<div class="container">
				<dom-if if="[[_hasAmenity(room.cateringAvailable)]]">
					<template>
						<div class="list-item">
							<triplat-icon icon="carbon-16:restaurant"></triplat-icon>
							<dom-if if="[[moreDetail]]">
								<template>
									<span class="body-short-01">Catering available</span>
								</template>
							</dom-if>
						</div>
					</template>
				</dom-if>

				<dom-if if="[[_hasAmenity(room.adaAvailable)]]">
					<template>
						<div class="list-item">
							<triplat-icon icon="carbon-16:accessibility"></triplat-icon>
							<dom-if if="[[moreDetail]]">
								<template>
									<span class="body-short-01">Accessibility</span>
								</template>
							</dom-if>
						</div>
					</template>
				</dom-if>

				<dom-if if="[[_hasAmenity(room.inRoomProjector)]]">
					<template>
						<div class="list-item">
							<triplat-icon icon="carbon-16:video-on"></triplat-icon>
							<dom-if if="[[moreDetail]]">
								<template>
									<span class="body-short-01">Projector</span>
								</template>
							</dom-if>
						</div>
					</template>
				</dom-if>

				<dom-if if="[[_hasAmenity(room.telephoneConference)]]">
					<template>
						<div class="list-item">
							<triplat-icon icon="carbon-16:mobile"></triplat-icon>
							<dom-if if="[[moreDetail]]">
								<template>
									<span class="body-short-01">Phone</span>
								</template>
							</dom-if>
						</div>
					</template>
				</dom-if>

				<dom-if if="[[_hasAmenity(room.whiteboard)]]">
					<template>
						<div class="list-item">
							<triplat-icon icon="carbon-16:presentation"></triplat-icon>
							<dom-if if="[[moreDetail]]">
								<template>
									<span class="body-short-01">Whiteboard</span>
								</template>
							</dom-if>
						</div>
					</template>
				</dom-if>

				<dom-if if="[[_hasAmenity(room.videoConferenceRoom)]]">
					<template>
						<div class="list-item">
							<triplat-icon icon="carbon-16:desktop"></triplat-icon>
							<dom-if if="[[moreDetail]]">
								<template>
									<span class="body-short-01">TV screen</span>
								</template>
							</dom-if>
						</div>
					</template>
				</dom-if>

				<dom-if if="[[_hasAmenity(room.networkConnection)]]">
					<template>
						<div class="list-item">
							<triplat-icon icon="ibm-glyphs:wired"></triplat-icon>
							<dom-if if="[[moreDetail]]">
								<template>
									<span class="body-short-01">Network Connection</span>
								</template>
							</dom-if>
						</div>
					</template>
				</dom-if>
			</div>
		`;
	}

	static get properties() {
		return {
			room: {
				type: Object
			},

			moreDetail: {
				type: Boolean,
				reflectToAttribute: true
			}
		};
	}

	_hasAmenity(amenity) {
		return amenity && amenity === "Yes";
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-card/tricomp-room-card-amenities.js");
	}
}

window.customElements.define(TricompRoomCardAmenities.is, TricompRoomCardAmenities);