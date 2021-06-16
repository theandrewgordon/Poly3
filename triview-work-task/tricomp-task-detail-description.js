/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../triapp-task-list/tricomp-overflow-text.js";
import "./tristyles-work-task-app.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					display: block;
				}
				
				:host > div {
					background-color: var(--ibm-neutral-2);
				}

				.description-box {
					margin-top: 2px;
				}

				.requested-by-box {
					margin-top: 10px;
				}

				.requested-by-box {
					@apply --layout-center;
					@apply --layout-horizontal;
					margin-bottom: 15px;
				}

				.requested-by-divider {
					@apply --layout-self-stretch;
					margin: 0 10px;
				}

				.requested-by-phone {
					@apply --layout-center;
					@apply --layout-horizontal;
				}

				iron-icon {
					--iron-icon-fill-color: var(--tri-primary-color);
					--iron-icon-height: 20px;
					--iron-icon-width: 20px;
				}
			
		</style>

		<div>
			<label>Description</label>
			<tricomp-overflow-text class="description-box" lines="4" collapse="" hidden\$="[[!task.description]]" text="[[task.description]]">
			</tricomp-overflow-text>

			<div class="requested-by-box" hidden\$="[[!task.requestedByName]]">
				<div>[[task.requestedByName]]</div>

				<template is="dom-if" if="[[task.requestedByPhone]]">
					<div class="divider requested-by-divider"></div>
					<div class="requested-by-phone">
						<iron-icon icon="ibm-glyphs:phone-call"></iron-icon> 
						<a href="tel:[[task.requestedByPhone]]">[[task.requestedByPhone]]</a>
					</div>
				</template>
			</div>
		</div>
	`,

    is: "tricomp-task-detail-description",

    properties: {
		task: Object
	}
});