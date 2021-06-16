/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import { TriPlatGraphicUtilitiesBehavior } from "../triplat-graphic/triplat-graphic-utilities-behavior.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";
import "../triapp-task-list/triservice-work-task-base.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triplat-ds id="locationsListDS" name="locations" data="{{locations}}" force-server-filtering="" manual="">
				<triplat-ds-offline mode="CONTEXT" cache-thumbnails="[[_toArray('picture')]]"></triplat-ds-offline>
				<triplat-ds-context id="locationsListDSContext" name="myTasks"></triplat-ds-context>
			</triplat-ds>

			<triplat-ds id="primaryLocationDS" name="primaryLocation" manual="">
				<triplat-ds-offline mode="CONTEXT" cache-thumbnails="[[_toArray('picture')]]"></triplat-ds-offline>
				<triplat-ds-context id="primaryLocationDSContext" name="myTasks"></triplat-ds-context>
			</triplat-ds>

			<triplat-ds id="myTasksPrimaryLocationsDS" name="myTasksPrimaryLocations" manual="">
			</triplat-ds>

			<triplat-ds id="myTasksRequestedLocationsDS" name="myTasksRequestedLocations" manual="">
			</triplat-ds>
		</template>
	`,

    is: "triservice-location",

    behaviors: [
		TriPlatGraphicUtilitiesBehavior,
		TriPlatViewBehavior,
		TriTaskServiceBehavior
	],

    properties: {
		online: {
			type: Boolean
		},

		loadingLocations: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingPrimaryLocation: {
			type: Boolean,
			value: false,
			notify: true
		},

		locations: {
			type: Array,
			notify: true
		},

		locationsWithPrimary: {
			type: Array,
			notify: true
		},

		primaryLocation: {
			type: Object,
			notify: true
		}
	},

    _addPrimaryLocationToLocations: function() {
		var locations = [];
		var promises = [];

		if (this.primaryLocation && this.primaryLocation._id) {
			locations[0] = this.primaryLocation;
		}

		if (this.locations && this.locations.length > 0) {
			for (var i = 0; i < this.locations.length; i++) {
				if (!this.primaryLocation || this.locations[i]._id !== this.primaryLocation._id) {
					locations.push(this.locations[i]);
				}
			}
		}

		for (var aux = 0; aux < locations.length; aux++) {
			if (!locations[aux].isPrimary) {
				promises.push(this._checkIfLocationHasGraphic(locations[aux]));
			}
		}

		return Promise.all(promises).then(function() {
			this.set("locationsWithPrimary", locations);
		}.bind(this));
	},

    _checkIfLocationHasGraphic: function(location) {
		if (!this.online) {
			location.hasGraphic = false;
			location.drawingId = null;
			return Promise.resolve();
		}
		var recordId = "";
		if (location.typeENUS == "Floor") {
			recordId = location._id;
		} else if (location.typeENUS == "Space") {
			recordId = location.parentFloorId;
		} else {
			location.hasGraphic = false;
			location.drawingId = null;
			return Promise.resolve();
		}
		
		return this.getDrawingId(recordId).then(function(result) {
			location.hasGraphic = (result) ? true : false;
			location.drawingId = result;
		}.bind(this));
	},

    refreshTaskPrimaryLocation: function (taskId) {
		var primaryLocationDSContext = this.$$("#primaryLocationDSContext");
		
		if (this.primaryLocation == null || primaryLocationDSContext.contextId != taskId) {
			this.loadingPrimaryLocation = true;

			primaryLocationDSContext.contextId = taskId;
			return this.$$("#primaryLocationDS").refresh()
				.then(function() {
					var promise = Promise.resolve();
					var primaryLocation = this.$$("#primaryLocationDS").data;

					if (primaryLocation && primaryLocation._id) {
						primaryLocation.isPrimary = true;
						promise = this._checkIfLocationHasGraphic(primaryLocation);
					}

					return promise.then(function() {
						this.set("primaryLocation", primaryLocation);
						this.loadingPrimaryLocation = false;
					}.bind(this));
				}.bind(this))
				.catch(function(error) {
					this.loadingPrimaryLocation = false;
					return Promise.reject(error);
				}.bind(this));
		} else {
			return Promise.resolve(this.primaryLocation);
		}
	},

    refreshTaskLocations: function (taskId, force) {
		if (this._isRootInstance) {
			var locationsListDSContext = this.$$("#locationsListDSContext");
			if (force || this.locations == null || locationsListDSContext.contextId != taskId) {
				this.loadingLocations = true;

				locationsListDSContext.contextId = taskId;
				return this.$$("#locationsListDS").refresh()
					.then(this.refreshTaskPrimaryLocation.bind(this, taskId))
					.then(this._addPrimaryLocationToLocations.bind(this))
					.then(function() {
						this.loadingLocations = false;
						return this.locations;
					}.bind(this))
					.catch(function(error) {
						this.loadingLocations = false;
						return Promise.reject(error);
					}.bind(this));
			} else {
				return Promise.resolve(this.locations);
			}
		} else {
			return this._rootInstance.refreshTaskLocations(taskId, force);
		}
	},

    refreshMyTasksBuildings: function() {
		if (this._isRootInstance) {
			var myTasksLocations = [];
			return this._refreshMyTasksPrimarylocations(myTasksLocations)
				.then(this._refreshMyTasksRequestedlocations.bind(this, myTasksLocations))
				.then(this._buildMyTasksBuildingsList.bind(this, myTasksLocations))
		} else {
			return this._rootInstance.refreshMyTasksBuildings();
		}
	},

    _refreshMyTasksPrimarylocations: function(myTasksLocations) {
		return this.$$("#myTasksPrimaryLocationsDS").refresh().then(function(response) {
			var primarylocations = this._returnDataFromResponse(response);
			if (primarylocations != null && primarylocations.length > 0) {
				myTasksLocations.push.apply(myTasksLocations, primarylocations);
			}
			return primarylocations;
		}.bind(this));
	},

    _refreshMyTasksRequestedlocations: function(myTasksLocations) {
		return this.$$("#myTasksRequestedLocationsDS").refresh().then(function(response) {
			var requestedLocations = this._returnDataFromResponse(response);
			if (requestedLocations != null && requestedLocations.length > 0) {
				myTasksLocations.push.apply(myTasksLocations, requestedLocations);
			}
			return requestedLocations;
		}.bind(this));
	},

    _buildMyTasksBuildingsList: function(myTasksLocations) {
		var buildingsMap = {};
		for (var i = 0; i < myTasksLocations.length; i++) {
			var building = this._createBuildingObjectFromLocation(myTasksLocations[i]);
			if (building._id && !buildingsMap[building._id]) {
				buildingsMap[building._id] = building;
			}
		}
		var buildings = [];
		for (let buildingId in buildingsMap) {
			buildings.push(buildingsMap[buildingId]);
		}
		return buildings;
	},

    _createBuildingObjectFromLocation: function(location) {
		var building = {};
		if (location.typeENUS == "Building") {
			building._id = location._id;
			building.address = location.address;
			building.building = location.name;
			building.buildingId = location.ID;
			building.city = location.city;
			building.country = location.country;
			building.path = location.hierarchyPath;
			building.latitude = location.latitude;
			building.longitude = location.longitude;
			building.picture = location.picture;
			building.property = location.property;
			building.stateProvince = location.stateProvince;
		} else {
			building._id = location.parentBuildingRecordID;
			building.address = location.parentBuildingAddress;
			building.building = location.parentBuildingName;
			building.buildingId = location.parentBuildingID;
			building.city = location.parentBuildingCity;
			building.country = location.parentBuildingCountry;
			building.path = location.parentBuildingHierarchyPath;
			building.latitude = location.parentBuildingLatitude;
			building.longitude = location.parentBuildingLongitude;
			building.picture = location.parentBuildingPicture;
			building.property = location.parentBuildingProperty;
			building.stateProvince = location.parentBuildingStateProvince;
		}
		return building;
	}
});