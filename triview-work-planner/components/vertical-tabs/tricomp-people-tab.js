/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../styles/tristyles-work-planner.js";
import "../people-image/tricomp-people-image.js";

class TricompPeopleTab extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-people-tab"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					background-color: var(--ibm-neutral-2);
					border: 1px solid var(--tri-primary-content-accent-color);
					border-right: 1px solid var(--tri-primary-content-accent-color);
					cursor: pointer;
					flex-shrink: 0;
					overflow: hidden;
					padding: 10px;
					position: relative;
				}

				:host(.iron-selected) {
					background-color:  var(--primary-background-color);
					border-right: 0;
				}

				.hover-bar {
					background: var(--tri-primary-color);
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					width: 0;
					transition: .2s;
				}
				:host(:hover) .hover-bar,
				:host(:focus) .hover-bar {
					width: 5px;
				}

				.row {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.column-flex {
					@apply --layout-flex;
				}
				
				:host([dir="ltr"]) .column-flex {
					margin-left: 10px;
				}
				:host([dir="rtl"]) .column-flex {
					margin-right: 10px;
				}

				.person-details {
					margin-bottom: 2px;
					white-space: normal;
				}

				.icon-column {
					text-align: right;
					width: 45px;
				}

				.warning-icon {
					color: black;
					height: 20px;
					width: 20px;
					visibility: hidden;
				}
				.warning-icon[over-allocated] {
					visibility: visible;
				}

				.bold {
					font-weight: bold;
				}
				:host([dir="ltr"]) .bold {
					margin-right: 3px;
				}
				:host([dir="rtl"]) .bold {
					margin-left: 3px;
				}
			</style>

			<div class="hover-bar"></div>
			<div class="person-details row">
				<tricomp-people-image image="[[member.picture]]" first-name="[[member.firstName]]" last-name="[[member.lastName]]"></tricomp-people-image>
				<div class="column-flex name-container">
					<div>[[member.name]]</div>
					<div class="labor-list">
						<dom-repeat items="[[member.laborClasses]]">
							<template>
								<label class="labor">[[_computeLaborText(item, index)]]</label>
							</template>
						</dom-repeat>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="icon-column">
					<iron-icon class="warning-icon" icon="ibm-glyphs:warning" title="over-allocated" noink over-allocated\$="[[_isOverallocated]]"></iron-icon>
				</div>
				<div class="column-flex availability-text">
					<span class="bold">[[member.availability.plannedHours]] / [[member.availability.availableHours]] hrs : </span>
					<span>[[_computeTaskQuantityText(member.availability.plannedTasksQty)]]</span>
				<div>
			</div>
		`;
	}

	static get properties() {
		return {
			member: {
				type: Object
			},

			_isOverallocated: {
				type: Boolean,
				value: false,
				computed: "_computeIsOverallocated(member.availability.plannedHours, member.availability.availableHours)"
			}
		};
	}

	_computeLaborText(item, index) {
		return item + (index < this.member.laborClasses.length - 1 ? "," : "");
	}

	_computeIsOverallocated(plannedHours, availableHours) {
		return plannedHours > availableHours;
	}

	_computeTaskQuantityText(plannedTasksQty) {
		var __dictionary__task="task";
		var __dictionary__tasks="tasks";
		return `${plannedTasksQty} ${plannedTasksQty > 1 ? __dictionary__tasks :  __dictionary__task}`;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/vertical-tabs/tricomp-people-tab.js");
	}
}

window.customElements.define(TricompPeopleTab.is, TricompPeopleTab);