/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
export const TriValidationBehavior = {

	_isValidString: function(stringValue) {
		return !!stringValue && stringValue !== null && stringValue !== undefined;
	},

	_isValidSelectInputOption: function(selectInputOption) {
		// empty select input options are usually defaulted to { id: null, value: null }
		return selectInputOption && this._isValidString(selectInputOption.id) && this._isValidString(selectInputOption.value);
	},

};