/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../tricore-url/tricore-url.js";
import "../triplat-icon/ibm-icons.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-routing/triplat-route.js";
import "../triblock-popup/triblock-popup.js";
import "../triblock-table/triblock-table.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/paper-button/paper-button.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "./tristyles-work-task-app.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import "./tricomp-task-detail-section.js";
import "./tricomp-task-id.js";
import "./triservice-work-task.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-popup work-task-detail-section tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				.section-content {
					@apply --layout-vertical;
					padding: 0 0 5px 0;
				}

				triblock-table {
					--triblock-table-column-divider: {
						display: none;
					};

					--triblock-table-cell: {
						height: auto !important;
						min-height: 44px;
					};
				}
				#largeTable {
					margin:0px 15px 10px 15px;
					border-bottom:1px solid var(--ibm-gray-30);
					--triblock-table-cell: {
						@apply --layout-start;
						height: auto !important;
						min-height: 44px;
					};
				}
				#smallTable {
					border-bottom:1px solid var(--ibm-gray-30);
					--triblock-table-header: {
						display: none;
					};
				}

				.request-container {
					@apply --layout-flex;
					@apply --layout-horizontal;
					min-width: 0;
					padding: 5px;
				}
				:host([small-layout].request-container) {
					padding-right: 0;
				}

				.primary-request {
					color: var(--tri-secondary-color);
					font-size: 12px;
				}

				:host([small-layout]) .request-number {
					margin-bottom: 7px;
				}

				.request-detail {
					@apply --layout-flex;
					min-width: 0;
				}

				.request-data {
					@apply --layout-flex;
				}

				.requestor {
					color: black;
					font-weight: 500;
				}

				.requestor-data {
					@apply --paper-font-common-nowrap;
					color: var(--ibm-gray-60);
				}

				.request-icons {
					@apply --layout-center;
					@apply --layout-horizontal;
				}

				:host([small-layout]) .request-icons a {
					display: inline-block;
				}

				.icons-divider {
					height: 25px;
				}

				.request-icons iron-icon {
					margin: 10px
				}
			
		</style>

		<tricore-url hidden="" raw-url="/p/web/serviceRequest" bind-url="{{_srUrl}}"></tricore-url>

		<triplat-route name="taskRequests" params="{{_taskRequestsParams}}" on-route-active="_onRouteActive"></triplat-route>

		<triservice-work-task id="workTaskService" requests="{{_requests}}" requests-count="{{_requestsCount}}" loading-requests="{{_loadingRequests}}"></triservice-work-task>

		<tricomp-task-detail-section small-layout="[[smallLayout]]" header="[[_header]]" aria-label="[[_header]]" count="[[_requestsCount]]" opened="{{opened}}" loading="[[_loading]]" alt-expand="[[_altExpand]]" alt-collapse="[[_altCollapse]]">
			<div class="section-content" slot="section-content">
				<template is="dom-if" if="[[smallLayout]]" restamp="">
					<tricomp-task-id task="[[task]]"></tricomp-task-id>
					
					<triblock-table id="smallTable" data="[[_requests]]" on-row-tap="_requestSelected">
						<triblock-table-column>
							<template>
								<div class="request-container">
									<div class="request-detail">
										<template is="dom-if" if="[[_isFirstRequest(index)]]" restamp="">
											<div class="primary-request">Primary request</div>
										</template>
										
										<div class="request-number tri-link">[[item.requestID]]</div>

										<div class="request-data">
											<div class="requestor">[[item.requestedBy]]</div>
											<template is="dom-if" if="[[item.requestedByTitle]]"><div class="requestor-data">[[item.requestedByTitle]]</div></template>
											<template is="dom-if" if="[[item.requestedByOrganization]]"><div class="requestor-data">[[item.requestedByOrganization]]</div></template>
										</div>
									</div>

									<div class="request-icons">
										<template is="dom-if" if="[[!_isEmpty(item.requestedByWorkPhone)]]" restamp="">
											<a href\$="tel:[[item.requestedByWorkPhone]]"><iron-icon icon="ibm-glyphs:phone-call" on-tap="_iconTapped"></iron-icon></a>
										</template>
										<template is="dom-if" if="[[!_isEmpty(item.requestedByMobile)]]" restamp="">
											<div class="divider icons-divider"></div>
											<a href\$="tel:[[item.requestedByMobile]]"><iron-icon icon="ibm:mobile" on-tap="_iconTapped"></iron-icon></a>
										</template>
										<template is="dom-if" if="[[!_isEmpty(item.requestedByEmail)]]" restamp="">
											<div class="divider icons-divider"></div>
											<a href\$="mailto:[[item.requestedByEmail]]"><iron-icon icon="ibm-glyphs:mail" on-tap="_iconTapped"></iron-icon></a>
										</template>
									</div>
								</div>
							</template>
						</triblock-table-column>
					</triblock-table>
				</template>

				<template is="dom-if" if="[[!smallLayout]]" restamp="">
					<triblock-table id="largeTable" data="[[_requests]]" on-row-tap="_requestSelected">
						<triblock-table-column title="ID">
							<template>
								<div>
									<template is="dom-if" if="[[_isFirstRequest(index)]]" restamp="">
										<div class="primary-request">Primary request</div>
									</template>
									
									<div class="request-number tri-link">[[item.requestID]]</div>
								</div>
							</template>
						</triblock-table-column>

						<triblock-table-column title="Requestor" class="wide">
							<template>
								<div class="request-data">
									<div class="requestor">[[item.requestedBy]]</div>
									<template is="dom-if" if="[[item.requestedByTitle]]"><div class="requestor-data">[[item.requestedByTitle]]</div></template>
									<template is="dom-if" if="[[item.requestedByOrganization]]"><div class="requestor-data">[[item.requestedByOrganization]]</div></template>
								</div>
							</template>
						</triblock-table-column>

						<triblock-table-column title="Work Phone" title-icon="ibm-glyphs:phone-call" property="requestedByWorkPhone"></triblock-table-column>

						<triblock-table-column title="Mobile" title-icon="ibm:mobile" property="requestedByMobile"></triblock-table-column>

						<triblock-table-column title="Email" title-icon="ibm-glyphs:mail" class="wide">
							<template>
								<template is="dom-if" if="[[!_isEmpty(item.requestedByEmail)]]" restamp="">
									<a href\$="mailto:[[item.requestedByEmail]]" on-tap="_iconTapped">[[item.requestedByEmail]]</a>
								</template>
							</template>
						</triblock-table-column>
					</triblock-table>
				</template>
			</div>
		</tricomp-task-detail-section>

		<triblock-popup id="requestNotAvailable" class="popup-alert" with-backdrop="" small-screen-max-width="0px">
			<div class="header tri-h2">Request not available</div>
			<div>Requests are not available if the application is offline.</div>
			<div class="footer">
				<paper-button dialog-confirm="">Got it</paper-button>
			</div>
		</triblock-popup>
	`,

    is: "tricomp-task-detail-requests",

    behaviors: [ 
		TriComputeLoadingBehavior,
		TriTaskDetailSectionBehavior
	],

    properties: {
		task: {
			type: Object,
		},

		_header: {
			type: String
		},

		_requests: {
			type: Array
		},

		_requestsCount: {
			type: Number
		},

		_srUrl: {
			type: String
		},

		_taskRequestsParams: {
			type: Object
		},

		online: {
			type: Boolean,
			value: true
		},

		_loadingRequests: {
			type: Boolean
		},

		_altExpand: {
			type: String
		},

		_altCollapse: {
			type: String
		}
	},

    observers: [
		"_notifyResize(_requests, opened, 500)",
		"_setLoadingBlockers(_sectionLoadingBlocker)",
		"_setValidLoadings(_loadingRequests)"
	],

    attached: function() {
		var __dictionary__header = "Requests";
		this.set("_header", __dictionary__header);
		
		var __dictionary__altExpand = "Expand requests section";
		var __dictionary__altCollapse = "Collapse requests section";
		this.set("_altExpand", __dictionary__altExpand);
		this.set("_altCollapse", __dictionary__altCollapse);
	},

    _isEmpty: function(val) {
		return !val || val == "";
	},

    _isFirstRequest: function(index) {
		return index === 1;
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.workTaskService.refreshRequests(this._taskRequestsParams.taskId);
			});
		}
	},

    _requestSelected: function(e) {
		e.stopPropagation();

		if (this.online) {
			var requestID = e.detail.item._id;
			
			var currentApp = encodeURIComponent(window.location.href.split("/p/web/")[1]);

			var url = this._srUrl;
			url += "?homeApp=" + currentApp;
			url += "#!/view/" + requestID;

			this._openUrl(url);
		} else {
			this.$.requestNotAvailable.openPopup();
		}
	},

    _openUrl: function(url) {
		this.async(function() {
			location.assign(url);
		});
	},

    _iconTapped: function(e) {
		e.stopPropagation();
	}
});