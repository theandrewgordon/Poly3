/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-icon/ibm-icons.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-routing/triplat-route.js";
import "../triblock-search-popup/triblock-image-info-card.js";
import "../triblock-table/triblock-table.js";
import "../@polymer/iron-icon/iron-icon.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "./tristyles-work-task-app.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import "./tricomp-task-detail-section.js";
import "./tricomp-task-id.js";
import "./triservice-resource.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-detail-section tristyles-theme">

				:host {
					@apply --layout-vertical;
					--triblock-image-info-card-image-container: {
						height: 50px;
						width: 50px;
					};
				}
				
				.section-content {
					overflow: auto;
					padding: 0 15px 15px 15px;
				}

				:host([small-layout]) .section-content {
					padding: 0 0 5px 0;
				}

				.people-item-bold {
					font-weight: bold;
				}

				.people-section {
					padding: 15px;
					@apply --layout-horizontal;
					border-bottom: 1px solid var(--ibm-gray-30);
				}

				.profile {
					@apply --layout-flex;
				}

				.fixed-width-column {
					--triblock-table-column-fixed-width: 70px;  
				}

				triblock-table {
					border-bottom:1px solid var(--ibm-gray-30);
					--triblock-table-column-divider: {
						display: none;
					};

					--triblock-table-cell: {
						height: auto !important;
						min-height: 44px;
					};
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

		<triplat-route name="taskPeople" params="{{_taskPeopleParams}}" on-route-active="_onRouteActive"></triplat-route>

		<triservice-resource id="resourceService" resources="{{_resources}}" resources-count="{{_resourcesCount}}" loading-resources="{{_loadingResources}}"></triservice-resource>
		
		<tricomp-task-detail-section small-layout="[[smallLayout]]" header="[[_header]]" aria-label="[[_header]]" opened="{{opened}}" count="[[_resourcesCount]]" loading="[[_loading]]" alt-expand="[[_altExpand]]" alt-collapse="[[_altCollapse]]">
			<div class="section-content" slot="section-content">
				<tricomp-task-id task="[[task]]" hidden\$="[[!smallLayout]]"></tricomp-task-id>
				<template is="dom-if" if="[[_resources]]">
					<template is="dom-if" if="[[smallLayout]]" restamp="">
						<template is="dom-repeat" id="resourcesList" items="[[_resources]]">
							<div class="people-section">
								<triblock-image-info-card class="profile" data="[[item]]" image-height="50" image-width="50" placeholder-icon="ibm:user" circular-image="" cache-image="" thumbnail="" aria-label\$="[[item.name]]">
									<div class="people-item-bold">[[item.name]]</div>
									<div>[[item.laborClass]]</div>
								</triblock-image-info-card>
								<div class="request-icons">
									<template is="dom-if" if="[[!_isEmpty(item.workPhone)]]" restamp="">
										<a href\$="tel:[[item.workPhone]]"><iron-icon icon="ibm-glyphs:phone-call" on-tap="_iconTapped"></iron-icon></a>
									</template>
									<template is="dom-if" if="[[!_isEmpty(item.mobilePhone)]]" restamp="">
										<div class="divider icons-divider"></div>
										<a href\$="tel:[[item.mobilePhone]]"><iron-icon icon="ibm:mobile" on-tap="_iconTapped"></iron-icon></a>
									</template>
									<template is="dom-if" if="[[!_isEmpty(item.email)]]" restamp="">
										<div class="divider icons-divider"></div>
										<a href\$="mailto:[[item.email]]"><iron-icon icon="ibm-glyphs:mail" on-tap="_iconTapped"></iron-icon></a>
									</template>
								</div>
							</div>
						</template>
					</template>

					<template is="dom-if" if="[[!smallLayout]]" restamp="">
						<triblock-table data="[[_resources]]" fixed-header="">
							<triblock-table-column class="fixed-width-column" property="picture">
								<template>
									<triblock-image-info-card data="[[item]]" image-height="50" image-width="50" placeholder-icon="ibm:user" circular-image="" cache-image="" thumbnail="" aria-label\$="[[item.name]]">
									</triblock-image-info-card>
								</template>
							</triblock-table-column>
							<triblock-table-column title="Name" property="name" class="wide"></triblock-table-column>
							<triblock-table-column title="Skill" property="laborClass"></triblock-table-column>
							<triblock-table-column title="Work Phone" title-icon="ibm-glyphs:phone-call" property="workPhone"></triblock-table-column>
							<triblock-table-column title="Mobile" title-icon="ibm:mobile" property="mobilePhone"></triblock-table-column>
							<triblock-table-column title="Email" title-icon="ibm-glyphs:mail" class="wide">
								<template>
									<template is="dom-if" if="[[!_isEmpty(item.email)]]" restamp="">
										<a href\$="mailto:[[item.email]]" on-tap="_iconTapped">[[item.email]]</a>
									</template>
								</template>
							</triblock-table-column>
						</triblock-table>
					</template>
				</template>
			</div>
		</tricomp-task-detail-section>
	`,

    is: "tricomp-task-detail-people",

    behaviors: [
		TriComputeLoadingBehavior,
		TriTaskDetailSectionBehavior
	],

    properties: {
		task: Object,

		_resources: {
			type: Array
		},

		_resourcesCount: {
			type: Number
		},

		_taskPeopleParams: {
			type: Object
		},

		_header: {
			type: String,
			value: ""
		},

		_loadingResources: {
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
		"_notifyResize(_resources, opened, 500)",
		"_setLoadingBlockers(_sectionLoadingBlocker)",
		"_setValidLoadings(_loadingResources)"
	],

    attached: function() {
		var __dictionary__header = "Assigned People";
		this.set("_header", __dictionary__header);

		var __dictionary__altExpand = "Expand assigned people section";
		var __dictionary__altCollapse = "Collapse assigned people section";
		this.set("_altExpand", __dictionary__altExpand);
		this.set("_altCollapse", __dictionary__altCollapse);
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.resourceService.refreshResources(this._taskPeopleParams.taskId);
			});
		}
	},

    _isEmpty: function(val) {
		return !val || val == "";
	},

    _iconTapped: function(e) {
		e.stopPropagation();
	}
});