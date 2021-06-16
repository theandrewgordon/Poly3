/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-pages/iron-pages.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../week-selector/tricomp-week-selector.js";
import "../task-list/tricomp-assigned-task-list.js";
import "../task-list/tricomp-overdue-task-list.js";
import "../task-list/tricomp-unassigned-task-list.js";
import "../task-list/tricomp-task-search-header.js";
import "../task-status-tab/tricomp-task-status-tab.js";
import "../undo-button/tricomp-undo-button.js";
import "../../services/triservice-task-assignment.js";
import "../../services/triservice-work-planner.js";
import "../../services/triservice-work-task.js";
import "../../styles/tristyles-work-planner.js";
import { TrimixinTaskSection } from "./trimixin-task-section.js";

class TricompTaskSection extends TrimixinTaskSection(PolymerElement) {
	static get is() { return "tricomp-task-section"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				.week-selector {
					@apply --layout-self-end;
					margin-top: 20px;
				}

				.week-selector[invisible] {
					visibility: hidden;
				}

				.task-status-tab-row {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --layout-wrap;
					margin-top: 15px;
				}

				.task-status-tab {
					@apply --layout-flex;
				}

				.divider {
					background-color: var(--tri-primary-content-accent-color);
					width: 2px;
					height: 20px;
					margin: 0px 5px; 
				}

				iron-pages {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.task-list {
					@apply --layout-flex;
				}

				.search-header {
					margin-top: 15px;
				}
			</style>

			<triservice-task-assignment selected-tasks="{{_selectedTasks}}"></triservice-task-assignment>

			<triservice-work-planner
				current-user="{{_currentUser}}"
				task-start-date="{{_taskStartDate}}"
				task-end-date="{{_taskEndDate}}"
				medium-layout="{{_mediumLayout}}">
			</triservice-work-planner>

			<triservice-work-task selected-status="{{_selectedStatus}}"></triservice-work-task>

			<div class="section-title">Work Tasks</div>

			<tricomp-week-selector class="week-selector" start-date="{{_taskStartDate}}" end-Date="{{_taskEndDate}}" invisible\$="[[_isOverdueStatus(_selectedStatus)]]"></tricomp-week-selector>
			
			<tricomp-task-search-header class="search-header" task-filters="{{_taskFilters}}"></tricomp-task-search-header>
			
			<div class="task-status-tab-row">
				<tricomp-task-status-tab id="taskStatusTab" class="task-status-tab" selected="{{_selectedStatus}}" on-selected-changed="_handleSelectedStatusChanged"></tricomp-task-status-tab>
				<div class="divider"></div>
				<tricomp-undo-button></tricomp-undo-button>
				<div class="divider" hidden\$="[[_mediumLayout]]"></div>
				<paper-icon-button id="toggleTaskListLayoutBtn" icon="[[_computeTaskListIcon(_cardLayout)]]" primary title="Toggle task list layout" 
					on-tap="_toggleTaskList" hidden\$="[[_mediumLayout]]"></paper-icon-button>
			</div>

			<iron-pages selected="[[_selectedStatus]]" attr-for-selected="name" selected-attribute="active">
				<tricomp-unassigned-task-list name="unassigned" class="task-list" current-user="[[_currentUser]]"
					task-filters="[[_taskFilters]]" medium-layout="[[_mediumLayout]]"
					card-layout="[[_cardLayout]]"></tricomp-unassigned-task-list>

				<tricomp-assigned-task-list name="assigned" class="task-list" current-user="[[_currentUser]]"
					task-filters="[[_taskFilters]]" medium-layout="[[_mediumLayout]]"
					card-layout="[[_cardLayout]]"></tricomp-assigned-task-list>

				<tricomp-overdue-task-list name="overdue" class="task-list" current-user="[[_currentUser]]"
					task-filters="[[_taskFilters]]" medium-layout="[[_mediumLayout]]"
					card-layout="[[_cardLayout]]"></tricomp-overdue-task-list>
			</iron-pages>
		`;
	}

	static get properties() {
		return {
			_cardLayout: {
				type: Boolean,
				value: true
			},

			_mediumLayout: {
				type: Boolean
			}
		};
	}

	static get observers() {
		return [
			"_setCardLayout(_mediumLayout)"
		];
	}

	_computeTaskListIcon(cardLayout) {
		return cardLayout ? "ibm:spreadsheet-listview" : "ibm:tile-tiles-tileview";
	}

	_toggleTaskList() {
		this._cardLayout = !this._cardLayout;
	}

	_setCardLayout(mediumLayout) {
		if (mediumLayout) this._cardLayout = true;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/pages/assignment/tricomp-task-section.js");
	}
}

window.customElements.define(TricompTaskSection.is, TricompTaskSection);