/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../../services/triservice-workgroup.js";
import "../dropdown/tricomp-dropdown-button.js";
import "./tricomp-workgroup-selector-dropdown.js";

class TricompWorkgroupSelector extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-workgroup-selector"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
					min-height: 80px;
					font-size: 18px;
				}

				.dropdown-label {
					color: var(--tri-primary-content-color);
				}

				.items-spacer {
					height: 0px;
					overflow: hidden;
					padding: 0px 20px;
				}

				.dropdown-container {
					@apply --layout-vertical;
				}

				:host([dir="ltr"]) .dropdown-label {
					padding-right: 10px;
				}
				:host([dir="rtl"]) .dropdown-label {
					padding-left: 10px;
				}

				.workgroup-btn {
					border-bottom: 2px solid var(--tri-primary-content-label-color);
					--tricomp-dropdown-button: {
						@apply --layout-horizontal;
						@apply --layout-flex;
						justify-content: normal;
					};
					--tricomp-dropdown-button-selected-item: {
						@apply --layout-flex;
					};
				}

				.workgroup-btn[opened] {
					border-color: var(--tri-primary-color);
				}

				.selected {
					@apply --layout-flex;
				}
			</style>

			<triservice-workgroup my-supervised-workgroups="{{_mySupervisedWorkgroups}}" selected-workgroup="{{_selectedWorkgroup}}" is-single-workgroup="{{_isSingleWorkgroup}}"></triservice-workgroup>

			<label class="dropdown-label">[[_computeLabel(_isSingleWorkgroup)]]:</label>

			<div class="dropdown-container">
				<div class="items-spacer">
					<dom-repeat items="{{_mySupervisedWorkgroups}}">
						<template><div>[[item.name]]</div></template>
					</dom-repeat>
				</div>
				<tricomp-dropdown-button id="workgroupBtn" class="workgroup-btn" read-only="[[readOnly]]" on-toggle-dropdown="_handleToggleDropdown">
					<span class="selected">[[_selectedWorkgroup.name]]</span>
				</tricomp-dropdown-button>
			</div>

			<tricomp-workgroup-selector-dropdown id="workgroupsDropdown" selected="{{_selectedIndex}}" workgroups="[[_mySupervisedWorkgroups]]">
			</tricomp-workgroup-selector-dropdown>
		`;
	}

	static get properties() {
		return {
			_mySupervisedWorkgroups: {
				type: Array
			},

			_selectedWorkgroup: { 
				type: Object
			},

			_isSingleWorkgroup: {
				type: Boolean,
				value: false
			},

			_selectedIndex: {
				type: Number
			}
		};
	}

	static get observers() {
		return [
			"_handleSelectedWorkgroupChanged(_mySupervisedWorkgroups, _selectedWorkgroup)",
			"_handleSelectedIndexChanged(_selectedIndex)"
		]
	}

	_handleSelectedWorkgroupChanged(mySupervisedWorkgroups, selectedWorkgroup) {
		if (mySupervisedWorkgroups && selectedWorkgroup) {
			this._selectedIndex = mySupervisedWorkgroups.indexOf(selectedWorkgroup);
		}
	}

	_handleSelectedIndexChanged(selectedIndex) {
		if (Number.isInteger(selectedIndex) && this._mySupervisedWorkgroups) {
			this._selectedWorkgroup = this._mySupervisedWorkgroups[selectedIndex];
		} else {
			this._selectedWorkgroup = null;
		}
		this.$.workgroupsDropdown.close();
	}

	_computeLabel(isSingleWorkgroup) {
		var __dictionary__selectWorkgroup =  "Select a workgroup";
		var __dictionary__workgroup =  "Workgroup";
		return isSingleWorkgroup ? __dictionary__workgroup : __dictionary__selectWorkgroup;
	}

	_handleToggleDropdown(e) {
		e.stopPropagation();
		this.$.workgroupsDropdown.toggle(this.$.workgroupBtn);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/workgroup-selector/tricomp-workgroup-selector.js");
	}
}

window.customElements.define(TricompWorkgroupSelector.is, TricompWorkgroupSelector);