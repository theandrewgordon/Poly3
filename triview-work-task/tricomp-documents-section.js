/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/iron-collapse/iron-collapse.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triapp-document-list/triapp-document-list.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				.header {
					@apply --layout-center;
					@apply --layout-horizontal;
					cursor: pointer;
					padding: 15px 0;
				}
				:host([small-layout]) .header {
					padding-bottom: 10px;
					padding-top: 10px;
				}

				.header-text {
					@apply --layout-center;
					@apply --layout-flex;
					@apply --layout-horizontal;

					@apply --tricomp-documents-section-header-text;
				}

				.count {
					font-weight: bold;
				}
				:host([dir="ltr"]) .count {
					margin-left: 10px;
				}
				:host([dir="rtl"]) .count {
					margin-right: 10px;
				}

				iron-icon {
					color: var(--tri-primary-color);
				}

				.icon-dropdown {
					height: 16px;
					width: 16px;
					transform: rotate(90deg);
				}
				:host([opened]) .icon-dropdown {
					transform: rotate(-90deg);
				}
				:host([dir="ltr"]) .icon-dropdown {
					margin-right: 10px;
				}
				:host([dir="rtl"]) .icon-dropdown {
					margin-left: 10px;
				}

				:host([opened]) .icon-dropdown-mobile {
					transform: rotate(180deg);
				}
				:host([dir="ltr"]) .icon-dropdown-mobile {
					margin-left: 10px;
				}
				:host([dir="rtl"]) .icon-dropdown-mobile {
					margin-right: 10px;
				}

				iron-collapse {
					margin-top: -7px;
					padding-bottom: 5px;
				}
			
		</style>

		<div class="header" on-tap="_onHeaderTapped">
			<iron-icon class="icon-dropdown" hidden\$="[[smallLayout]]" icon="ibm-glyphs:expand-open"></iron-icon>
			<div class="header-text">
				<div>Related Documents</div>
				<div class="count">[[documents.length]]</div>
			</div>
			<iron-icon class="icon-dropdown-mobile" hidden\$="[[!smallLayout]]" icon="icons:arrow-drop-down"></iron-icon>
		</div>

		<iron-collapse opened="{{opened}}">
			<triapp-document-list documents="[[documents]]" online="[[online]]" small-screen-width="[[smallLayout]]" disable-screen-size-detection></triapp-document-list>
		</iron-collapse>
	`,

    is: "tricomp-documents-section",
    behaviors: [
			TriDirBehavior
		],

    properties: {
		documents: {
			type: Array
		},

		online: {
			type: Boolean
		},

		opened: {
			type: Boolean,
			value: false,
			reflectToAttribute: true,
			notify: true,
			observer: "_handleOpenedChanged"
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    _onHeaderTapped: function(e) {
		e.stopPropagation();
		this.opened = !this.opened;
	},

    _handleOpenedChanged: function(newOpened, oldOpened) {
		if (newOpened) {
			this.async(this.scrollIntoView.bind(this, true), 400);
		}
	}
});