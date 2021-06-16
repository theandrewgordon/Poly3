/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../@polymer/polymer/lib/utils/render-status.js";
import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../@polymer/iron-pages/iron-pages.js";

import { importJsPromise as triplatDateUtilitiesReady } from "../../triplat-date-utilities/triplat-date-utilities.js";
import { getModuleUrl, importJs } from "../../tricore-util/tricore-util.js";

import "../../triplat-routing/triplat-routing.js";
import "../../triplat-loading-indicator/triplat-loading-indicator.js";
import "../styles/tristyles-work-planner.js";
import "../pages/assignment/tripage-assignment.js";
import "../pages/team/tripage-team-assignments.js";
import "../pages/people-list/tripage-people-list.js";
import "../routes/triroutes-work-planner.js";
import "../services/triservice-work-planner.js";
import "../services/triservice-workgroup.js";
import "../services/triservice-work-task.js";
import "../services/triservice-people.js";
import "../services/triservice-loading.js";
import "../services/triservice-task-assignment.js";
import "../services/triservice-message.js";
import "../services/triservice-member-assigned-tasks.js";

const animationsImportPromise = importJs("../../web-animations-js/web-animations-next-lite.min.js", "triview-work-planner/app/trimain-work-planner.js");

Promise.all([triplatDateUtilitiesReady, animationsImportPromise]).then(() => {
	class TrimainWorkPlanner extends PolymerElement {
		static get is() { return "trimain-work-planner"; }

		static get template() {
			return html`
				<style include="work-planner-shared-styles work-planner-layout-styles tristyles-theme">
					:host {
						@apply --layout-vertical;
					}

					:host(:not([_small-layout])) {
						min-height: 500px;
					}
				</style>

				<triroutes-work-planner on-team-assignments-route-active-changed="_loadTeamAssignmentsPage"
					on-people-list-route-active-changed="_loadPeopleListPage">
				</triroutes-work-planner>

				<triservice-message id="messageService"></triservice-message>
				<triservice-work-planner small-layout="{{_smallLayout}}"></triservice-work-planner>
				<triservice-workgroup no-workgroup="{{_noWorkgroup}}"></triservice-workgroup>
				<triservice-people></triservice-people>
				<triservice-work-task></triservice-work-task>
				<triservice-member-assigned-tasks></triservice-member-assigned-tasks>
				<triservice-task-assignment></triservice-task-assignment>
				<triservice-security></triservice-security>
				<triservice-loading loading="{{_loading}}"></triservice-loading>

				<dom-if if="[[_noWorkgroup]]">
					<template>
						<div class="message-placeholder" hidden\$="[[_loading]]">
							<div aria-label\$="[[_noWorkgroupMessage]]" tabindex="0" aria-live="polite">[[_noWorkgroupMessage]]</div>
						</div>
					</template>
				</dom-if>
				
				<dom-if if="[[!_noWorkgroup]]">
					<template>
						<triplat-route-selector id="routeSelector">
							<iron-pages>
								<tripage-assignment id="assignmentPage" route="assignment" default-route></tripage-assignment>
								<div route="teamAssignments">
									<dom-if id="teamAssignmentsPageIf">
										<template>
											<tripage-team-assignments></tripage-team-assignments>
										</template>
									</dom-if>
								</div>
								<div route="peopleList">
									<dom-if id="peopleListPageIf">
										<template>
											<tripage-people-list></tripage-people-list>
										</template>
									</dom-if>
								</div>
							</iron-pages>
						</triplat-route-selector>
					</template>
				</dom-if>
				
				<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>
			`;
		}

		static get properties() {
			return {
				_noWorkgroup: {
					type: Boolean
				},

				_loading: {
					type: Boolean
				},

				_smallLayout: {
					type: Boolean,
					reflectToAttribute: true
				},

				_noWorkgroupMessage: {
					type: String,
					value: () => {
						let __dictionary__message =  "You are not the supervisor of a workgroup. To access this app, you must be the supervisor of one or more workgroups.";
						return __dictionary__message;
					}
				}
			};
		}


		constructor() {
			super();
			this._onDSErrorListener = this._handeDSErrors.bind(this);
		}

		connectedCallback() {
			super.connectedCallback();
			this.addEventListener("ds-add-error", this._onDSErrorListener);
			this.addEventListener("ds-create-error", this._onDSErrorListener);
			this.addEventListener("ds-delete-error", this._onDSErrorListener);
			this.addEventListener("ds-get-error", this._onDSErrorListener);
			this.addEventListener("ds-perform-action-error", this._onDSErrorListener);
			this.addEventListener("ds-remove-error", this._onDSErrorListener);
			this.addEventListener("ds-update-error", this._onDSErrorListener);
		}
		
		disconnectedCallback() {
			super.disconnectedCallback();
			this.removeEventListener("ds-add-error", this._onDSErrorListener);
			this.removeEventListener("ds-create-error", this._onDSErrorListener);
			this.removeEventListener("ds-delete-error", this._onDSErrorListener);
			this.removeEventListener("ds-get-error", this._onDSErrorListener);
			this.removeEventListener("ds-perform-action-error", this._onDSErrorListener);
			this.removeEventListener("ds-remove-error", this._onDSErrorListener);
			this.removeEventListener("ds-update-error", this._onDSErrorListener);
		}

		_handeDSErrors(error) {
			if (error.detail && error.detail.errorType == "SecurityException") {
				return;
			}
			if (error.detail && error.detail.status == 401) {
				this.$.messageService.openUnauthorizedAccessToastMessage();
				setTimeout(() => location.reload(), 5000);
				return;
			}
			console.error(error.detail);
			this.$.messageService.openDefaultErrorPopup();
		}

		_loadTeamAssignmentsPage(e) {
			if (e.detail.value) {
				afterNextRender(this, () => this.shadowRoot.querySelector("#teamAssignmentsPageIf").if = true);
			}
		}

		_loadPeopleListPage(e) {
			if (e.detail.value) {
				afterNextRender(this, () => this.shadowRoot.querySelector("#peopleListPageIf").if = true);
			}
		}

		static get importMeta() {
			return getModuleUrl("triview-work-planner/app/trimain-work-planner.js");
		}
	};
	window.customElements.define(TrimainWorkPlanner.is, TrimainWorkPlanner);
});
