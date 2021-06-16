/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import "./triview-work-task-dev.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

			
		</style>

		<triview-work-task model-and-view="triWorkTask" instance-id="-1" online="[[online]]" embedded="">
		</triview-work-task>
	`,

    is: "triapp-work-task",

    properties: {
		online: {
			type: Boolean,
			value: false
		}
	}
});