/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "./tristyles-work-task-app.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import "./tricomp-task-detail-section.js";
import "./tricomp-task-id.js";
import { TriroutesTaskDetail } from "./triroutes-task-detail.js";
import "./triservice-work-task.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import "../triapp-comments/triapp-comments.js";

Polymer({
    _template: html`
		<style include="work-task-detail-section tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				.comments-title {
					margin-top: 10px;
					padding: 5px;
				}
				
				tricomp-task-detail-section {
					--tricomp-task-detail-section-collapse: {
						overflow-y:auto;
					};
				}

				.comments {
					padding: 10px 5px 5px 5px;
					border-bottom:1px solid var(--ibm-gray-30);
					margin-bottom: 15px;
				}

				:host(:not([small-layout])) .comments {
					min-height: 432px;
					border-bottom:1px solid var(--ibm-gray-30);
					margin: 0px 15px 15px 15px;
				}
			
		</style>

		<triplat-route name="taskComments" params="{{_taskCommentsParams}}" on-route-active="_onRouteActive"></triplat-route>

		<triservice-work-task id="workTaskService" comments="{{_comments}}" comments-count="{{_commentsCount}}" loading-comments="{{_loadingComments}}"></triservice-work-task>

		<tricomp-task-detail-section small-layout="[[smallLayout]]" header="[[_header]]" aria-label="[[_header]]" opened="{{opened}}" count="[[_commentsCount]]" enable-add="[[!_commentsCount]]" on-add-tapped="_addComments" readonly="[[readonly]]" loading="[[_loading]]" alt-add-new="[[_altAddNew]]" alt-expand="[[_altExpand]]" alt-collapse="[[_altCollapse]]">

			<div class="section-content" slot="section-content">
				<tricomp-task-id task="[[task]]" hidden\$="[[!smallLayout]]"></tricomp-task-id>

				<div class="comments-title" hidden\$="[[_computeHideCommentsTitle(smallLayout, readonly)]]">[[_commentsTitle]]</div>

				<dom-if if="[[opened]]">
					<template>
						<triapp-comments class="comments" id="appComments" current-user="[[currentUser]]" comments-title="[[_commentsTitle]]" comments="[[_comments]]" loading="[[_loadingComments]]" on-add-comment="_handleAddComment" online="[[online]]" on-error-alert="_handleCommentAlert" read-only="[[readonly]]" small-screen-width="[[smallLayout]]" disable-screen-size-detection>
						</triapp-comments>
					</template>
				</dom-if>
				
			</div>
		</tricomp-task-detail-section>
	`,

    is: "tricomp-task-detail-comments",

    behaviors: [ 
		TriComputeLoadingBehavior,
		TriTaskDetailSectionBehavior
	],

    properties: {
		currentUser: {
			type: Object
		},
		
		online: {
			type: Object,
			value: true
		},

		task: {
			type: Object
		},

		readonly: Boolean,

		_comments: {
			type: Array
		},

		_commentsCount: {
			type: Number
		},

		_taskCommentsParams: {
			type: Object
		},

		_loadingComments: {
			type: Boolean
		},

		_header: {
			type: String
		},

		_commentsTitle: {
			type: String
		},

		_altAddNew: {
			type: String
		},

		_altExpand: {
			type: String
		},

		_altCollapse: {
			type: String
		}
	},

    observers: [
		"_notifyResize(_comments, opened, 500)",
		"_setLoadingBlockers(_sectionLoadingBlocker)",
		"_setValidLoadings(_loadingComments)"
	],

    attached: function() {
		var __dictionary__header = "Comments and Photos";
		this.set("_header", __dictionary__header);
		var __dictionary__commentsTitle = "Add comments and photos";
		this.set("_commentsTitle", __dictionary__commentsTitle);

		var __dictionary__altAddNew = "Add comments and photos";
		var __dictionary__altExpand = "Expand comments and photos section";
		var __dictionary__altCollapse = "Collapse comments and photos section";
		this.set("_altAddNew", __dictionary__altAddNew);
		this.set("_altExpand", __dictionary__altExpand);
		this.set("_altCollapse", __dictionary__altCollapse);
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.workTaskService.refreshTaskComments(this._taskCommentsParams.taskId);
			});
		}
	},

    _handleAddComment: function(e){
		this.$.workTaskService.createTaskComment(this._taskCommentsParams.taskId, e.detail.comment)
			.then(this._initNewComment.bind(this));
	},

    _initNewComment: function(){
		this.shadowRoot.querySelector("#appComments").createNewComment();
	},

    _addComments: function(e) {
		e.stopPropagation();
		TriroutesTaskDetail.getInstance().openTaskComments(this.task._id, !this.smallLayout);
	},

    _handleCommentAlert: function(e) {
		this.fire("work-task-alert", { type: "error", title: e.detail });
	},

    _computeHideCommentsTitle: function(smallLayout, readonly) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !smallLayout || readonly;
	},

    importMeta: getModuleUrl("triview-work-task/tricomp-task-detail-comments.js")
});