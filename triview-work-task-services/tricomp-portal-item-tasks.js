/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triapp-task-list/triapp-task-list.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../tricore-util/tricore-util.js";

Polymer({
		_template: html`
		<style include="tristyles-theme">

				#tasks {
					@apply --layout-flex;
					@apply --layout-vertical;
				}
			
		</style>

		<triapp-task-list id="tasks" downloading="[[downloading]]" model-and-view="triWorkTask" instance-id="-1" online="[[online]]">
		</triapp-task-list>
	`,

		is: "tricomp-portal-item-tasks",

		properties:{
			downloading: {
				type: Boolean,
				value: false
			},
			online: {
				type: Object,
				value: true
			}
	},

		importMeta: getModuleUrl("triview-work-task-services/tricomp-portal-item-tasks.js")
});