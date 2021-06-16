/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";

export const TriTaskDetailSectionBehaviorImpl = {
    properties: {
		generalLoading: {
			type: Boolean,
			value: false
		},

		opened: {
			type: Boolean,
			value: false,
			notify: true,
			reflectToAttribute: true
		},

		_sectionLoadingBlocker: {
			type: Boolean,
			value: false,
			computed: "_computeSectionLoadingBlocker(generalLoading, smallLayout, opened)"
		},

		smallLayout:{
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    attached: function() {
		window.addEventListener("orientationchange", function() {
			if(this.opened)
				this._notifyResize(null, this.opened, 1000, true);
		}.bind(this));
	},

    _computeSectionLoadingBlocker: function(generalLoading, smallLayout, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (generalLoading && !smallLayout && opened);
	},

    _notifyResize: function(items, opened, wait, force) {
		var wait = wait ? wait : 300;
		if (force || items && items.length > 0 && opened) {
			this.async(function() {
				this.notifyResize();
			}, wait);
		}
	},

    importMeta: getModuleUrl("triview-work-task/tribehav-task-detail-section.js")
};

export const TriTaskDetailSectionBehavior = [ IronResizableBehavior, TriTaskDetailSectionBehaviorImpl];