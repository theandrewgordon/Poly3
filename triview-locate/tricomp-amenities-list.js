/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/paper-tooltip/paper-tooltip.js";
import "../triplat-icon/ibm-icons-glyphs.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-horizontal;
					@apply --layout-wrap;
				}

				.room-service-icon {
					--iron-icon-width: 20px;
					--iron-icon-height: 20px;
					padding: 5px;
				}
			
		</style>

		<div hidden\$="[[!catering]]">
			<iron-icon class="room-service-icon" icon="ibm-glyphs:catering"></iron-icon>
			<paper-tooltip fit-to-visible-bounds="" position="top" offset="5" animation-delay="100">Catering</paper-tooltip>
		</div>
		<div hidden\$="[[!disabledAccess]]">
			<iron-icon class="room-service-icon" icon="ibm-glyphs:accessibility"></iron-icon>
			<paper-tooltip fit-to-visible-bounds="" position="top" offset="5" animation-delay="100">Accessible</paper-tooltip>
		</div>
		<div hidden\$="[[!networkConnection]]">
			<iron-icon class="room-service-icon" icon="ibm-glyphs:wired"></iron-icon>
			<paper-tooltip fit-to-visible-bounds="" position="top" offset="5" animation-delay="100">Network Connection</paper-tooltip>
		</div>
		<div hidden\$="[[!projector]]">
			<iron-icon class="room-service-icon" icon="ibm-glyphs:projector"></iron-icon>
			<paper-tooltip fit-to-visible-bounds="" position="top" offset="5" animation-delay="100">Projector</paper-tooltip>
		</div>
		<div hidden\$="[[!phoneConference]]">
			<iron-icon class="room-service-icon" icon="ibm-glyphs:phone-call"></iron-icon>
			<paper-tooltip fit-to-visible-bounds="" position="top" offset="5" animation-delay="100">Telephone Conference</paper-tooltip>
		</div>
		<div hidden\$="[[!videoConference]]">
			<iron-icon class="room-service-icon" icon="ibm-glyphs:video"></iron-icon>
			<paper-tooltip fit-to-visible-bounds="" position="top" offset="5" animation-delay="100">Video Conference</paper-tooltip>
		</div>
		<div hidden\$="[[!whiteboard]]">
			<iron-icon class="room-service-icon" icon="ibm-glyphs:whiteboard"></iron-icon>
			<paper-tooltip fit-to-visible-bounds="" position="top" offset="5" animation-delay="100">Whiteboard</paper-tooltip>
		</div>
	`,

    is: "tricomp-amenities-list",

    properties: {
		catering: {
			type: Boolean,
			value: false
		},
		disabledAccess: {
			type: Boolean,
			value: false
		},
		networkConnection: {
			type: Boolean,
			value: false
		},
		phoneConference: {
			type: Boolean,
			value: false
		},
		projector: {
			type: Boolean,
			value: false
		},
		videoConference: {
			type: Boolean,
			value: false
		},
		whiteboard: {
			type: Boolean,
			value: false
		}
	}
});