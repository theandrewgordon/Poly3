/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../@polymer/polymer/lib/utils/debounce.js";
import { timeOut, microTask } from "../../@polymer/polymer/lib/utils/async.js";

import "../../triplat-ds/triplat-ds.js";
import "../../triplat-ds-core/triplat-ds-core.js";
import "../../triplat-duration/triplat-duration.js";
import "../../triplat-query/triplat-query.js";
import { importJsPromise as dateUtilitiesImport } from "../../triplat-date-utilities/triplat-date-utilities.js";

import "../routes/triroutes-room-search.js";
import { isEmptyArray } from "../utils/triutils-utilities.js";
import { saveDataToLocal, getDataFromLocal } from "../utils/triutils-localstorage.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import "./triservice-application-settings.js";
import { getTriserviceFavoriteRooms } from "./triservice-favorite-rooms.js";
import "./triservice-outlook.js";
import "./triservice-recurrence.js";
import "./triservice-room-filters.js";

export function getTriserviceRoomsSearch() {
	return getService(TriserviceRoomsSearch.is);
};

class TriserviceRoomsSearch extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-rooms-search"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triroutes-room-search results-route-active="{{_resultsRouteActive}}"></triroutes-room-search>

					<triservice-application-settings is-ready="{{_isApplicationSettingsReady}}"></triservice-application-settings>
					<triservice-favorite-rooms favorite-rooms="{{_favoriteRooms}}"></triservice-favorite-rooms>
					<triservice-outlook start-date="{{_startDate}}" end-date="{{_endDate}}"></triservice-outlook>
					<triservice-recurrence recurrence="{{_recurrence}}" recurrence-availability-percentage="{{_recurrenceAvailabilityPercentage}}" is-recurring="{{_isRecurring}}" recurrence-end-date="{{_recurrenceEndDate}}"></triservice-recurrence>
					<triservice-room-filters default-filters-loaded="{{_defaultFiltersLoaded}}" all-filters="{{_allFilters}}" location-filter="{{_locationFilter}}" room-capacity="{{_roomCapacity}}" layout-filter="{{_layoutFilter}}" amenities-filter="{{_amenitiesFilter}}"></triservice-room-filters>

					<triplat-ds-core id="addedRoomsDSCore" context="/triOutlookRoomReservation/-1/allReservableRooms" type="GET"></triplat-ds-core>

					<triplat-query data="[[_addedRoomsWithFavorites]]" filtered-data-out="{{addedRooms}}">
						<triplat-query-sort name="name"></triplat-query-sort>
					</triplat-query>

					<triplat-ds id="reservableRoomsDS" name="reservableRooms" data="{{_reservableRooms}}" loading="{{_loadingReservableRooms}}" force-server-filtering reserve-include-unavailable manual>
						<triplat-query delay="0">
							<triplat-query-reserve-context start-date="[[_startDate]]" end-date="[[_endDate]]" recurrence="[[_recurrence]]" recurrence-availability-percentage="[[_recurrenceAvailabilityPercentage]]"></triplat-query-reserve-context>
							<triplat-query-filter id="reservableRoomsDSIdFilter" name="systemRecordID" operator="in" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-open-paren></triplat-query-open-paren>
								<triplat-query-filter id="reservableRoomsDSCityFilter" name="citySystemRecordID" operator="equals" ignore-if-blank></triplat-query-filter>
								<triplat-query-or></triplat-query-or>
								<triplat-query-filter id="reservableRoomsDSPropertiesFilter" name="propertySystemRecordID" operator="in" ignore-if-blank></triplat-query-filter>
								<triplat-query-or></triplat-query-or>
								<triplat-query-filter id="reservableRoomsDSBuildingsFilter" name="buildingSystemRecordID" operator="in" ignore-if-blank></triplat-query-filter>
							<triplat-query-close-paren></triplat-query-close-paren>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter id="reservableRoomsDSRoomLayoutFilter" name="layoutType" operator="in" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter id="reservableRoomsDSCateringFilter" name="cateringAvailable" operator="equals" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter id="reservableRoomsDSAdaFilter" name="adaAvailable" operator="equals" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter id="reservableRoomsDSProjectorFilter" name="inRoomProjector" operator="equals" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter id="reservableRoomsDSTelephoneFilter" name="telephoneConference" operator="equals" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter id="reservableRoomsDSWhiteboardFilter" name="whiteboard" operator="equals" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter id="reservableRoomsDSVideoConferenceFilter" name="videoConferenceRoom" operator="equals" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter id="reservableRoomsDSNetworkConnectionFilter" name="networkConnection" operator="equals" ignore-if-blank></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter name="capacity" operator="greater than or equals" value="[[_roomCapacity]]" ignore-if-blank></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-query data="[[_definitiveReservableRooms]]" filtered-data-out="{{reservableRooms}}">
						<triplat-query-filter name="isFavorite" operator="equals" value="[[onlyFavoritesFilter]]" ignore-if-blank></triplat-query-filter>
						<triplat-query-and></triplat-query-and>
						<triplat-query-filter name="isUnavailable" operator="equals" value="[[unavailableFilter]]" ignore-if-blank></triplat-query-filter>
						<triplat-query-sort name="property"></triplat-query-sort>
						<triplat-query-sort name="building"></triplat-query-sort>
						<triplat-query-sort name="floorLevel"></triplat-query-sort>
						<triplat-query-sort name="isUnavailable"></triplat-query-sort>
						<triplat-query-sort name="name"></triplat-query-sort>
					</triplat-query>

					<triplat-ds id="spaceLabelStylesDS" name="spaceLabelStyles" data="{{spaceLabelStyles}}" force-server-filtering loading="{{_loadingGraphicLabelStyles}}" manual>
						<triplat-query>
							<triplat-query-filter name="id" operator="equals" value="triSpaceClass002"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-duration id="duration" hidden></triplat-duration>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			roomsHierarchy: {
				type: Array,
				notify: true
			},

			roomsCount: {
				type: Number,
				value: 0,
				notify: true
			},

			onlyFavoritesFilter: {
				type: String,
				value: "",
				notify: true
			},

			unavailableFilter: {
				type: Number,
				value: 0,
				notify: true
			},

			reservableRooms: {
				type: Array,
				notify: true
			},

			addedRooms: {
				type: Array,
				notify: true
			},

			spaceLabelStyles: {
				type: String,
				notify: true
			},

			searchHasFavoriteRooms: {
				type: Boolean,
				value: false,
				notify: true
			},

			hasUnavailableRooms: {
				type: Boolean,
				value: false,
				notify: true
			},

			_reservableRooms: {
				type: Array
			},

			_reservableRoomsWithAvailability: {
				type: Array
			},

			_definitiveReservableRooms: {
				type: Array
			},

			_addedRooms: {
				type: Array,
				value: () => []
			},

			_addedRoomsWithFavorites: {
				type: Array
			},

			_loadingAddedRoomsDSCore: {
				type: Boolean
			},

			_loadingReservableRooms: {
				type: Boolean
			},

			_loadingGraphicLabelStyles: {
				type: Boolean,
				value: false
			},

			_resultsRouteActive: {
				type: Boolean
			},

			_isApplicationSettingsReady: {
				type: Boolean
			},

			_favoriteRooms: {
				type: Array
			},

			_defaultFiltersLoaded: {
				type: Boolean
			},

			_allFilters: {
				type: Array
			},

			_locationFilter: {
				type: Array
			},

			_startDate: {
				type: String
			},

			_endDate: {
				type: String
			},

			_recurrence: {
				type: Object
			},

			_recurrenceAvailabilityPercentage: {
				type: Number
			},

			_isRecurring: {
				type: Boolean
			},

			_recurrenceEndDate: {
				type: String
			},

			_cityFilter: {
				type: String
			},

			_propertyFilter: {
				type: Array
			},

			_buildingFilter: {
				type: Array
			},

			_roomCapacity: {
				type: Number
			},

			/**
			 * Flag to indicate when reservableRoomsDS needs to refresh.
			 */
			_needsToRefresh: {
				type: Boolean,
				value: false
			},

			_layoutFilter: {
				type: Array
			},

			_amenitiesFilter: {
				type: Array
			},

			_filteringReservableRooms: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingAddedRoomsDSCore, _loadingReservableRooms, _loadingGraphicLabelStyles, _filteringReservableRooms)",
			"_setAddedRoomsWithFavorites(_addedRooms.*)",
			"_setNeedsToRefresh(_isApplicationSettingsReady, _favoriteRooms, _startDate, _endDate, _recurrence, _defaultFiltersLoaded, _locationFilter.*, _roomCapacity, _layoutFilter.*, _amenitiesFilter.*)",
			"_handleLocationFilterChange(_locationFilter.*)",
			"_refreshReservableRooms(_resultsRouteActive, _needsToRefresh)",
			"_setReservableRoomsAvailability(_reservableRooms.*)",
			"_setDefinitiveReservableRooms(_reservableRoomsWithAvailability.*, _addedRooms.*)",
			"_createRoomsHierarchy(reservableRooms)",
			"_setRoomsCount(reservableRooms)",
			"_setHasUnavailableRooms(_definitiveReservableRooms.*)",
			"_setSearchHasFavoriteRooms(reservableRooms.*)"
		];
	}

	async refreshAddedRoomsFromEmailList(emailList) {
		if (this._isRootInstance) {
			if (!isEmptyArray(emailList)) {
				this._loadingAddedRoomsDSCore = true;

				let query = {
					page: {
						from: 0,
						size: emailList.length
					},
					filters: []
				}
				for (let i = 0; i < emailList.length; i++) {
					query.filters.push({operator: "starts with", name: "exchangeMailbox", value: emailList[i]});
					if (i < emailList.length - 1) query.filters.push({operator: "or"});
				}

				const addedRoomsDSCore = this.shadowRoot.querySelector("#addedRoomsDSCore");
				addedRoomsDSCore.query = query;
				try {
					await getTriserviceFavoriteRooms().getFavoriteRooms();
					const response = await addedRoomsDSCore.generateRequest();
					const addedRooms = this._getRoomsWithFavoriteData(response.data);
					this._addedRooms = [...addedRooms];
				} catch (error) {
					this._addedRooms = [];
					throw error;
				} finally {
					this._loadingAddedRoomsDSCore = false;
				}
			} else {
				this._addedRooms = [];
			}
		} else {
			return this._rootInstance.refreshAddedRoomsFromEmailList(emailList);
		}
	}

	getAddedRoomsWithoutFavoriteData() {
		if (this._isRootInstance) {
			return this._addedRooms;
		} else {
			this._rootInstance.getAddedRoomsWithoutFavoriteData();
		}
	}

	addRoomToAddedRooms(room) {
		if (this._isRootInstance) {
			this.push("_addedRooms", room);
		} else {
			this._rootInstance.addRoomToAddedRooms(room);
		}
	}

	removeRoomFromAddedRooms(room) {
		if (this._isRootInstance) {
			const roomIndex = this._addedRooms.findIndex(addedRoom => addedRoom._id === room._id);
			if (roomIndex > -1) this.splice("_addedRooms", roomIndex, 1);
		} else {
			this._rootInstance.removeRoomFromAddedRooms(room);
		}
	}

	async _setAddedRoomsWithFavorites(addedRoomsChange) {
		if (this._isRootInstance) {
			await getTriserviceFavoriteRooms().getFavoriteRooms();
			let addedRooms = this._getRoomsWithFavoriteData(addedRoomsChange.base);
			this._addedRoomsWithFavorites = [...addedRooms];
		}
	}

	_getRoomsWithFavoriteData(rooms) {
		if (this._isRootInstance) {
			if (!rooms) return [];

			const favoriteRooms = (!this._favoriteRooms) ? [] : this._favoriteRooms;
			for (let i = 0; i < rooms.length; i++) {
				let roomIndex = favoriteRooms.findIndex(room => room._id === rooms[i]._id);
				rooms[i].isFavorite = roomIndex > -1;
			}
			return rooms;
		}
	}

	_setNeedsToRefresh() {
		if (this._isRootInstance) {
			this._debounceSetNeedsToRefresh = Debouncer.debounce(
				this._debounceSetNeedsToRefresh,
				timeOut.after(300),
				() => {
					if (this._isApplicationSettingsReady && this._defaultFiltersLoaded && 
						(!isEmptyArray(this._locationFilter) || (isEmptyArray(this._locationFilter) && !isEmptyArray(this._favoriteRooms)))) {
						this._needsToRefresh = true;
					} else {
						this._needsToRefresh = false;
						this._resetRoomHierarchyData();
					}
				}
			);
		}
	}

	_handleLocationFilterChange() {
		if (this._isRootInstance) {
			this._debounceHandleLocationFilterChange = Debouncer.debounce(
				this._debounceHandleLocationFilterChange,
				microTask,
				() => {
					let cityFilter = this._locationFilter.filter(locationFilter => locationFilter.type == "City");
					this._cityFilter = !isEmptyArray(cityFilter) ? cityFilter[0] : {};
					this._propertyFilter = this._locationFilter.filter(locationFilter => locationFilter.type == "Property");
					this._buildingFilter = this._locationFilter.filter(locationFilter => locationFilter.type == "Building");
				}
			);
		}
	}

	_resetRoomHierarchyData() {
		if (this._isRootInstance) {
			this._reservableRooms = null;
			this.roomsHierarchy = null;
		}
	}

	async _refreshReservableRooms(resultsRouteActive, needsToRefresh) {
		if (this._isRootInstance) {
			if (resultsRouteActive && needsToRefresh) {
				await this._setReservableRoomsDSArrayFilters();
				return this.shadowRoot.querySelector("#reservableRoomsDS").refresh()
					.then(() => {
						this._needsToRefresh = false;
						this._returnDataFromResponse();
					});
			}
		}
	}

	_setReservableRoomsDSArrayFilters() {
		return new Promise((resolve) => {
			let favoriteFilterById = [];
			if (isEmptyArray(this._locationFilter)) this._favoriteRooms.forEach(favorite => { favoriteFilterById.push(favorite._id); });

			let cityFilterById = (this._cityFilter && this._cityFilter._id) ? this._cityFilter._id : "";
			let propertyFilterById = [];
			this._propertyFilter.forEach(property => { propertyFilterById.push(property._id); });
			let buildingFilterById = [];
			this._buildingFilter.forEach(building => { buildingFilterById.push(building._id) });
			let layoutFilterByInternalValue = [];
			if (!isEmptyArray(this._locationFilter)) this._layoutFilter.forEach(layout => { layoutFilterByInternalValue.push(layout.internalValue) });

			this.shadowRoot.querySelector("#reservableRoomsDSIdFilter").value = favoriteFilterById;
			this.shadowRoot.querySelector("#reservableRoomsDSCityFilter").value = cityFilterById;
			this.shadowRoot.querySelector("#reservableRoomsDSPropertiesFilter").value = propertyFilterById;
			this.shadowRoot.querySelector("#reservableRoomsDSBuildingsFilter").value = buildingFilterById;
			this.shadowRoot.querySelector("#reservableRoomsDSRoomLayoutFilter").value = layoutFilterByInternalValue;
			this.shadowRoot.querySelector("#reservableRoomsDSCateringFilter").value = this._hasAmenityFilter("catering");
			this.shadowRoot.querySelector("#reservableRoomsDSAdaFilter").value = this._hasAmenityFilter("accessibility");
			this.shadowRoot.querySelector("#reservableRoomsDSProjectorFilter").value = this._hasAmenityFilter("projector");
			this.shadowRoot.querySelector("#reservableRoomsDSTelephoneFilter").value = this._hasAmenityFilter("phone");
			this.shadowRoot.querySelector("#reservableRoomsDSWhiteboardFilter").value = this._hasAmenityFilter("whiteboard");
			this.shadowRoot.querySelector("#reservableRoomsDSVideoConferenceFilter").value = this._hasAmenityFilter("tvscreen");
			this.shadowRoot.querySelector("#reservableRoomsDSNetworkConnectionFilter").value = this._hasAmenityFilter("networkConnection");
			setTimeout(resolve, 100);
		});
	}

	_hasAmenityFilter(amenity) {
		const amenityIndex = this._amenitiesFilter.findIndex(filter => filter.amenity === amenity);
		return amenityIndex > -1 && !isEmptyArray(this._locationFilter) ? "Yes" : "";
	}

	// Set available rooms with availability based on advance limit, cut-off, and availCount.
	async _setReservableRoomsAvailability(reservableRoomsChange) {
		if (this._isRootInstance) {
			const reservableRooms = reservableRoomsChange.base;
			if (!isEmptyArray(reservableRooms)) {
				await getTriserviceFavoriteRooms().getFavoriteRooms();
				const reservableRoomsWithFavorites = this._getRoomsWithFavoriteData(reservableRooms);
				const reservableRoomsWithAvailability = await this._getReservableRoomsAvailability(reservableRoomsWithFavorites);
				this._reservableRoomsWithAvailability = reservableRoomsWithAvailability;
			} else {
				this._reservableRoomsWithAvailability = null;
			}
		}
	}

	async _getReservableRoomsAvailability(reservableRooms) {
		if (this._isRootInstance) {
			try {
				this._filteringReservableRooms = true;
				await dateUtilitiesImport;
				const durationComp = this.shadowRoot.querySelector("#duration");
				const currentTime = new Date();
				let allReservableRooms = !isEmptyArray(reservableRooms) ? reservableRooms : [];

				if (durationComp && !isEmptyArray(allReservableRooms)) {
					durationComp.displayTokens = "y:M:w:d:h:m:s";
					allReservableRooms.forEach(room => {
						durationComp.value = room.reserveAdvanceLimit;
						const calculatedStartDateTime = durationComp.getCalculatedEndDateTime(currentTime);
						durationComp.value = room.reserveCutOffDuration;
						const calculatedEndDateTime = durationComp.getCalculatedEndDateTime(currentTime);

						const isStartDateBeforeAdvanceLimit = (room.reserveAdvanceLimit === 0) ? false : this._isStartDateBeforeAdvanceLimit(calculatedStartDateTime);
						const isEndDateAfterCutOffDuration = (room.reserveCutOffDuration === 0) ? false : this._isEndDateAfterCutOffDuration(calculatedEndDateTime);
						const noRecurrenceEndDateWithCutOff = this._isRecurring && this._recurrenceEndDate === "" && room.reserveCutOffDuration > 0;

						const isUnavailable = isStartDateBeforeAdvanceLimit || isEndDateAfterCutOffDuration || noRecurrenceEndDateWithCutOff;
						const isRoomUnavailable = isUnavailable || 
							(!this._isRecurring && room._availCount === 0) || 
							(this._isRecurring && room._availCount/room._maxOccurrenceCount * 100 < this._recurrenceAvailabilityPercentage);
						room.isUnavailable = isRoomUnavailable;
					});
				}

				return [...allReservableRooms];
			} finally {
				this._filteringReservableRooms = false;
			}
		}
	}

	_isStartDateBeforeAdvanceLimit(calculatedStartDateTime) {
		const startDateMo = moment(this._startDate);
		const calculatedStartDateTimeMo = moment(calculatedStartDateTime);
		return startDateMo.isBefore(calculatedStartDateTimeMo, "second");
	}

	_isEndDateAfterCutOffDuration(calculatedEndDateTime) {
		const endDateMo = this._isRecurring ? moment(this._recurrenceEndDate) : moment(this._endDate);
		const calculatedEndDateTimeMo = moment(calculatedEndDateTime);
		return endDateMo.isAfter(calculatedEndDateTimeMo, "second");
	}

	// Set the definitive available rooms array removing the added roooms.
	_setDefinitiveReservableRooms(reservableRoomsWithAvailabilityChange, addedRoomsChange) {
		if (this._isRootInstance) {
			const reservableRooms = !isEmptyArray(reservableRoomsWithAvailabilityChange.base) ? [...reservableRoomsWithAvailabilityChange.base] : [];
			const addedRooms = !isEmptyArray(addedRoomsChange.base) ? addedRoomsChange.base : [];
			if (!isEmptyArray(reservableRooms)) {
				for (let i = addedRooms.length; i > 0; i--) {
					let roomIndex = reservableRooms.findIndex(room => room._id === addedRooms[i - 1]._id);
					if (roomIndex > -1) reservableRooms.splice(roomIndex, 1);
				}
				this._definitiveReservableRooms = reservableRooms;
			} else {
				this._definitiveReservableRooms = null;
			}
		}
	}

	_createRoomsHierarchy(reservableRooms) {
		if (this._isRootInstance) {
			let roomsHierarchy = [];
			const rooms = !isEmptyArray(reservableRooms) ? reservableRooms : [];
			for (let i = 0; i < rooms.length; i++) {
				let hasParentCity = rooms[i].citySystemRecordID && rooms[i].citySystemRecordID !== "";
				let hasParentProperty = rooms[i].propertySystemRecordID && rooms[i].propertySystemRecordID !== "";
				let parentId = (hasParentCity ? rooms[i].citySystemRecordID : "") +
								(hasParentCity && hasParentProperty ? " - " : "") +
								(hasParentProperty ? rooms[i].propertySystemRecordID : "");
				let indexParent = roomsHierarchy.findIndex(e => e.parentId == parentId);
				if (indexParent == -1) {
					let parentName = (hasParentCity ? rooms[i].city : "") +
								(hasParentCity && hasParentProperty ? " - " : "") +
								(hasParentProperty ? rooms[i].property : "");

					let parent = {
						parentName: parentName,
						parentId: parentId,
						isFavorite: rooms[i].isFavorite,
						isUnavailable: rooms[i].isUnavailable,
						buildingsFloors: [ this._setBuildingFloorObj(rooms[i]) ]
					};
					roomsHierarchy.push(parent);
				} else {
					let indexBuildingFloor = roomsHierarchy[indexParent].buildingsFloors.findIndex(e => e.buildingFloorId == rooms[i].buildingSystemRecordID + " - " + rooms[i].floorSystemRecordID);
					if (indexBuildingFloor == -1) {
						let buildingFloor = this._setBuildingFloorObj(rooms[i])
						roomsHierarchy[indexParent].buildingsFloors.push(buildingFloor);
					} else {
						let indexRoom = roomsHierarchy[indexParent].buildingsFloors[indexBuildingFloor].rooms.findIndex(e => e._id == rooms[i]._id);
						if (indexRoom == -1) {
							roomsHierarchy[indexParent].buildingsFloors[indexBuildingFloor].rooms.push(rooms[i]);
						}
						if (rooms[i].isFavorite) {
							roomsHierarchy[indexParent].isFavorite = true;
							roomsHierarchy[indexParent].buildingsFloors[indexBuildingFloor].isFavorite = true;
						}
						if (!rooms[i].isUnavailable) {
							roomsHierarchy[indexParent].isUnavailable = false;
							roomsHierarchy[indexParent].buildingsFloors[indexBuildingFloor].isUnavailable = false;
						}
					}
				}
			}
			this.roomsHierarchy = [...roomsHierarchy];
		}
	}

	_setBuildingFloorObj(room) {
		return {
			building: room.building,
			floor: room.floor,
			floorLevel: room.floorLevel,
			buildingFloorId: room.buildingSystemRecordID + " - " + room.floorSystemRecordID,
			isFavorite: room.isFavorite,
			isUnavailable: room.isUnavailable,
			rooms: [ room ]
		};
	}

	_setRoomsCount(reservableRooms) {
		if (this._isRootInstance) {
			this.roomsCount = !isEmptyArray(reservableRooms) ? reservableRooms.length : 0;
		}
	}

	setRoomFavoriteValue(room, value) {
		if (this._isRootInstance) {
			// Get room index from reservableRooms.
			const roomIndex = (this._definitiveReservableRooms) ? this._definitiveReservableRooms.findIndex(reservableRoom => reservableRoom._id === room._id) : -1;
			// Get room index from addedRooms.
			const baseAddedRoomIndex = this._addedRoomsWithFavorites.findIndex(addedRoom => addedRoom._id === room._id);
			const addedRoomIndex = this.addedRooms.findIndex(addedRoom => addedRoom._id === room._id);
			// Get room index from roomsHierarchy.
			let hierarchyIndex, hierarchyBuildingFloorIndex, hierarchyRoomIndex;
			const roomsHierarchy = this.roomsHierarchy ? this.roomsHierarchy : [];
			for (let x = 0; x < roomsHierarchy.length; x++) {
				let buildingsFloors = roomsHierarchy[x].buildingsFloors;
				for (let y = 0; y < buildingsFloors.length; y++) {
					let rooms = buildingsFloors[y].rooms;

					let index = rooms.findIndex(currentRoom => currentRoom._id === room._id);
					if (index > -1) {
						hierarchyIndex = x;
						hierarchyBuildingFloorIndex = y;
						hierarchyRoomIndex = index;
						break;
					}
				}
			}

			// Set favorite for addedRooms.
			if (baseAddedRoomIndex > -1) {
				this.set(`_addedRoomsWithFavorites.${addedRoomIndex}.isFavorite`, value);
				this.notifyPath(`_addedRoomsWithFavorites.${addedRoomIndex}.isFavorite`, value);
			}
			if (addedRoomIndex > -1) {
				this.set(`addedRooms.${addedRoomIndex}.isFavorite`, value);
				this.notifyPath(`addedRooms.${addedRoomIndex}.isFavorite`, value);
			}
			if (!isEmptyArray(this._allFilters)) {
				// Set favorite for reservableRooms.
				if (roomIndex > -1) this.set(`_definitiveReservableRooms.${roomIndex}.isFavorite`, value);
				// Set favorite for roomsHierarchy.
				this.set(`roomsHierarchy.${hierarchyIndex}.buildingsFloors.${hierarchyBuildingFloorIndex}.rooms.${hierarchyRoomIndex}.isFavorite`, value);
				this.notifyPath(`roomsHierarchy.${hierarchyIndex}.buildingsFloors.${hierarchyBuildingFloorIndex}.rooms.${hierarchyRoomIndex}.isFavorite`, value);
			} else {
				// Remove room from favorite rooms.
				if (roomIndex > -1) this.splice("_definitiveReservableRooms", roomIndex, 1);
			}
		} else {
			this._rootInstance.setRoomFavoriteValue(room, value);
		}
	}

	_setHasUnavailableRooms(definitiveReservableRoomsChange) {
		if (this._isRootInstance) {
			const reservableRooms = definitiveReservableRoomsChange.base;
			if (!isEmptyArray(reservableRooms)) {
				let unavailableCount = 0;
				for (let i = 0; i < reservableRooms.length; i++) {
					if (reservableRooms[i].isUnavailable) unavailableCount++;
				}
				this.hasUnavailableRooms = unavailableCount > 0;
			} else {
				this.hasUnavailableRooms = false;
			}
		}
	}

	_setSearchHasFavoriteRooms(reservableRoomsChange) {
		if (this._isRootInstance) {
			const reservableRooms = reservableRoomsChange.base;
			if (!isEmptyArray(reservableRooms)) {
				let favoritesCount = 0;
				for (let i = 0; i < reservableRooms.length; i++) {
					if (reservableRooms[i].isFavorite) favoritesCount++;
				}
				this.searchHasFavoriteRooms = favoritesCount > 0;
			} else {
				this.searchHasFavoriteRooms = false;
				this.onlyFavoritesFilter = "";
			}
		}
	}

	getSpaceLabelStyles() {
		if (this._isRootInstance) {
			if (!this.spaceLabelStyles) {
				return this.shadowRoot.querySelector("#spaceLabelStylesDS").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.spaceLabelStyles);
			}
		}
		else {
			return this._rootInstance.getSpaceLabelStyles();
		}
	}

	saveBuildingRoomsDataToLocal(cityId, buildingId, propertyId) {
		if (this._isRootInstance) {
			if (buildingId) {
				const buildingRooms = this.reservableRooms.filter(room => room.buildingSystemRecordID === buildingId);
				const floorsKVL = buildingRooms.reduce((floors, room) => { 
					floors[room.floorSystemRecordID] = floors[room.floorSystemRecordID] || [];
					floors[room.floorSystemRecordID].push(room);
					return floors;
				}, {});

				const filteredFloors = [];
				for (let prop in floorsKVL) {
					filteredFloors.push(
					{	
						id: prop,
						floor: floorsKVL[prop][0].floor,
						floorLevel: floorsKVL[prop][0].floorLevel,
						rooms: floorsKVL[prop]
					});
				}
				const buildingData = {
					buildingId,
					building: buildingRooms[0].building,
					city: buildingRooms[0].city,
					property: buildingRooms[0].property,
					floors: filteredFloors
				};
				saveDataToLocal(buildingData, 'buildingData');
			}
		} else {
			return this._rootInstance.saveBuildingRoomsDataToLocal(cityId, buildingId, propertyId);
		}
	}

	getBuildingRoomsDataFromLocal() {
		if (this._isRootInstance) {
			return getDataFromLocal('buildingData');
		} else {
			return this._rootInstance.getBuildingRoomsDataFromLocal();
		}
	}

	saveAddedRoomsDataToLocal() {
		if (this._isRootInstance) {
			saveDataToLocal(this.addedRooms, 'addedRooms');
		} else {
			return this._rootInstance.saveAddedRoomsDataToLocal();
		}
	}

	getAddedRoomsDataFromLocal() {
		if (this._isRootInstance) {
			return getDataFromLocal('addedRooms');
		} else {
			return this._rootInstance.getAddedRoomsDataFromLocal();
		}
	}
};

window.customElements.define(TriserviceRoomsSearch.is, TriserviceRoomsSearch);