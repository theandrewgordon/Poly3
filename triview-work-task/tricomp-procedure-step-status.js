/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-toggle-button/paper-toggle-button.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../triplat-icon/ibm-icons.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "./tristyles-work-task-app.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer ({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">


				.success {
					--iron-icon-fill-color: var(--ibm-green-50);
					padding: 6px;
				}

				.status {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --layout-flex-1;
				}

				.primary-always {
					--paper-icon-button-disabled-text: var(--tri-primary-color) !important;
				}

			
		</style>

		<template is="dom-if" if="[[!_showSmallScreen(smallLayout, forceLarge)]]" restamp="">
			<div class="status">
				<span class="secondary-text">Complete?:&nbsp;</span>
				<span>No</span>
				<paper-toggle-button id="toggleId" class="toggle toggle-step" on-change="_statusChanged" checked="{{complete}}" disabled="[[disabled]]"></paper-toggle-button>
				<span>Yes</span>
			</div>
		</template>
		<template is="dom-if" if="[[_showSmallScreen(smallLayout, forceLarge)]]" restamp="">
			<template is="dom-if" if="[[complete]]">
				<paper-icon-button class="success" icon="ibm:ready" disabled="[[disabled]]" on-tap="_toggleComplete"></paper-icon-button>
			</template>
			<template is="dom-if" if="[[_computeShowPrimaryAlwaysIncompleteIcon(complete, busy)]]">
				<paper-icon-button class="primary-always" primary="" icon="ibm-glyphs:incomplete" disabled="[[disabled]]" on-tap="_toggleComplete"></paper-icon-button>
			</template>
			<template is="dom-if" if="[[_computeShowNormalIncompleteIcon(complete, busy)]]">
				<paper-icon-button primary="" icon="ibm-glyphs:incomplete" disabled="[[disabled]]" on-tap="_toggleComplete"></paper-icon-button>
			</template>
		</template>
	`,

	is: "tricomp-procedure-step-status",

    properties: {
		disabled: {
			type: Boolean,
			notify: true
		},

		complete: {
			type: Boolean,
			notify: true
		},

		forceLarge: {
			type: Boolean,
			notify: true,
			value: false
		},

		busy: {
			type: Boolean,
			notify: true
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    behaviors: [
		 TriDirBehavior
	],

    observers: [
		'_updateToggleStyles(disabled, complete)'
	],

    _showSmallScreen: function(smallLayout, forceLarge) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (forceLarge) ? false : smallLayout;
	},

    _statusChanged: function() {
		this.fire('step-status-changed', { complete: this.complete });
	},

    _toggleComplete: function(e) {
		e.stopPropagation();
		this.set('complete', !this.complete);
		this._statusChanged();
	},

    _updateToggleStyles: function(disabled, complete) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var toggle = this.$$("#toggleId");

		if (toggle) {
			this.async(function() {
				toggle.updateStyles({});
			});
		}
	},

    _computeShowPrimaryAlwaysIncompleteIcon: function(complete, busy) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !complete && !busy;
	},

    _computeShowNormalIncompleteIcon: function(complete, busy) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !complete && busy;
	}
});