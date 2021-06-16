/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../@polymer/polymer/lib/utils/debounce.js";
import { timeOut, microTask } from "../../@polymer/polymer/lib/utils/async.js";

import "../../tricore-url/tricore-url.js";
import { importJsPromise as dateUtilitiesImport, TriDateUtilities } from "../../triplat-date-utilities/triplat-date-utilities.js";

import { getTriroutesApp } from "../routes/triroutes-app.js";

import { TrimixinService, getService } from "./trimixin-service.js";
import { getTriserviceRoomFilters } from "./triservice-room-filters.js";
import { getTriserviceRoomsSearch } from "./triservice-rooms-search.js";
import { getTriserviceMessage } from "./triservice-message.js";
import { getTriserviceFavoriteRooms } from "./triservice-favorite-rooms.js";
import { isEmptyArray, isEmptyObj, isSafariBrowser, toLowerCase } from "../utils/triutils-utilities.js";

export function getTriserviceOutlook() {
	return getService(TriserviceOutlook.is);
}

const EXTRACT_CAL_UID_FROM_SOAP_RESPONSE_PATTERN = /<([^:]+:)?UID>(.*?)<\/([^:]+:)?UID>/;

class TriserviceOutlook extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-outlook"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<tricore-url raw-url="/p/web/locate" bind-url="{{_locateUrl}}"></tricore-url>
					<tricore-url raw-url="/p/websignon" bind-url="{{_webSignonUrl}}"></tricore-url>
				</template>
			</dom-if>
		`;
	}
	
	static get properties() {
		return {
			startDate: {
				type: String,
				value: null,
				notify: true
			},

			endDate: {
				type: String,
				value: null,
				notify: true
			},

			attendeesCount: {
				type: Number,
				value: 0,
				notify: true
			},

			enhancedLocations: {
				type: Array,
				value: () => [],
				notify: true
			},

			recurrence: {
				type: Object,
				value: () => {},
				notify: true
			},

			_loadingFromOutlook: {
				type: Boolean,
				value: false
			},

			_dialog: {
				type: Object
			},

			_locateUrl: {
				type: String,
				value: ""
			},

			_webSignonUrl: {
				type: String,
				value: ""
			},

			_refreshRoomLinks: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingFromOutlook)",
			"_handleEnhancedLocationsChanged(enhancedLocations.*)",
			"_refreshRoomLinksOnMeetingBody(_refreshRoomLinks, _loadingFromOutlook)"
		]
	}

	async refreshParametersFromOutlook() {
		if (this._isRootInstance) {
			this._loadingFromOutlook = true;
			try {
				await dateUtilitiesImport;
				let startDate = await this._getStartDate();
				let endDate =  await this._getEndDate();
				let attendeesCount = await this._getAttendeesCount();
				let enhancedLocations = await this._getEnhancedLocations();
				let recurrence = await this._getRecurrence();

				this.startDate = startDate;
				this.endDate =  endDate;
				this.attendeesCount = attendeesCount;
				getTriserviceRoomFilters().roomCapacity = this.attendeesCount;
				this.enhancedLocations = enhancedLocations;
				await getTriserviceRoomsSearch().refreshAddedRoomsFromEmailList(enhancedLocations);
				this.recurrence = recurrence;
			} catch (e) {
				console.log(e);
				var __dictionary__outlookError = "An error occured while retrieving meeting information from Outlook.";
				getTriserviceMessage().openToastMessage("error", "", __dictionary__outlookError);
				throw __dictionary__outlookError;
			} finally {
				this._loadingFromOutlook = false;
			}
		} else {
			return this._rootInstance.refreshParametersFromOutlook();
		}
	}

	listenToMeetingChanges() {
		if (this._isRootInstance) {
			if (this._isListeningToMeetingChanges) return;
			Office.context.mailbox.item.addHandlerAsync(Office.EventType.AppointmentTimeChanged, this._handleMeetingChanged.bind(this));
			Office.context.mailbox.item.addHandlerAsync(Office.EventType.RecurrenceChanged, this._handleMeetingChanged.bind(this));
			Office.context.mailbox.item.addHandlerAsync(Office.EventType.RecipientsChanged, this._handleMeetingChanged.bind(this));
			Office.context.mailbox.item.addHandlerAsync(Office.EventType.EnhancedLocationsChanged, this._handleMeetingChanged.bind(this));
			this._isListeningToMeetingChanges = true;
		} else {
			return this._rootInstance.listenToMeetingChanges();
		}
	}

	/**
	 * Returns true if it is an occurrence of a repeating series or if it is the parent series.
	 */
	isRecurrence() {
		if (this._isRootInstance) {
			return this.isOccurrence() || !isEmptyObj(this.recurrence)
		} else {
			return this._rootInstance.isRecurrence();
		}
	}

	_handleMeetingChanged() {
		if (this._isRootInstance) {
			if (this._loadingFromOutlook) return;
			this._debounceHandleMeetingChanged = Debouncer.debounce(
				this._debounceHandleMeetingChanged,
				timeOut.after(300),
				this.refreshParametersFromOutlook.bind(this)
			);
		}
	}

	getIdentityToken() {
		if (this._isRootInstance) {
			if (this._identityToken) {
				return Promise.resolve(this._identityToken);
			}
			return new Promise((resolve, reject) => {
				this._loadingFromOutlook = true;
				Office.context.mailbox.getUserIdentityTokenAsync((asyncResult) => {
					this._loadingFromOutlook = false;
					if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
						this._identityToken = asyncResult.value;
						resolve(asyncResult.value);
					} else {
						reject(asyncResult.error);
					}
				});
			});
		} else {
			return this._rootInstance.getIdentityToken();
		}
	}

	addRoomToOutlookMeeting(room) {
		if (this._isRootInstance) {
			this._loadingFromOutlook = true;
			const enhancedLocations = [{id: room.exchangeMailbox, type: "room"}];
			return new Promise((resolve, reject) => {
				Office.context.mailbox.item.enhancedLocation.addAsync(enhancedLocations, (asyncResult) => {
					if (asyncResult.status == Office.AsyncResultStatus.Failed) {
						this._loadingFromOutlook = false;
						reject(asyncResult.error);
					} else {
						this.push("enhancedLocations", room.exchangeMailbox);
						getTriserviceRoomsSearch().addRoomToAddedRooms(room);
						this._loadingFromOutlook = false;
						resolve();
					}
				});
			});
		} else {
			return this._rootInstance.addRoomToOutlookMeeting(room);
		}
	}

	removeRoomFromOutlookMeeting(room) {
		if (this._isRootInstance) {
			this._loadingFromOutlook = true;
			const enhancedLocations = [{id: room.exchangeMailbox, type: "room"}];
			return new Promise((resolve, reject) => {
				Office.context.mailbox.item.enhancedLocation.removeAsync(enhancedLocations, asyncResult => {
					if (asyncResult.status == Office.AsyncResultStatus.Failed) {
						this._loadingFromOutlook = false;
						reject(asyncResult.error);
					} else {
						this._removeRoomFromEnhancedLocations(room);
						getTriserviceRoomsSearch().removeRoomFromAddedRooms(room);
						this._loadingFromOutlook = false;
						resolve();
					}
				});
			});
		} else {
			return this._rootInstance.removeRoomFromOutlookMeeting(room);
		}
	}

	isAuthDialog() {
		var urlSearch = window.location.search;
		urlSearch = urlSearch != null ? urlSearch : "";
		return urlSearch.indexOf("authDialog=true") >= 0;
	}

	openAuthDialog() {
		if (this._isRootInstance) {
			const dialogOptions = {height: 60, width: 30, promptBeforeOpen: false};
			return this.openDialog("?authDialog=true", dialogOptions);
		} else {
			return this._rootInstance.openAuthDialog();
		}
	}

	openSSODialog() {
		if (this._isRootInstance) {
			const dialogOptions = {height: 60, width: 30, promptBeforeOpen: false};
			const redirectUrl = `${window.location.origin}${window.location.pathname}#!/sso`;
			const dialogUrl = `${window.location.origin}${this._webSignonUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}`;
			if (this.isAuthDialog()) {
				window.location.href = dialogUrl;
			} else {
				return this.openDialog(dialogUrl, dialogOptions, true);
			}
		} else {
			return this._rootInstance.openSSODialog();
		}
	}

	openDialog(url, dialogOptions, completeUrl = false) {
		if (this._isRootInstance) {
			this._loadingFromOutlook = true;
			const defaultOptions = {height: 80, width: 60, promptBeforeOpen: false};
			dialogOptions = dialogOptions != null ? dialogOptions : defaultOptions;
			this._closeDialog();
			return new Promise((resolve, reject) => {
				Office.context.ui.displayDialogAsync(
					completeUrl ? url : window.location.origin + window.location.pathname + url,
					dialogOptions,
					this._dialogCallback.bind(this, resolve, reject)
				);
			});
		} else {
			return this._rootInstance.openDialog(url);
		}
	}

	_dialogCallback(resolve, reject, asyncResult) {
		this._loadingFromOutlook = false;
		if (asyncResult.status == Office.AsyncResultStatus.Failed) {
			reject(asyncResult.error);
		} else {
			this.set("_dialog", asyncResult.value);
			this._dialog.addEventHandler(Office.EventType.DialogMessageReceived, arg => {
				this._debouncePopupDialogCallback = Debouncer.debounce(
					this._debouncePopupDialogCallback,
					timeOut.after(100),
					() => {
						const messageFromDialog = JSON.parse(arg.message);
						if (messageFromDialog.messageType === "dialogAction" && messageFromDialog.message === "addRoom") {
							this.addRoomToOutlookMeeting(messageFromDialog.room);
							this._closeDialog();
						} else if (messageFromDialog.messageType === "dialogAction" && messageFromDialog.message === "removeRoom") {
							this.removeRoomFromOutlookMeeting(messageFromDialog.room);
							this._closeDialog();
						} else if (messageFromDialog.messageType === "dialogAction" && messageFromDialog.message === "favoriteToggled") {
							const popupRoom = messageFromDialog.room;
							if (messageFromDialog.isFavorite) {
								getTriserviceFavoriteRooms().addFavoriteRoom(popupRoom);
							} else {
								getTriserviceFavoriteRooms().removeFavoriteRoom(popupRoom);
							}
						} else if (messageFromDialog.messageType === "authAction" && messageFromDialog.message === "reloadApp") {
							this._closeDialog();
							location.reload();
						} else if (messageFromDialog.messageType === "dialogClosed") {
							this._closeDialog();
						}
				});
			});
			resolve();
		}
	}

	sendReloadMessageToParent() {
		if (this._isRootInstance) {
			const messageObject = {
				messageType: "authAction",
				message: "reloadApp"
			};
			this.messageParent(messageObject);
		} else {
			return this._rootInstance.sendReloadMessageToParent();
		}
	}

	messageParent(messageObject) {
		if (this._isRootInstance) {
			const jsonMessage = JSON.stringify(messageObject);
			Office.context.ui.messageParent(jsonMessage);
		} else {
			return this._rootInstance.messageParent(messageObject);
		}
	}
	
	getCurrentUserEmail() {
		return Office.context.mailbox.userProfile.emailAddress;
	}

	_removeRoomFromEnhancedLocations(room) {
		if (this._isRootInstance) {
			const locationIndex = this.enhancedLocations.findIndex(location => location === room.exchangeMailbox);
			if (locationIndex > -1) this.splice("enhancedLocations", locationIndex, 1);
		}
	}

	closeAddin() {
		if (this._isRootInstance) {
			this._closeDialog();
			return Office.context.ui.closeContainer();
		} else {
			return this._rootInstance.closeAddin();
		}
	}

	_closeDialog() {
		try  {
			if (this._dialog) {
				this._dialog.close();
			}
		} catch (e) {
			console.log(e);
		}
		this.set("_dialog", null);
	}

	_getStartDate() {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.start.getAsync(result => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					resolve(this._convertDateToIso(result.value));
				} else {
					reject(result.error);
				}
			});
		});
	}

	_getEndDate() {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.end.getAsync(result => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					resolve(this._convertDateToIso(result.value));
				} else {
					reject(result.error);
				}
			});
		});
	}

	_convertDateToIso(date) {
		if (date && date.getTime) {
			return TriDateUtilities.toDateIsoString(date.getTime());
		}
		return TriDateUtilities.getCurrentDatetime();
	}

	async _getAttendeesCount() {
		let requiredCount = await this._getRequiredAttendeesCount();
		let optionalCount = await this._getOptionalAttendeesCount();
		return 1 + requiredCount + optionalCount;
	}

	_getRequiredAttendeesCount() {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.requiredAttendees.getAsync(result => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					let currentUserEmail = toLowerCase(this.getCurrentUserEmail());
					let requiredAttendees = result.value.filter((item) => toLowerCase(item.emailAddress) != currentUserEmail);
					resolve(requiredAttendees.length);
				} else {
					resolve(0);
				}
			});
		});
	}

	_getOptionalAttendeesCount() {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.optionalAttendees.getAsync(result => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					resolve(result.value.length);
				} else {
					resolve(0);
				}
			});
		});
	}

	_getEnhancedLocations() {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.enhancedLocation.getAsync(result => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					const locationResults = result.value;
					let enhancedLocations = [];
					if (!isEmptyArray(locationResults)) {
						locationResults.forEach(location => enhancedLocations.push(location.emailAddress));
					}
					resolve(enhancedLocations);
				} else {
					resolve([]);
				}
			});
		});
	}

	_getRecurrence() {
		if (this.isOccurrence()) {
			return Promise.resolve({});
		}
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.recurrence.getAsync(result => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					let recurrence = result.value;
					resolve(!isEmptyObj(recurrence) ? {...recurrence} : {});
				} else {
					resolve({});
				}
			});
		});
	}

	_handleEnhancedLocationsChanged(enhancedLocationsChange) {
		if (this._isRootInstance) {
			const triRoutesApp = getTriroutesApp();
			if (!triRoutesApp || !triRoutesApp.roomSearchRouteActive) return;
			this._debounceHandleEnhancedLocationsChanged = Debouncer.debounce(
				this._debounceHandleEnhancedLocationsChanged,
				microTask,
				() => { this._refreshRoomLinks = true; }
			);
		}
	}

	async _refreshRoomLinksOnMeetingBody() {
		if (this._isRootInstance) {
			if (!this._refreshRoomLinks || this._loadingFromOutlook) return;
			this._loadingFromOutlook = true;
			try {
				const serviceRoomsSearch = getTriserviceRoomsSearch();
				let addedRooms = serviceRoomsSearch != null ? serviceRoomsSearch.getAddedRoomsWithoutFavoriteData() : [];
				addedRooms = addedRooms != null ? addedRooms : [];
				const __dictionary__linkText = "Open floor plan for {1}.";
				let roomLinks = addedRooms.reduce((accumulator, currentValue) => {
					const linkText = __dictionary__linkText.replace("{1}", currentValue.name);
					return accumulator + `<p><a href="${window.location.origin}${this._locateUrl}#!/room/${currentValue._id}/location/min">${linkText}</a></p>`;
				}, "");
				let meetingBody = await this._getMeetingBody();
				meetingBody = this._clearRoomLinks(meetingBody);
				const lastDivIndex = meetingBody.lastIndexOf("</div>");
				const leftPart = lastDivIndex < 0 ? meetingBody : lastDivIndex > 0 ? meetingBody.substring(0, lastDivIndex) : "";
				const rightPart = lastDivIndex >= 0 ? meetingBody.substring(lastDivIndex) : "";
				const newMeetingBody = `${leftPart}${roomLinks}${rightPart}`;
				await this._setMeetingBody(newMeetingBody);
			} finally {
				this._refreshRoomLinks = false;
				this._loadingFromOutlook = false;
			}
		}
	}

	_clearRoomLinks(meetingBody) {
		return meetingBody.replace(new RegExp("<a(.|[\\n,\\r])+?/p/web/locate#!/room/(.|[\\n,\\r])+?</a>","g"),"")
			.replace(new RegExp("<p[^>]*>(&nbsp;|[\\s\\r\\n]*)</p>","g"),"");
	}

	_getMeetingBody() {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.body.getAsync(Office.CoercionType.Html, result => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					resolve(result.value);
				} else {
					reject(result.error);
				}
			});
		});
	}

	_setMeetingBody(meetingBody) {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.body.setAsync(meetingBody, { coercionType: Office.CoercionType.Html }, result => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					resolve();
				} else {
					reject(result.error);
				}
			});
		});
	}

	getSeriesId() {
		if (this._isRootInstance) {
			return Office.context.mailbox.item.seriesId;
		} else {
			return this._rootInstance.getSeriesId();
		}
	}

	isOccurrence() {
		if (this._isRootInstance) {
			const seriesId = this.getSeriesId();
			return seriesId != null && seriesId.length > 0;
		} else {
			return this._rootInstance.isOccurrence();
		}
	}

	isOutlookDesktopClient() {
		if (this._isRootInstance) {
			return Office.context.mailbox.diagnostics.hostName == "Outlook";
		} else {
			return this._rootInstance.isOutlookDesktopClient();
		}
	}

	isClientNotSupported() {
		if (this._isRootInstance) {
			return this.isOutlookWebClient() && !Office.context.requirements.isSetSupported("mailbox", "1.7");
		} else {
			return this._rootInstance.isClientNotSupported();
		}
	}

	isOutlookWebClient() {
		if (this._isRootInstance) {
			return Office.context.mailbox.diagnostics.hostName == "OutlookWebApp";
		} else {
			return this._rootInstance.isOutlookWebClient();
		}
	}

	async getCalendarUIDFromMeeting() {
		if (this._isRootInstance) {
			this._loadingFromOutlook = true;
			try {
				const itemId = await this._getMeetingId();
				return await this._makeEwsRequestToGetCalendarUID(itemId);
			} catch(error) {
				return null;
			} finally {
				this._loadingFromOutlook = false;
			}
		} else {
			return this._rootInstance.getCalendarUIDFromMeeting();
		}
	}

	_makeEwsRequestToGetCalendarUID(itemId) {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.makeEwsRequestAsync(this._getCalendarUIDSoapRequest(itemId), (result) => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					const matchesUid = result.value.match(EXTRACT_CAL_UID_FROM_SOAP_RESPONSE_PATTERN);
					resolve(matchesUid && matchesUid.length == 4 ? matchesUid[2] : null);
				} else {
					reject(result.error);
				}
			});
		});
	}

	async _getMeetingId() {
		try {
			return await this._getMeetingIdFromGetItem();
		} catch (error) {
			return await this._getMeetingIdFromSaveAsync();
		}
	}

	_getMeetingIdFromSaveAsync() {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.saveAsync((result) => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					resolve(result.value);
				} else {
					reject(result.error);
				}
			});
		});
	}

	_getMeetingIdFromGetItem() {
		return new Promise((resolve, reject) => {
			Office.context.mailbox.item.getItemIdAsync((result) => {
				if (result.status === Office.AsyncResultStatus.Succeeded) {
					resolve(result.value);
				} else if (result.error && result.error.name == "ItemNotSaved") {
					// If the item is not saved, then just return null since there is no item ID.
					return resolve(null);
				} else {
					reject(result.error);
				}
			});
		});
	}

	_getCalendarUIDSoapRequest(itemId) {
		return `<?xml version="1.0" encoding="utf-8"?>
			<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
				<soap:Header>
					<RequestServerVersion Version="Exchange2013" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" soap:mustUnderstand="0" />
				</soap:Header>
				<soap:Body>
					<GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">
					<ItemShape>
						<t:BaseShape>IdOnly</t:BaseShape>
						<t:AdditionalProperties>
							<t:FieldURI FieldURI="calendar:UID"/>
						</t:AdditionalProperties>
					</ItemShape>
					<ItemIds><t:ItemId Id="${itemId}"/></ItemIds>
					</GetItem>
				</soap:Body>
			</soap:Envelope>
		`;
	}

	isOutlookMacDesktopClient() {
		return this.isOutlookDesktopClient() && isSafariBrowser();
	}

	isOutlookWebOnSafari() {
		return !this.isOutlookDesktopClient() && isSafariBrowser();
	}
};

window.customElements.define(TriserviceOutlook.is, TriserviceOutlook);