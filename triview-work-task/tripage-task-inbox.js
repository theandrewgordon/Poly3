/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triapp-task-list/triapp-task-list.js";
import { TriroutesWorkTaskApp } from "./triroutes-work-task-app.js";

Polymer({
	_template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				.container {
					padding: 0px;
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				#tasks {
					@apply --layout-flex;
				}
			
		</style>

		<div class="container">
			<triapp-task-list id="tasks" downloading="[[downloading]]" online="[[online]]" on-open-task="_handleOpenTask" show-new-task-button="[[!embedded]]" on-new-task-button-tapped="_handleOpenNewTask">
			</triapp-task-list>
		</div>
	`,

		is: "tripage-task-inbox",
		

	properties: {

		downloading: {
			type: Boolean,
			value: false
		},
		online: {
			type: Object,
			value: true
		},

		embedded: {
			type: Boolean,
			value: false
		},
		
		currentUser: Object
	},

	_handleOpenTask: function(e) {
		if (e.detail.taskAssignmentStatusENUS === "Unassigned") {
			TriroutesWorkTaskApp.getInstance().openTask(e.detail.taskId, true);
		} else if (e.detail.taskStatus === "Draft") {
			TriroutesWorkTaskApp.getInstance().openNewTask(e.detail.taskId);
		} else {
			TriroutesWorkTaskApp.getInstance().openTask(e.detail.taskId);
		}
	},

	_handleOpenNewTask: function() {
		TriroutesWorkTaskApp.getInstance().openNewTask(-1);
	}
});