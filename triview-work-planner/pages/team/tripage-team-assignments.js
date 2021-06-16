/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../../@polymer/polymer/lib/utils/async.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";

import "../../components/week-selector/tricomp-week-selector.js";
import "../../components/vertical-tabs/tricomp-vertical-tabs.js";
import "../../components/vertical-tabs/tricomp-people-tab.js";
import "../../components/member-task-list/tricomp-member-task-list.js";
import "../../routes/triroutes-work-planner.js";
import "../../services/triservice-people.js";
import "../../services/triservice-work-planner.js";
import "../../styles/tristyles-work-planner.js";

class TripageTeamAssignments extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tripage-team-assignments"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					background-color: var(--ibm-neutral-2);
				}

				.page-header {
					@apply --layout-center;
					@apply --layout-horizontal;
					height: 80px;
					padding-left: 5%;
					padding-right: 5%;
				}

				.section-title {
					@apply --layout-flex;
					border-bottom: 0;
				}

				.week-selector {
					@apply --layout-center-justified;
					@apply --layout-flex-2;
					@apply --layout-horizontal;
				}

				.page-content {
					@apply --layout-flex;
					@apply --layout-horizontal;
					overflow: hidden;
				}

				:host([dir="ltr"]) .page-content {
					padding-left: 5%;
				}
				:host([dir="rtl"]) .page-content {
					padding-right: 5%;
				}

				.tabs {
					@apply --layout-flex-2;
				}

				.member-task-list {
					@apply --layout-flex-7;
					background-color:  var(--primary-background-color);
					border-top: 1px solid var(--tri-primary-content-accent-color);
					border-left: 1px solid var(--tri-primary-content-accent-color);
					margin-left: -1px;
				}

				:host([dir="ltr"]) .member-task-list {
					padding-right: 5%;
				}
				:host([dir="rtl"]) .member-task-list {
					padding-left: 5%;
				}
			</style>

			<triroutes-work-planner id="routesWorkPlanner" 
				team-assignments-params="{{_routeParams}}" team-assignments-route-active="{{_teamAssignmentsRouteActive}}">
			</triroutes-work-planner>

			<triservice-work-planner people-start-date="{{_peopleStartDate}}" people-end-date="{{_peopleEndDate}}"></triservice-work-planner>
			<triservice-people id="servicePeople" members="{{_members}}"></triservice-people>

			<div class="page-header">
				<div class="section-title">Team Assignments</div>
				<div class="week-selector">
					<tricomp-week-selector class="workgroup-selector" start-date="{{_peopleStartDate}}" end-Date="{{_peopleEndDate}}"></tricomp-week-selector>
				</div>
			</div>

			<div class="page-content">
				<tricomp-vertical-tabs class="tabs" selected="{{_selectedTab}}">
					<dom-repeat items="[[_members]]" as="member">
						<template>
							<tricomp-people-tab member="[[member]]"></tricomp-people-tab>
						</template>
					</dom-repeat>
				</tricomp-vertical-tabs>

				<tricomp-member-task-list class="member-task-list">
				</tricomp-member-task-list>
			</div>
		`;
	}

	static get properties() {
		return {
			_routeParams: {
				type: Object
			},

			_peopleStartDate: {
				type:String
			},

			_peopleEndDate: {
				type:String
			},

			_members: {
				type: Array
			},

			_selectedTab: {
				type: Number,
				value: -1
			},

			_teamAssignmentsRouteActive: {
				type: Boolean
			}
		};
	}

	static get observers() {
		return [
			"_setSelectedTab(_teamAssignmentsRouteActive, _routeParams, _members)",
			"_observeSelectedTab(_teamAssignmentsRouteActive, _selectedTab)"
		];
	}

	_setSelectedTab(teamAssignmentsRouteActive, routeParams, members) {
		this._debounceSetSelectedTab = Debouncer.debounce(
			this._debounceSetSelectedTab, 
			microTask,
			() => {
				if (teamAssignmentsRouteActive && routeParams && 
					routeParams.peopleId && routeParams.peopleId != "" && 
					routeParams.workgroupId && routeParams.workgroupId != "" && 
					members && members.length > 0) {
					this._selectedTab = members.findIndex(function(e) {
						return e._id == routeParams.peopleId;
					});
				}
			}
		);
	}

	_observeSelectedTab(teamAssignmentsRouteActive, selectedTab) {
		this._debounceObserveSelectedTab = Debouncer.debounce(
			this._debounceObserveSelectedTab, 
			microTask,
			() => {
				if (!teamAssignmentsRouteActive || !this._members || this._members.length == 0 || selectedTab < 0) {
					this.$.servicePeople.selectedMember = null;
					return;
				}
				this.$.servicePeople.selectedMember = this._members[selectedTab];
				this.$.routesWorkPlanner.openTeamAssignments(this._members[selectedTab]._id, true);
			}
		);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/pages/team/tripage-team-assignments.js");
	}
}

window.customElements.define(TripageTeamAssignments.is, TripageTeamAssignments);