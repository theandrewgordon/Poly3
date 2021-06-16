/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/paper-progress/paper-progress.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer ({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-vertical;
					@apply --layout-center;
					min-width: 150px;
				}

				.progress-text {
					@apply --layout-horizontal;
					margin-bottom: 5px;
				}

				paper-progress {
					--paper-progress-active-color: var(--ibm-green-50);
					--paper-progress-secondary-color: var(--ibm-green-20);
					--paper-progress-height: 8px;
					width: 100%;
				}

			
		</style>

		<div class="progress-text">
			<span>[[procedure.stepsCompleted]]</span>
			<span>&nbsp;/&nbsp;</span>
			<span>[[procedure.stepsTotal]]</span>
			<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
			<span>[[procedure.requiredStepsCompleted]]</span>
			<span>&nbsp;/&nbsp;</span>
			<span>[[procedure.requiredStepsTotal]]</span>
			<span>&nbsp;Required</span>
		</div>
		<paper-progress value="{{_computeRequiredStepsPercent(procedure, opened)}}" secondary-progress="{{_computeStepsPercent(procedure, opened)}}"></paper-progress>
	`,

    is: "tricomp-procedure-status-bar",

    properties: {

		opened: Boolean,

		procedure: {
			type: Object
		}
	},

    _computeStepsPercent: function(p, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (p && opened)
			return (p.stepsTotal != 0) ? p.stepsCompleted / p.stepsTotal * 100 : 0;
	},

    _computeRequiredStepsPercent: function(p, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (p && opened)
			return (p.requiredStepsTotal != 0) ? p.requiredStepsCompleted / p.requiredStepsTotal * 100 : 0;
	}
});