/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

export const TriComputeLoadingBehavior = {
	properties: {
		_loading: {
			type: Boolean,
			value: false
		},

		/*
		 * Conditions that will invalid the `_validLoadings`, to avoid loading conflicts (multiple loading indicators).
		 */
		_loadingBlockers: {
			type: Array,
			value: function() {
				return [];
			}
		},

		_validLoadings: {
			type: Array,
			value: function() {
				return [];
			}
		}
	},

	observers: [
		"_computeLoading(_loadingBlockers, _validLoadings)"
	],

	_setLoadingBlockers: function() {
		var args = arguments;
		var loadingBlockers = [];

		for (var blockers = 0; blockers < args.length; blockers++) {
			loadingBlockers.push(args[blockers]);
		}

		this._loadingBlockers = loadingBlockers;
	},

	_setValidLoadings: function() {
		var args = arguments;
		var validLoadings = [];

		for (var valids = 0; valids < args.length; valids++) {
			validLoadings.push(args[valids]);
		}

		this._validLoadings = validLoadings;
	},

	_computeLoading: function(loadingBlockers, validLoadings) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var loading = false;
		var ignoreLoading = false;

		for (var i = 0; i < loadingBlockers.length; i++) {
			if (loadingBlockers[i]) {
				ignoreLoading = true;
				break;
			}
		}

		for (var aux = 0; aux < validLoadings.length; aux++) {
			if (validLoadings[aux]) {
				loading = true;
				break;
			}
		}

		this._loading = (ignoreLoading) ? false : loading;
	}
};