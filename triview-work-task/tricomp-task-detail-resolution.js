/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-icon/ibm-icons.js";
import { TriBlockScrollFieldIntoViewBehavior } from "../triblock-scroll-field-into-view-behavior/triblock-scroll-field-into-view-behavior.js";
import "../triblock-popup/triblock-popup.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/paper-button/paper-button.js";
import "../triapp-task-list/tricomp-overflow-text.js";
import "./tristyles-work-task-app.js";
import "./triservice-work-task.js";

Polymer({
    _template: html`
		<style include="work-task-popup tristyles-theme">

				:host {
					@apply --layout-vertical;
					border: 2px solid var(--ibm-gray-10);
					border-radius: 8px;
					background-color: white;
					padding: 15px;
				}

				:host([small-layout]) {
					margin-left: 15px;
					margin-right: 15px;
				}

				.section-header {
					color: var(--ibm-gray-70);
					font-weight: 500;
					@apply --layout-flex;
				}

				.resolution-header {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding-bottom: 10px;
				}

				.edit {
					--iron-icon-fill-color: var(--tri-primary-color);
					--iron-icon-stroke-color: var(--tri-primary-color);
					cursor: pointer;
				}

				.description {
					background-color: white;
				}

			
		</style>

		<triservice-work-task id="workTaskService"></triservice-work-task>

		<div class="resolution-header">
			<div class="section-header tri-h3">Resolution Summary</div>
			<iron-icon class="edit" icon="ibm:edit" hidden\$="[[readonly]]" aria-label="Edit Resolution Summary" on-tap="_openEditResolutionPopup"></iron-icon>
		</div>
		<tricomp-overflow-text class="description" lines="8" collapse="" text="[[task.resolutionDescription]]">
			</tricomp-overflow-text>

		<triblock-popup id="editResolutionPopup" class="popup-alert resolution-popup" with-backdrop="" small-screen-max-width="0px" aria-label="Resolution Summary">
			<div class="header-general tri-h2">Resolution Summary</div>
			<textarea id="resolutionTextarea" class="resolution-textarea" rows="8" maxlength="1000" placeholder="Record a resolution summary below before marking this task complete. The resolution summary will be saved with the task record for future reference." value="{{_resolutionDescription::input}}" aria-label="Resolution Summary" tri-scroll-into-view=""></textarea>
			<div class="footer">
				<paper-button secondary="" dialog-dismiss="">Cancel</paper-button>
				<paper-button dialog-confirm="" on-tap="_handleSaveResolution">Save</paper-button>
			</div>
		</triblock-popup>
	`,

    is: "tricomp-task-detail-resolution",

    behaviors: [
		TriBlockScrollFieldIntoViewBehavior
	],

    properties: {
		task: Object,
		readonly: Boolean,

		_resolutionDescription: {
			type: String,
			value: ""
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		},
	},

    _openEditResolutionPopup: function(e) {
		e.stopPropagation();
		this.set('_resolutionDescription', this.task.resolutionDescription);
		this.$.editResolutionPopup.openPopup();
		this.$.resolutionTextarea.focus();
	},

    _handleSaveResolution: function(e) {
		e.stopPropagation();
		this.set('task.resolutionDescription', this._resolutionDescription);
		this.$.editResolutionPopup.closePopup();
		this.$.workTaskService.updateTaskResolution(this.task._id);
	}
});