/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

export function formatDate(date, dateFormat, locale) {
	let parsedDate = moment.parseZone(date);
	if (locale) {
		parsedDate = parsedDate.locale(locale);
	}
	return parsedDate.formatWithJDF(dateFormat);
};

export function isDateBetween(datetime, startDate, endDate) {
	const dateFormat = "YYYY-MM-DD";
	const dateMoment = moment(datetime, dateFormat);
	const startDateMoment = moment(startDate, dateFormat);
	const endDateMoment = moment(endDate, dateFormat);
	return (dateMoment.isSameOrAfter(startDateMoment)) && (dateMoment.isSameOrBefore(endDateMoment));
};