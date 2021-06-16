/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/iron-collapse/iron-collapse.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import { TriroutesTaskDetail } from "./triroutes-task-detail.js";
import { TriroutesWorkTaskApp } from "./triroutes-work-task-app.js";
import "./tristyles-work-task-app.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
					background-color: white;
				}

				.header-container {
					border-top: 1px solid var(--ibm-gray-10);
					cursor: pointer;
					padding: 15px;

					@apply --tricomp-task-detail-section-header-container;
				}

				:host([_disable-arrow]) .header-container {
					cursor: auto;
				}

				.header-main {
					@apply --layout-center;
					@apply --layout-horizontal;
				}
				
				.header-content {
					@apply --layout-flex;
				}
				.header-content > div {
					display: inline-block;
				}

				.section-header {
					font-size: 16px;
					font-weight: 700;
				}

				.header-text {
					color: var(--tri-primary-content-color);
				}

				:host([dir="ltr"]) .header-count {
					margin-left: 7px
				}
				:host([dir="rtl"]) .header-count {
					margin-right: 7px
				}

				.icons {
					@apply --layout-horizontal;
				}
				
				:host([dir="ltr"]) .icons > * {
					margin-left: 10px
				}
				:host([dir="rtl"]) .icons > * {
					margin-right: 10px
				}

				paper-icon-button {
					height: 22px;
					padding: 0;
					width: 22px;
					color: var(--ibm-blue-50);
				}

				.icon-open {
					transform: rotate(90deg);
				}

				.icon-close {
					transform: rotate(-90deg);
				}
				
				:host([dir="rtl"]) .icon-small-screen {
					transform: scaleX(-1);
				}

				#collapse {
					@apply --layout-vertical;
					@apply --tricomp-task-detail-section-collapse;
					position: relative;
				}

				:host([small-layout][opened]) #collapse {
					@apply --layout-fit;
					background-color: white;
					z-index: 3;
				}

				.icons-divider {
					height: 25px;
				}
			
		</style>

		<div class="header-container" on-tap="_handleHeaderTap">
			<div class="header-main">
				<div class="header-content">
					<template is="dom-if" if="[[!noHeader]]">
						<div class="section-header header-text">[[header]]</div>
						<div class="section-header header-count">[[count]]</div>
					</template>
					<slot name="header-custom-content"></slot>
				</div>

				<div class="icons">
					<template is="dom-if" if="[[enableAdd]]">
						<paper-icon-button class="icon-open" icon="ibm-glyphs:add-new" on-tap="_addTapped" disabled="[[readonly]]" noink="" alt\$="[[altAddNew]]"></paper-icon-button>
					</template>

					<div class="divider icons-divider" hidden\$="[[_hideIconsDivider(enableAdd)]]"></div>

					<template is="dom-if" if="[[!smallLayout]]">
						<paper-icon-button icon="ibm-glyphs:expand-open" class="icon-open" hidden\$="[[opened]]" disabled="[[_disableArrow]]" primary="" alt="[[altExpand]]" noink=""></paper-icon-button>
						<paper-icon-button icon="ibm-glyphs:expand-open" class="icon-close" hidden\$="[[!opened]]" disabled="[[_disableArrow]]" primary="" alt="[[altCollapse]]" noink=""></paper-icon-button>
					</template>

					<template is="dom-if" if="[[smallLayout]]">
						<paper-icon-button icon="ibm-glyphs:expand-open" class="icon-small-screen" disabled="[[_disableArrow]]" primary="" noink=""></paper-icon-button>
					</template>
				</div>
			</div>

			<slot name="header-sub-content"></slot>
		</div>

		<iron-collapse id="collapse" opened="{{opened}}" no-animation="[[smallLayout]]">
			<triplat-loading-indicator class="loading-indicator" show="[[loading]]"></triplat-loading-indicator>

			<template is="dom-if" if="[[opened]]">
				<slot name="section-content"></slot>
			</template>
		</iron-collapse>
	`,

    is: "tricomp-task-detail-section",
    behaviors: [
			TriDirBehavior
		],

    properties: {
		altAddNew: {
			type: String,
			value: "Add New"
		},

		altExpand: {
			type: String,
			value: "Expand"
		},

		altCollapse: {
			type: String,
			value: "Collapse"
		},

		readonly: Boolean,

		/*
		 * Section header name.
		 */
		header: {
			type: String,
			value: ""
		},

		/*
		 * If true, the default text header will be hidden.
		 */
		noHeader: {
			type: Boolean,
			value: false
		},

		/*
		 * True if the section is opened.
		 */
		opened: {
			type: Boolean,
			value: false,
			notify: true,
			reflectToAttribute: true,
			observer: "_handleOpenedChanged"
		},

		/*
		 * Number of items for this section.
		 */
		count: {
			type: Number,
			value: 0,
			observer: "_observeCount"
		},

		ignoreCount: {
			type: Boolean,
			value: false
		},

		enableAdd: {
			type: Boolean,
			value: false,
			notify: true
		},

		loading: {
			type: Boolean,
			value: false
		},

		/*
		* If true, the section arrow will be disabled.
		*/
		_disableArrow: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    _handleHeaderTap: function(e) {
		e.stopPropagation();

		if (!this._disableArrow) {
			if (this.opened) {
				TriroutesTaskDetail.getInstance().navigateTaskDetailHome(!this.smallLayout);
			} else {
				this.fire("open-section");
			}
		}
	},

    _handleOpenedChanged: function(newOpened, oldOpened) {
		if (newOpened && !this.smallLayout) {
			this.async(this.scrollIntoView.bind(this, true), 400);
		}
	},

    _addTapped: function(e) {
		e.stopPropagation();
		this.fire("add-tapped");
	},

    _hideIconsDivider: function(enableAdd) {
		return !enableAdd;
	},

    _observeCount: function(newCount, oldCount) {
		afterNextRender(this, function() {
			if (!this.ignoreCount) {
				this._disableArrow = (newCount > 0) ? false : true;
			}

			var isTaskRouteActive = TriroutesWorkTaskApp.getInstance().taskRouteActive;
			if (isTaskRouteActive && newCount == 0 && oldCount > 0 && !this.ignoreCount && this.opened) {
				afterNextRender(this, function() {
					TriroutesTaskDetail.getInstance().navigateTaskDetailHome(!this.smallLayout);
				});
			}
		});
	}
});