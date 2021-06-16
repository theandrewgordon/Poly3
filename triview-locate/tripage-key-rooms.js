/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-graphic/triplat-graphic.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-zoom-slider/triplat-zoom-slider.js";
import "../triplat-graphic-legend/triplat-graphic-legend.js";
import "../triplat-icon/triplat-icon.js";
import "../triblock-search-popup/triblock-image-info-card.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "./tricomp-amenities-list.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="shared-locate-app-styles shared-graphic-styles tristyles-theme">


				:host {
					@apply --layout-vertical;
					position: relative;
					height: 100%;
				}

				.floor-graphic-container {
					@apply --layout-flex;
					@apply --layout-relative;
					@apply --layout-horizontal;
					margin: 5px;
					min-height: 0;
				}

				.floor-graphic {
					@apply --layout-flex;
					@apply --layout-vertical;

					user-select: none;
					cursor: default;
					--triplat-graphic-highlight-1: {
						fill: #41D6C3;
						fill-opacity: .8;
					}
					--triplat-graphic-interactive-selectable: {
						cursor: pointer;
					}
					--triplat-graphic-selectable: {
						fill: white;
						fill-opacity: 1;
					}
					--triplat-graphic-interactive-selected: {
						stroke: var(--tri-primary-dark-color);
						stroke-width: 10px;
					}
				}

				.page-main {
					@apply --layout-vertical;
					@apply --layout-flex;
					@apply --layout-center;
					background-color: var(--tri-primary-content-background-color);
					box-sizing: border-box; 
				}

				.page-wrap {
					@apply --layout-horizontal;
					@apply --layout-flex;
					width: 100%;
				}

				#graphicLegend {
					--triplat-graphic-legend-min-width: 200px;
					position: absolute;
					right: 0;
					top: 0;
					bottom: 0;
					opacity: .9;

					--triplat-graphic-legend-section-header : {
						display: none;
					};

					--triplat-graphic-legend-bar: {
						background-color: white;
						border-left-width: 1px;
						border-left-style: solid;
						border-top-width: 1px;
						border-top-style: solid;
						border-bottom-width: 1px;
						border-bottom-style: solid;
						border-color: rgb(174, 174, 174);
					};

					--triplat-graphic-legend-container: {
						border-left-color: white;
					};
				}

				#graphicLegendShowBy {
					--triplat-graphic-legend-show-all: {
						display: none;
					};
					--triplat-graphic-legend-radio: {
						display: none;
					};

					--legend-border-width: 0px;
				}

				.room-details-collapse {
					@apply --layout-horizontal;
					background-color: var(--ibm-neutral-2);
					border: 1px solid var(--ibm-gray-10);
				}

				.floor-plan-container {
					@apply --layout-vertical;
					@apply --layout-flex;
					position: relative;
				}

				#roomImage {
					margin-right: 50px;
					--triplat-image-placeholder-icon: {
						height: 100px;
						width: 100px;
					};
				}

				.room-detail-container {
					@apply --layout-vertical;
					flex: 1;
					padding: 10px 12px;
				}
				:host([small-screen-width]) .room-detail-container {
					padding: 10px;
				}

				.room-detail-header {
					@apply(--layout-horizontal);
				}

				.room-name {
					flex: 1;
					padding-bottom: 5px;
				}

				.room-detail-header triplat-icon {
					--triplat-icon-fill-color: var(--ibm-gray-50);
					--triplat-icon-stroke-color: var(--ibm-gray-50);
					--triplat-icon-iron-icon: {
						width: 20px;
						height: 20px;
					};
					cursor: pointer;
				}

				.room-detail-content {
					@apply --layout-horizontal;
					flex: 1
				}

				triblock-image-info-card {
					@apply --layout-horizontal;
					flex: 1;

					--triblock-image-info-card-image-container: {
						border-radius: 0;
						height: 60px;
						width: 60px;
					};
					--triblock-image-info-card-placeholder-icon: {
						height: 50px;
						width: 50px;
					};
					--triblock-image-info-card-detail-container: {
						@apply --layout-horizontal;
						@apply --layout-self-stretch;
						padding: 0 10px;
					};
				}

				triblock-image-info-card > ::slotted(#horizontal) {
					flex: 1;
				}

				.room-card-details {
					@apply --layout-horizontal;
					flex: 1;
					padding: 3px 0;
				}
				:host([small-screen-width]) .room-card-details {
					@apply --layout-vertical;
				}

				.room-card-info {
					flex: 1;
				}
				:host(:not([small-screen-width])) .room-card-info {
					padding-right: 10px;
				}

				.room-card-amenities {
					@apply --layout-horizontal;
					@apply --layout-center;
					flex: 1;
				}
				:host(:not([small-screen-width])) .room-card-amenities {
					border-left: 1px solid var(--ibm-gray-10);
					padding-left: 5px;
				}
				.min-max-icon {
					z-index: 2;
				}

				:host([small-screen-width][maximize]) {
					@apply --layout-fit;
					background-color: white;
					z-index: 1;
				}
			
		</style>

		<triplat-loading-indicator show="[[graphicLoading]]"></triplat-loading-indicator>

		<triplat-ds id="allSpaceLabelStyle" name="allSpaceLabelStyle" data="{{_spaceLabelStyles}}" force-server-filtering="" loading="{{_loadingGraphicLabels}}">
			<triplat-query>
				<triplat-query-filter name="ID" operator="equals" value="triSpaceClass002">
				</triplat-query-filter>
			</triplat-query>
		</triplat-ds>

		<triplat-ds id="roomTypes" name="roomTypes" data="{{roomTypes}}"></triplat-ds>

		<div class="page-main">
			<div class="page-wrap">
				<div class="floor-graphic-container" hidden\$="[[!_hasGraphic]]">
					<div class="floor-plan-container">
						<triplat-graphic id="floorplan" class="floor-graphic" has-graphic="{{_hasGraphic}}" svg-loaded="{{_svgLoaded}}">
							<triplat-graphic-highlight highlighted="[[_highlightSpace]]" slot="graphic-highlight"></triplat-graphic-highlight>
							<triplat-graphic-pin icon="[[pinName]]" pins="[[pinDetails]]" record-id-attr-name="spaceRecordId" slot="graphic-pin"></triplat-graphic-pin>
							<triplat-graphic-highlight-group legend-spaces="[[_legendSpaces]]" highlight-layer="ATTACHED" slot="graphic-highlight-group">
							</triplat-graphic-highlight-group>
							<triplat-graphic-label id="graphicLabel" label-id="[[_computeLabelId(_spaceLabelStyles.*)]]" slot="graphic-label">
							</triplat-graphic-label>
							<triplat-graphic-zoomable scale="{{_zoomScale}}" cached="" slot="graphic-zoomable"></triplat-graphic-zoomable>
							<triplat-graphic-selectable selectable="{{_selectableRoom}}" selected="{{_selectedRoom}}" slot="graphic-selectable">
							</triplat-graphic-selectable>
							<triplat-graphic-layer-manager turn-off="{{_layersToTurnOff}}" slot="graphic-layer-manager"></triplat-graphic-layer-manager>
						</triplat-graphic>

						<div class="graphic-footer-container">
							<triplat-zoom-slider class="slider" min="0.01" max="1.5" step="0.1" value="{{_zoomScale}}" hidden="{{_hideZoomSlider(_hasGraphic, smallScreenWidth)}}">
							</triplat-zoom-slider>
							<iron-collapse id="collapsableRoomDetail" class="room-details-collapse" opened="{{_computeRoomDetailsOpened(_selectedRoom)}}">
								<div class="room-detail-container">
									<div class="room-detail-header">
										<div class="room-name tri-h3">[[_selectedRoom.name]]</div>
										<triplat-icon icon="ibm-glyphs:clear-input" on-tap="_closeRoomDetails"></triplat-icon>
									</div>
									<div class="room-detail-content">
										<triblock-image-info-card data="[[_selectedRoom]]" placeholder-icon="ibm:spaces" image-width="[[_imageSize]]" image-height="[[_imageSize]]" image-align-top="">
											<div class="room-card-details">
												<div class="room-card-info">
													<template is="dom-if" if="[[!_roomTypeMeetingSpace]]">
														<div>[[_selectedRoom.id]]</div>
														<div>[[_selectedRoom.type]]</div>
													</template>

													<template is="dom-if" if="[[_roomTypeMeetingSpace]]">
														<div>Capacity: [[_selectedRoom.capacity]]</div>
														<div>[[_selectedRoom.floor]]</div>
														<div>[[_selectedRoom.building]]</div>
													</template>
												</div>

												<div class="room-card-amenities" hidden\$="[[!_hasAmenities]]">
													<tricomp-amenities-list class="amenities-list" catering="[[_isRoomServiceAvailable(_selectedRoom.isCateringAvailable)]]" disabled-access="[[_isRoomServiceAvailable(_selectedRoom.isADAAvailable)]]" network-connection="[[_isRoomServiceAvailable(_selectedRoom.isNetworkConnection)]]" phone-conference="[[_isRoomServiceAvailable(_selectedRoom.isConferencePhone)]]" projector="[[_isRoomServiceAvailable(_selectedRoom.isProjector)]]" video-conference="[[_isRoomServiceAvailable(_selectedRoom.isVideoConference)]]" whiteboard="[[_isRoomServiceAvailable(_selectedRoom.isWhiteboard)]]">
													</tricomp-amenities-list>
												</div>
											</div>
										</triblock-image-info-card>
									</div>
								</div>
							</iron-collapse>
						</div>

						<div class="min-max-icon" hidden\$="[[!smallScreenWidth]]">
							<paper-icon-button class="minMaxIcon" on-tap="_handleMinMaxIconTapped" icon="[[_computeMaximizeIcon(maximize)]]"></paper-icon-button>
						</div>
					
						
					</div>

					<triplat-graphic-legend id="graphicLegend" hidden\$="[[!_hasGraphic]]" spaces="[[keyRooms]]" legend-spaces="{{_legendSpaces}}" show-by-selected="[[_legendLabel.roomType]]" opened="">
						<triplat-graphic-legend-show-by id="graphicLegendShowBy" attribute="roomType" color-by="roomTypeColor" label="[[_legendLabel.roomType]]" opacity="1" readonly-criterion="" show-all-checked="" slot="graphic-legend-show-by">
						</triplat-graphic-legend-show-by>
					</triplat-graphic-legend>
				</div>

				<div class="page-main empty-placeholder" hidden\$="[[_hasGraphic]]">
					<div>Floor plan not available.</div>
				</div>
			</div>
		</div>
	`,

    is: "tripage-key-rooms",

    behaviors: [
		TriBlockViewResponsiveBehavior,
		IronResizableBehavior
	],

    properties: {
		floorRecordId: Object,

		maximize: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		opened: {
			type: Boolean,
			value: false
		},

		keyRooms: Array,

		_imageSize: {
			type: Number,
			value: 60
		},

		_roomTypeMeetingSpace: {
			type: Boolean,
			value: false,
			computed: "_computeRoomTypeMeetingSpace(_selectedRoom.typeData, _meetingRoom)"
		},

		_hasAmenities: {
			type: Boolean,
			value: false,
			computed: "_computeHasAmenities(_selectedRoom.isCateringAvailable, _selectedRoom.isADAAvailable, _selectedRoom.isNetworkConnection, _selectedRoom.isConferencePhone, _selectedRoom.isProjector, _selectedRoom.isVideoConference, _selectedRoom.isWhiteboard)"
		},

		_legendLabel: {
			type: Object,
			value: function() {
				var __dictionary__roomType = "Room Type";

				var _labels = {};
				_labels["roomType"] = __dictionary__roomType;

				return _labels;
			}
		},

		pinName: {
			type: String,
			value: "pin-person"
		},

		_hasGraphic: {
			type: Boolean,
			notify: true,
		},

		_svgLoaded: {
			type: Boolean
		},

		_layersToTurnOff: {
			type: Array,
			value() {
				return ['NAME']
			}
		}
	},

    observers: [
		'_getSelectableRoom(keyRooms)',
		'_setRoomPicture(_selectedRoom.image)',
		'_observeRoomTypes(roomTypes)',
		'_setHighlightSpace(pinDetails)',
		"_handleFloorRecordIdChange(floorRecordId, opened)",
		"_handleMaximizeChange(maximize, opened, _hasGraphic, _svgLoaded)"
	],

    _computeLabelId: function (change) {
		var labelId = null;
		if (change.base && change.base.length > 0) {
			return change.base[0]._id;
		}
		return labelId;
	},

    _hideZoomSlider: function(hasGraphic, smallScreenWidth){
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !smallScreenWidth ? !hasGraphic : true;
	},

    _computeRoomDetailsOpened: function(selectedRoom) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return selectedRoom != null && selectedRoom._id != null;
	},

    _getSelectableRoom: function(e){
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if(e instanceof Array && e.length > 0){
			this._selectableRoom = e.map(function(item){
				return {
					_id: item._id, 
					image: item.image, 
					name: item.room,
					id: item.id,
					type: item.roomType,
					typeData: item.roomTypeData,
					capacity: item.capacity,
					floor: item.floor.value,
					building: item.building.value,
					isCateringAvailable: item.isCateringAvailable,
					isADAAvailable: item.isADAAvailable,
					isNetworkConnection: item.isNetworkConnection,
					isConferencePhone: item.isConferencePhone,
					isProjector: item.isProjector,
					isVideoConference: item.isVideoConference,
					isWhiteboard: item.isWhiteboard
				};
			});
		}
	},

    _handleMinMaxIconTapped: function(){
		var isMaximize= !this.maximize;
		if(isMaximize){
			this.fire("maximize-key-rooms-floor-plan");
		}else {
			this.fire("minimize-key-rooms-floor-plan");
		}
	},

    _computeMaximizeIcon: function(maximize){
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return maximize ? "ibm-glyphs:minimize" : "ibm-glyphs:maximize";
	},

    _closeRoomDetails: function() {
		this.set("_selectedRoom", null);
	},

    _setRoomPicture: function(image) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.set("_selectedRoom.picture", image);
	},

    _observeRoomTypes: function(roomTypes) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (roomTypes && roomTypes.length > 0) {
			roomTypes.forEach(function(roomType) {
				if (roomType.internalValue == "Meeting Space") {
					this.set("_meetingRoom", roomType.internalValue);
				}
			}.bind(this));
		}
	},

    _computeRoomTypeMeetingSpace: function(roomType, meetingRoom) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (roomType && roomType.value == meetingRoom);
	},

    _computeHasAmenities: function(isCateringAvailable, isADAAvailable, isNetworkConnection, isConferencePhone, isProjector, isVideoConference, isWhiteboard) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return this._isRoomServiceAvailable(isCateringAvailable) ||
				this._isRoomServiceAvailable(isADAAvailable) ||
				this._isRoomServiceAvailable(isNetworkConnection) ||
				this._isRoomServiceAvailable(isConferencePhone) ||
				this._isRoomServiceAvailable(isProjector) ||
				this._isRoomServiceAvailable(isVideoConference) ||
				this._isRoomServiceAvailable(isWhiteboard);
	},

    _isRoomServiceAvailable: function(value) {
		return value && (value == true || value == "Yes");
	},

    _setHighlightSpace: function(pinDetails){
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (pinDetails) {
			this.set('_highlightSpace', { _id: pinDetails.spaceRecordId });
		} else {
			this.set('_highlightSpace', { _id: "" });
		}
	},

    _handleFloorRecordIdChange: function (floorRecordId, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (opened && floorRecordId != null && floorRecordId != "-1") {
			this.$.floorplan.recordId = floorRecordId;
		}
	},

    _handleMaximizeChange: function(maximize, opened, hasGraphic, svgLoaded) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (opened && hasGraphic && svgLoaded) {
			afterNextRender(this, function () {
				this.notifyResize();
			});
		}
	}
});