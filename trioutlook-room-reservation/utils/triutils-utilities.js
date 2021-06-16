/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

export function isEmptyArray(array) {
	return !array || !Array.isArray(array) || !array.length || array.length === 0;
}

export function isEmptyObj(obj) {
	return !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);
}

export function isIEorEdgeBrowser() {
	return /Edge|Trident/.test(navigator.userAgent);
}

export function isSafariBrowser() {
	return /Mac OS X.+?AppleWebKit/.test(navigator.userAgent) &&
		navigator.userAgent.indexOf("Chrome") < 0;
}

export function capitalizeString(string) {
	return string && string[0].toUpperCase() + string.slice(1);
}

export function toLowerCase(str) {
	return str != null && str.toLowerCase ? str.toLowerCase() : "";
}