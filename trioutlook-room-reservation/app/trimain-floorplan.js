/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../@polymer/polymer/lib/utils/render-status.js";
import "../../@polymer/iron-collapse/iron-collapse.js";
import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../@polymer/paper-icon-button/paper-icon-button.js";
import "../../triplat-icon/ibm-icons-glyphs.js";
import "../../triplat-routing/triplat-route.js";
import { TriDirBehavior } from "../../tricore-dir-behavior/tricore-dir-behavior.js";
import { TriPlatGraphicUtilitiesBehavior } from "../../triplat-graphic/triplat-graphic-utilities-behavior.js";
import "../components/floor-plan/tricomp-floor-plan.js";
import "../components/select-field/tricomp-select-field.js";
import "../components/room-card/tricomp-room-details-item.js";
import "../styles/tristyles-carbon-theme.js";
import "../services/triservice-favorite-rooms.js";
import "../services/triservice-rooms-search.js";
import { getTriserviceOutlook } from "../services/triservice-outlook.js";
import { isEmptyArray } from "../utils/triutils-utilities.js";
import { getDataFromLocal } from "../utils/triutils-localstorage.js";

class TrimainFloorplan extends mixinBehaviors([TriPlatGraphicUtilitiesBehavior, TriDirBehavior], PolymerElement) {
	static get is() { return "trimain-floorplan"; }

	static get template() {
		return html`
			<style include="carbon-style room-reservation-popup-styles">
				:host {
					@apply --layout-vertical;
					background-color: var(--carbon-ui-01);
				}

				.header {
					padding: 20px;
					background-color: var(--carbon-ui-02);
				}

				.content {
					@apply --layout-flex; 
					@apply --layout-vertical;
					padding: 20px;
				}

				tricomp-select-field {
					background-color: var(--carbon-ui-01);
				}

				.room-details-collapse {
					@apply(--layout-horizontal);
					position: absolute;
					right: 0;
					bottom: 0;
					left: 0;
					z-index: 2;
				}

			</style>

			<triservice-favorite-rooms></triservice-favorite-rooms>
			<triservice-rooms-search id="roomSearchService" space-label-styles="{{_spaceLabelStyles}}"></triservice-rooms-search>

			<triplat-route name="floorplan" on-route-active="_onRouteActive" active="{{_opened}}" params="{{_floorplanParams}}"></triplat-route>

			<paper-icon-button noink class="close" icon="ibm-glyphs:clear-input" alt="Close" on-tap="_handleClose"></paper-icon-button>
			<div class="header">
				<div class="productive-heading-03 bottom-8">[[_building]]</div>
				<div class="helper-text-01 bottom-8">[[_cityProperty]]</div>
				<tricomp-select-field label="Select a floor" items="[[_floors]]" readonly="[[_loading]]" selected="{{_selectedFloor}}"></tricomp-select-field>
			</div>
			<div class="content">
				<tricomp-floor-plan id="floorPlan" selectable selected="{{_selected}}"></tricomp-floor-plan>
			</div>

			<iron-collapse class="room-details-collapse" opened="[[_computeRoomDetailsOpened(_selected)]]">
				<tricomp-room-details-item selected="{{_selected}}" is-recurring="[[_isRecurring]]" added-rooms="[[_addedRooms]]"></tricomp-room-details-item>
			</iron-collapse>
		`;
	}

	static get properties() {
		return {
			_location: {
				type: Object,
				value: () => ({})
			},

			_floorplanParams: { 
				type: Object
			},
			
			_spaceLabelStyles: {
				type: Array
			},

			_opened: {
				type: Boolean
			},

			_floors: {
				type: Object
			},

			_selectedFloor: {
				type: String,
				observer: '_handleSelectedFloorChanged'
			},

			_building: {
				type: String
			},

			_cityProperty: {
				type: String
			},

			_loading: {
				type: Boolean,
				value: false
			},

			_selected: {
				type: Object
			},

			_addedRooms: {
				type: Array
			},

			_isRecurring: {
				type: Boolean
			}
		}
	}

	constructor() {
		super();
		this._handleAddListener = this._handleAdd.bind(this);
		this._handleRemoveListener = this._handleRemove.bind(this);
		this._handleFaveRoomChangedListener = this._handleFaveRoomChanged.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('add-room-tapped', this._handleAddListener);
		this.addEventListener('remove-room-tapped', this._handleRemoveListener);
		this.addEventListener('favorite-room-changed', this._handleFaveRoomChangedListener);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('add-room-tapped', this._handleAddListener);
		this.removeEventListener('remove-room-tapped', this._handleRemoveListener);
		this.removeEventListener('favorite-room-changed', this._handleFaveRoomChangedListener);
	}

