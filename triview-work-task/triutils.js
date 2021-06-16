/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

export function computeHideActionBar(smallLayout, opened, isPageActive, readonly) {
	if (!assertParametersAreDefined(arguments)) {
		return;
	}

	if (readonly || !smallLayout)
		return true;
	else
		return !opened || isPageActive;
}

export function computeReadonly(readonly, online) {
	return readonly || !online;
}