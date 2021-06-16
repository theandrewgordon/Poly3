/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import { importJsPromise as dateUtilitiesImport } from "../../triplat-date-utilities/triplat-date-utilities.js";

import { isEmptyObj, capitalizeString } from "../utils/triutils-utilities.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import "./triservice-application-settings.js";
import { getTriserviceOutlook } from "./triservice-outlook.js";

export function getTriserviceRecurrence() {
	return getService(TriserviceRecurrence.is);
}

class TriserviceRecurrence extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-recurrence"; }

	static get template() {
		return html`
			<triservice-application-settings application-settings="{{_applicationSettings}}"></triservice-application-settings>
			<triservice-outlook recurrence="{{_outlookRecurrence}}"></triservice-outlook>
		`;
	}

	static get properties() {
		return {
			recurrence: {
				type: Object,
				value: () => {},
				notify: true
			},

			recurrenceAvailabilityPercentage: {
				type: Number,
				notify: true
			},

			isRecurring: {
				type: Boolean,
				value: false,
				notify: true
			},

			recurrenceEndDate: {
				type: String,
				value: "",
				notify: true
			},

			_applicationSettings: {
				type: Object
			},

			_outlookRecurrence: {
				type: Object
			},

			_loadingRecurrence: {
				type: Boolean,
				value: false
			},
		};
	}

	static get observers() {
		return [
			"_handleOutlookRecurrenceChanged(_outlookRecurrence)",
			"_setRecurrenceAvailabilityPercentage(_applicationSettings)",
			"_handleLoadingChanged(_loadingRecurrence)"
		];
	}

	async _handleOutlookRecurrenceChanged(outlookRecurrence) {
		if (this._isRootInstance) {
			try {
				this._loadingRecurrence = true;
				if (isEmptyObj(outlookRecurrence) || getTriserviceOutlook().isOccurrence()) {
					this.recurrence = null;
					this.isRecurring = false;
					this.recurrenceEndDate = "";
					return;
				}
				await dateUtilitiesImport;
				let recurrenceObj = {};
				let recurrenceWeekDays = [];

				const recurrenceType = outlookRecurrence.recurrenceType;
				if (recurrenceType && recurrenceType !== "") {
					recurrenceObj.type = (recurrenceType === "weekday") ? "WEEKLY" : recurrenceType.toUpperCase();
				}

				const recurrenceProperties = outlookRecurrence.recurrenceProperties;

				const recurrenceEndDate = (outlookRecurrence.seriesTime && outlookRecurrence.seriesTime.getEndDate()) ? outlookRecurrence.seriesTime.getEndDate() : "";
				const endDate = recurrenceEndDate !== "" ? moment(recurrenceEndDate).endOf("day").toISOString() : "";
				const endDateObj = {};
				endDateObj.type = endDate && endDate !== "" ? "End Date" : "No End Date";
				if (endDate && endDate !== "") endDateObj.endDate = endDate;
				this.recurrenceEndDate = endDate;

				switch (recurrenceType) {
					case "daily":
						recurrenceObj.dailyProperties = this._getDailyObj(recurrenceProperties.interval, endDateObj);
						break;
					case "weekday":
						recurrenceWeekDays = this._getFormattedWeekDaysArray(["mon", "tue", "wed", "thu", "fri"]);
						recurrenceObj.weeklyProperties = this._getWeeklyObj(1, recurrenceWeekDays, endDateObj);
						break;
					case "weekly":
						recurrenceWeekDays = this._getFormattedWeekDaysArray(recurrenceProperties.days);
						recurrenceObj.weeklyProperties = this._getWeeklyObj(recurrenceProperties.interval, recurrenceWeekDays, endDateObj);
						break;
					case "monthly":
						recurrenceObj.monthlyProperties = this._getMonthlyObj(recurrenceProperties.dayOfMonth, recurrenceProperties.dayOfWeek, recurrenceProperties.weekNumber, recurrenceProperties.interval, endDateObj);
						break;
					case "yearly":
						recurrenceObj.yearlyProperties = this._getYearlyObj(recurrenceProperties.dayOfMonth, recurrenceProperties.dayOfWeek, recurrenceProperties.month, recurrenceProperties.weekNumber, endDateObj);
						break;
				}

				this.recurrence = !isEmptyObj(recurrenceObj) ? {...recurrenceObj} : null;
				this.isRecurring = !isEmptyObj(this.recurrence);
			} finally {
				this._loadingRecurrence = false;
			}
		}
	}

	_getDailyObj(interval, endDateObj) {
		if (this._isRootInstance) {
			return {
				type: "Every [x] day(s)",
				interval: interval,
				end: endDateObj
			};
		}
	}

	_getWeeklyObj(interval, weeklyDays, endDateObj) {
		if (this._isRootInstance) {
			return {
				interval: interval,
				weeklyDays: weeklyDays,
				end: endDateObj
			};
		}
	}

	_getMonthlyObj(dayOfMonth, dayOfWeek, weekNumber, interval, endDateObj) {
		if (this._isRootInstance) {
			if (dayOfMonth) {
				return {
					type: "Day [x] of every [x] month(s)",
					interval: interval,
					dayOfMonth: dayOfMonth,
					end: endDateObj
				};
			}
			if (dayOfWeek) {
				return {
					type: "The [First] [Monday] of every [x] month(s)",
					interval: interval,
					dayOfWeek: this._getFormattedWeekDay(dayOfWeek),
					weekOfMonth: capitalizeString(weekNumber),
					end: endDateObj
				};
			}
		}
	}

	_getYearlyObj(dayOfMonth, dayOfWeek, month, weekNumber, endDateObj) {
		if (this._isRootInstance) {
			if (dayOfMonth) {
				return {
					type: "Every [May] [1]",
					dayOfMonth: dayOfMonth,
					month: this._getFormattedMonth(month),
					end: endDateObj
				};
			}
			if (dayOfWeek) {
				return {
					type: "The [First] [Monday] of [May]",
					dayOfWeek: this._getFormattedWeekDay(dayOfWeek),
					weekOfMonth: capitalizeString(weekNumber),
					month: this._getFormattedMonth(month),
					end: endDateObj
				};
			}
		}
	}

	_getFormattedWeekDaysArray(days) {
		if (this._isRootInstance) {
			const formattedWeekDays = days.map(day => {
				return this._getFormattedWeekDay(day);
			});
			return formattedWeekDays;
		}
	}

	_getFormattedWeekDay(day) {
		if (this._isRootInstance) {
			switch (day) {
				case "sun":
					return "Sunday";
				case "mon":
					return "Monday";
				case "tue":
					return "Tuesday";
				case "wed":
					return "Wednesday";
				case "thu":
					return "Thursday";
				case "fri":
					return "Friday";
				case "sat":
					return "Saturday";
			}
		}
	}

	_getFormattedMonth(month) {
		if (this._isRootInstance) {
			switch (month) {
				case "jan":
					return "January";
				case "feb":
					return "February";
				case "mar":
					return "March";
				case "apr":
					return "April";
				case "may":
					return "May";
				case "jun":
					return "June";
				case "jul":
					return "July";
				case "aug":
					return "August";
				case "sep":
					return "September";
				case "oct":
					return "October";
				case "nov":
					return "November";
				case "dec":
					return "December";
			}
		}
	}

	_setRecurrenceAvailabilityPercentage(applicationSettings) {
		if (this._isRootInstance) {
			this.recurrenceAvailabilityPercentage = !isEmptyObj(applicationSettings) && applicationSettings.occurrenceMatch ? applicationSettings.occurrenceMatch : null;
		}
	}
}

window.customElements.define(TriserviceRecurrence.is, TriserviceRecurrence);