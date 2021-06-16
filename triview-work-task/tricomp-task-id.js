/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import "./tristyles-work-task-app.js";
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					display: block;
				}

				div {
					background-color: var(--ibm-neutral-2);
					padding: 12px 15px;
				}
			
		</style>

		<div class="tri-h2">[[task.taskID]]</div>
	`,

    is: "tricomp-task-id",

    properties: {
		task: Object
	}
});