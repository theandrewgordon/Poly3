/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../@polymer/iron-media-query/iron-media-query.js";
import "../../triplat-ds/triplat-ds.js";
import "../../triblock-responsive-layout/triblock-responsive-layout.js";
import { getTriroutesWorkPlanner } from "../routes/triroutes-work-planner.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import { getTriserviceMessage } from "./triservice-message.js";

export function getTriserviceWorkPlanner() {
	return getService(TriserviceWorkPlanner.is);
};

export const CHANGE_NOT_COMPLETED = "CHANGE_NOT_COMPLETED";

class TriserviceWorkPlanner extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-work-planner"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="currentUser" name="currentUser" data="{{currentUser}}" loading="{{_loadingCurrentUser}}"></triplat-ds>

					<triplat-ds id="assignmentStatusDS" name="assignmentStatus" data="{{assignmentStatus}}" loading="{{_loadingAssignmentStatus}}"></triplat-ds>

					<triblock-responsive-layout hidden medium-screen-width="{{mediumLayout}}">
					</triblock-responsive-layout>

					<iron-media-query query="(min-height: 500px)" query-matches="{{hasMinScreenHeight}}">
					</iron-media-query>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			currentUser: {
				type: Object,
				notify: true
			},

			assignmentStatus: {
				type: Array,
				notify: true
			},

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			smallLayout: {
				type: Boolean,
				notify: true
			},

			mediumLayout: {
				type: Boolean,
				notify: true
			},

			hasMinScreenHeight: {
				type: Boolean,
				notify: true
			},

			peopleStartDate: {
				type: Object,
				notify: true,
			},

			peopleEndDate: {
				type: Object,
				notify: true
			},

			taskStartDate: {
				type: String,
				notify: true
			},

			taskEndDate: {
				type: String,
				notify: true
			},

			lockWeek: {
				type: Boolean,
				value: true,
				notify: true
			},

			hasUndoChanges: {
				type: Boolean,
				value: false,
				notify: true
			},

			isTouchDevice: {
				type: Boolean,
				value: false,
				notify: true
			},

			_undoList: {
				type: Array
			},

			_loadingCurrentUser: {
				type: Boolean,
				value: false
			},

			_loadingAssignmentStatus: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handlePeopleChanged(peopleStartDate, peopleEndDate)",
			"_handleTaskChanged(taskStartDate, taskEndDate, lockWeek)",
			"_handleLoadingChanged(_loadingCurrentUser, _loadingAssignmentStatus)",
			"_handleUndoListChanged(_undoList.*)"
		]
	}

	ready() {
		super.ready();
		if (this._isRootInstance) {
			this.taskStartDate = moment(moment().format("YYYY-MM-DD") + "T00:00:00.000Z").utc().startOf("week").toISOString();
			this.taskEndDate = moment(this.taskStartDate).utc().add(6, "days").toISOString();
			this._undoList = [];
			this.isTouchDevice = this._computeIsTouchDevice();
			setTimeout(this._computeSmallLayout.bind(this), 500);
		}
	}

	_handlePeopleChanged(peopleStart, peopleEnd) {
		if (this._isRootInstance) {
			if (this.lockWeek) {
				this.taskStartDate = peopleStart;
				this.taskEndDate = peopleEnd;
			}
		}
	}

	_handleTaskChanged(taskStart, taskEnd, lockWeek) {
		if (this._isRootInstance) {
			if (lockWeek) {
				this.peopleStartDate = taskStart;
				this.peopleEndDate = taskEnd;
			}
		}
	}

	_handleUndoListChanged(undoListChanges) {
		if (this._isRootInstance) {
			this.hasUndoChanges = undoListChanges && undoListChanges.base && undoListChanges.base.length > 0;
		}
	}

	clearUndoList() {
		if (this._isRootInstance) {
			this._undoList = [];
		} else {
			return this._rootInstance.clearUndoList();
		}
	}

	addChangeToUndoList(change) {
		if (this._isRootInstance) {
			if (this._undoList.length == 3) {
				this.splice("_undoList", 0, 1);
			}
			this.push("_undoList", change);
		} else {
			return this._rootInstance.addChangeToUndoList(change);
		}
	}

	async undo() {
		if (this._isRootInstance) {
			if (this._undoList.length == 0) return;
			let change = this._undoList[this._undoList.length-1];
			let undoResult = await change.undo();
			if (undoResult == CHANGE_NOT_COMPLETED) {
				getTriserviceMessage().openChangeNotCompletedToastMessage();
			} else {
				this.pop("_undoList");
			}
		} else {
			return this._rootInstance.undo();
		}
	}

	_computeSmallLayout() {
		this.smallLayout = (screen.width < 600 || screen.height < 600) ;
		if (this.smallLayout) {
			this.lockWeek = false;
			if (getTriroutesWorkPlanner().teamAssignmentsRouteActive) getTriroutesWorkPlanner().openAssignment();
		}
	}

	_computeIsTouchDevice() {
		return /Android/i.test(navigator.userAgent)
			 || /iPhone/i.test(navigator.userAgent)
			 || /iPad/i.test(navigator.userAgent)
			 || /iPod/i.test(navigator.userAgent)
			 || (/Windows/i.test(navigator.userAgent) && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0));
	}
};

window.customElements.define(TriserviceWorkPlanner.is, TriserviceWorkPlanner);