/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import { assertParametersAreDefined } from '../tricore-util/tricore-util.js';

export const TriWorkTaskTimeUtilitiesBehaviorImpl = {
	properties: {
		_userTimeFormat: {
			type: String,
			value: "hh:mm a",
			computed: "_displayTimeFormat(currentUser._DateTimeFormat)"
		}
	},
	
	/*
	 * Return only the time format from the user's date time format, without the time zone.
	 */
	_displayTimeFormat: function(format) {
		if (format) {
			// Index of the "h" or "H" in the datetime format.
			// This index will be used to get only the time format from the datetime.
			var timeIndex = (format.indexOf("h") > 0) ? format.indexOf("h") : format.indexOf("H");
			return format.substr(timeIndex);
		} else {
			return "hh:mm a"
		}
	},

	_convertHoursToMilliseconds: function(hours) {
		return Math.round(hours * 3600) * 1000;
	},

	_convertMillisecondsToHours: function(milliseconds) {
		return (milliseconds / 3600000);
	},

	_convertDateAndTime: function(dateTime, currentUser, format) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return this.formatDateWithTimeZone(dateTime, currentUser._TimeZoneId, format, currentUser._Locale);
	}
};

export const TriWorkTaskTimeUtilitiesBehavior = [ TriDateUtilities, TriWorkTaskTimeUtilitiesBehaviorImpl ];