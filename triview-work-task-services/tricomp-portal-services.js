/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../triplat-auth-check/triplat-auth-check.js";
import "./tricomp-portal-service-item.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-horizontal;
					@apply --layout-center-center;
					background-color: var(--ibm-blue-70);
					color: white;
				}

				.container {
					@apply --layout-horizontal;
					max-width: 1100px;
				}
			
		</style>

		<!-- Check authorization for Service Request -->
		<triplat-auth-check app-name="serviceRequest" auth="{{serviceRequestAuth}}">
		</triplat-auth-check>

		<!-- Check authorization for Locate -->
		<triplat-auth-check app-name="locate" auth="{{locateAuth}}">
		</triplat-auth-check>

		<div class="container">
			<tricomp-portal-service-item type="workTask" label="Create Task" aria-labelledby="tasklabel" icon="ibm:add-new" hidden\$="[[!_hasAppAuthCreate(workTaskAuth)]]">
			</tricomp-portal-service-item>
			<tricomp-portal-service-item type="serviceRequest" label="[[_computeSRLabel(smallScreenWidth)]]" aria-labelledby="requestLabel" icon="ibm-medium:service-request" hidden\$="[[!_hasServiceRequestAuth(online, serviceRequestAuth)]]">
			</tricomp-portal-service-item>
			<tricomp-portal-service-item type="locate" label="Locate" aria-labelledby="locateLabel" icon="ibm:location" hidden\$="[[!_hasLocateAuth(online, locateAuth)]]">
			</tricomp-portal-service-item>
		</div>
	`,

    is: "tricomp-portal-services",

    behaviors: [
		TriBlockViewResponsiveBehavior
	],

    properties: {
		online: {
			type: Boolean,
			value: true
		},

		workTaskAuth: {
			type: Object
		}
	},

    _hasAppAuthCreate: function(auth) {
		return auth.hasLicense && auth.canCreate;
	},

    _hasAppAuthRead: function(auth) {
		return auth.hasLicense && auth.canRead;
	},

    _hasServiceRequestAuth: function(online, auth) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (!online) {
			return false;
		}

		return this._hasAppAuthCreate(auth);
	},

    _hasLocateAuth: function(online, auth) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (!online) {
			return false;
		}

		return this._hasAppAuthRead(auth);
	},

    _computeSRLabel: function(smallScreenWidth) {
		var __dictionary__sr_label = "Create Service Request";
		var __dictionary__sr_label_small = "Service Request";

		return (smallScreenWidth) ? __dictionary__sr_label_small : __dictionary__sr_label;
	}
});