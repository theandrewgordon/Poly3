/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

export function computeStatusReadonly(authReadonly, statusENUS) {
	const editable = statusENUS === "Draft" || statusENUS === undefined || statusENUS === null;
	return authReadonly || !editable;
}