	_onRouteActive(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				const roomSearchService = this.shadowRoot.querySelector("#roomSearchService");
				const buildingData = roomSearchService.getBuildingRoomsDataFromLocal();
				this.set("_addedRooms", roomSearchService.getAddedRoomsDataFromLocal());
				this.set('_isRecurring', getDataFromLocal('isRecurring'));
				this.set("_floors", buildingData.floors.map(floor => {
					return {
						id: floor.id,
						name: floor.floor,
						floorLevel: floor.floorLevel,
						availableRooms: floor.rooms.filter(room => !room.isUnavailable),
						unavailableRooms: floor.rooms.filter(room => room.isUnavailable)
					}
				}).sort((a, b) => a.floorLevel - b.floorLevel));

				this.set("_building", buildingData.building);
				this.set("_cityProperty", this._computeCityProperty(buildingData.city, buildingData.property));
				this.set("_selectedFloor", this._floorplanParams.floorId);
			});
		}
	}

	_handleClose(e) {
		e.stopPropagation();
		const messageObject = {messageType: "dialogClosed"};
		getTriserviceOutlook().messageParent(messageObject);
	}

	_handleSelectedFloorChanged(floorId) {
		if (floorId) {
			this._doGetDrawing(floorId);
		}
	}

	_doGetDrawing(floorId) {
		this._loading = true;
		return this.getDrawingId(floorId)
			.then(result => {
				this._loading = false;
				this._location.hasGraphic = (result) ? true : false;
				const floorPlan = this.shadowRoot.querySelector("#floorPlan");
				if (this._location.hasGraphic) {
					this._location.typeENUS = "Floor";
					floorPlan.addedRooms = !isEmptyArray(this._addedRooms) ? this._addedRooms.filter(room => room.floorSystemRecordID === floorId) : [];
					floorPlan.availableRooms = this._floors.filter(floor => floor.id === floorId)[0].availableRooms.filter(room => 
						floorPlan.addedRooms.findIndex(addedRoom => addedRoom._id === room._id) === -1
					);
					floorPlan.unavailableRooms = this._floors.filter(floor => floor.id === floorId)[0].unavailableRooms.filter(room => 
						floorPlan.addedRooms.findIndex(addedRoom => addedRoom._id === room._id) === -1
					);
					floorPlan.selectableRooms = [...floorPlan.availableRooms, ...floorPlan.unavailableRooms, ...floorPlan.addedRooms];
					floorPlan.location = this._location;
					floorPlan.showLegend = true;
					this._location.drawingId = result;
					const roomSearchService = this.shadowRoot.querySelector("#roomSearchService");
					afterNextRender(this, function() {
						roomSearchService.getSpaceLabelStyles()
							.then(() => {
								floorPlan.labelStyles = this._spaceLabelStyles;
							});
					});
				} else {
					this._location.typeENUS = "";
					floorPlan.availableRooms = [];
					floorPlan.unavailableRooms = [];
					floorPlan.addedRooms = [];
					floorPlan.selectableRooms = [];
					floorPlan.location = null;
					this._location.drawingId = null;
				}
				floorPlan.opened = this._opened;
		});
	}

	_computeRoomDetailsOpened(selected) {
		return selected && selected._id;
	}

	_handleAdd(e) {
		e.stopPropagation();
		const messageObject = {
			messageType: "dialogAction",
			message: "addRoom",
			room: this._selected
		};
		getTriserviceOutlook().messageParent(messageObject);
	}

	_handleRemove(e) {
		e.stopPropagation();
		const messageObject = {
			messageType: "dialogAction",
			message: "removeRoom",
			room: this._selected
		};
		getTriserviceOutlook().messageParent(messageObject);
	}

	_computeCityProperty(city, property) {
		return `${city ? city : ''}${city && property ? ' - ' : ''}${property ? property : ''}`;
	}

	_handleFaveRoomChanged(e) {
		e.stopPropagation();
		const messageObject = {
			messageType: "dialogAction",
			message: "favoriteToggled",
			room: this._selected,
			isFavorite: e.detail.isFavorite
		};
		getTriserviceOutlook().messageParent(messageObject);
	}
};

window.customElements.define(TrimainFloorplan.is, TrimainFloorplan);