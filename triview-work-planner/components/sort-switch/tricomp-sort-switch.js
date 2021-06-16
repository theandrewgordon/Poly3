/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons.js";

class TricompSortSwitch extends  mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-sort-switch"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-horizontal;
				}

				.sort-icon-btn  {
					@apply --layout-horizontal;
					font-family: var(--tri-font-family);
					font-weight: 500;
					text-transform: none;
					padding: 0px;
					margin: 0px;
					min-width: 0px;
				}

				.sort-icon {
					width: 16px;
					height: 16px;
					color: var(--ibm-gray-30);
				}

				.sort-icon[sort="ASC"], .sort-icon[sort="DESC"] {
					color: inherit;
				}

				:host([dir="ltr"]) .label {
					margin-right: 5px;
				}

				:host([dir="rtl"]) .label {
					margin-left: 5px;
				}
			</style>

			<paper-button class="sort-icon-btn tri-disable-theme" on-tap="_handleSortTap">
				<dom-if if="[[_hasLabel(label)]]">
					<template><span class="label">[[label]]</span></template>
				</dom-if>
				<iron-icon class="sort-icon" icon="[[_computeSortIcon(sortOrder)]]" sort$="[[sortOrder]]"></iron-icon>
			</paper-button>
		`;
	}
	static get properties() {
		return {
			sortOrder: {
				type: String,
				value: "",
				notify: true
			},

			sortField: {
				type: String
			},

			label: {
				type: String,
				value: ""
			}
		};
	}

	_computeSortIcon(sortOrder) {
		switch (sortOrder) {
			case "ASC":
				return "ibm:sort-ascending";
			case "DESC":
				return "ibm:sort-descending";
			default:
				return "ibm:sort";
		}
	}

	_hasLabel(label) {
		return label && label.length > 0;
	}

	_handleSortTap() {
		switch (this.sortOrder) {
			case "ASC":
				this.sortOrder = "DESC";
				break;
			case "DESC":
				this.sortOrder = "";
				break;
			default:
				this.sortOrder = "ASC";
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/sort-switch/tricomp-sort-switch.js");
	}
}

window.customElements.define(TricompSortSwitch.is, TricompSortSwitch);