/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

export const OUTLOOK_TOKEN_KEY = "outlookIdentityToken";

export function saveDataToLocal(data, key) {
	if (data && key) {
		try {
			localStorage.setItem(key, JSON.stringify(data));
		} catch (error) {
			console.error("ERROR: Unable to save to local storage.", error);
		}
	}
}

export function getDataFromLocal(key) {
	let result;
	try {
		result = JSON.parse(localStorage.getItem(key));
	} catch (error) {
		console.error("ERROR: Unable to retrieve from local storage.", error);
	}
	deleteDataFromLocal(key);
	return result;
}

export function deleteDataFromLocal(key) {
	localStorage.removeItem(key);
}