/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import {
	PolymerElement,
	html
} from "../../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import "../../../@polymer/paper-checkbox/paper-checkbox.js";
import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/iron-ajax/iron-ajax.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../tricore-url/tricore-url.js";

import "../../../triplat-query/triplat-query.js";
import "../../../triplat-routing/triplat-route.js";

import "../../components/alert-banner/tricomp-alert-banner.js";
import "../../components/details-header/tricomp-details-header.js";
import "../../styles/tristyles-stacking.js";
import {
	round,
	computeExportFilename,
	generateExportCSV,
	downloadFile
} from "../../utils/triutils-stacking.js";

const CSV_EXTENSION = ".csv";
class StackPlanSummaryPage extends PolymerElement {
	static get is() {
		return "tripage-stack-plan-summary";
	}

	static get template() {
		return html`
			<style
				include="stacking-layout-styles stacking-shared-styles tristyles-theme"
			>
				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.header {
					background-color: var(--ibm-neutral-2);
					padding: 20px;
				}

				.data-table-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					padding: 20px;
					overflow-y: auto;
					-ms-overflow-style: none;
				}

				triblock-table {
					@apply --layout-flex;
				}

				.qty-column {
					--triblock-table-column-fixed-width: 100px;
				}

				.checkbox-container {
					padding-bottom: 20px;
				}

				.message-placeholder {
					@apply --layout-center;
					@apply --layout-vertical;
					padding-top: 75px;
					text-align: center;
				}

				.cell-with-padding {
					padding: 0 5px;
				}
			</style>

			<triplat-route
				name="stackPlanSummary"
				params="{{_detailsParams}}"
				on-route-active="_onRouteActive"
			></triplat-route>

			<triservice-stacking
				current-user="{{_currentUser}}"
			></triservice-stacking>

			<triservice-stack-plan
				id="stackPlanService"
				stack-plan="{{_stackPlan}}"
			></triservice-stack-plan>
			<triplat-query
				data="[[_planningMoveItems]]"
				filtered-data-out="{{_sortedPlanningMoveItems}}"
			>
				<triplat-query-filter
					name="isChanged"
					operator="equals"
					value="[[_showIsChangedOnly]]"
					ignore-if-blank
				></triplat-query-filter>
				<triplat-query-sort
					name="[[_sortProp]]"
					desc="[[_sortDesc]]"
					type="[[_sortType]]"
				></triplat-query-sort>
			</triplat-query>

			<template
				is="dom-if"
				if="[[_inNonEditableState(_stackPlan.statusENUS)]]"
			>
				<tricomp-alert-banner info>
					This record is in [[_stackPlan.status]] status. Any changes
					will not be saved.
				</tricomp-alert-banner>
			</template>
			<div class="header label-actions">
				<tricomp-details-header
					label="Planning Move Items for"
					stack-plan="[[_stackPlan]]"
				></tricomp-details-header>
				<div class="action-bar">
					<paper-button raised on-tap="_handleExcelExport"
						>Export</paper-button
					>
				</div>
			</div>
			<div class="data-table-container">
				<template
					is="dom-if"
					if="[[!_inNonEditableState(_stackPlan.statusENUS)]]"
				>
					<div class="checkbox-container">
						<paper-checkbox checked="{{_showIsChangedOnlyCheckbox}}"
							>Show changed items only</paper-checkbox
						>
					</div>
				</template>
				<template
					is="dom-if"
					if="[[!_computeShowTable(_sortedPlanningMoveItems)]]"
				>
					<div class="message-placeholder">
						No planning move items are available.
					</div>
				</template>
				<template
					is="dom-if"
					if="[[_computeShowTable(_sortedPlanningMoveItems)]]"
				>
					<triblock-table
						id="table"
						fixed-header
						data="[[_sortedPlanningMoveItems]]"
						scroller="{{_scroller}}"
						sort-property="{{_sortProp}}"
						sort-descending="{{_sortDesc}}"
						sort-type="{{_sortType}}"
						indexed
						remove-row-focus-and-hover
					>
						<triblock-table-column
							title="Organization"
							property="orgId"
							sortable
						>
							<template>
								<div class="cell-with-padding">
									<span hidden$="[[!item.orgId]]"
										>[[item.orgId]] - </span
									><span>[[item.org.value]]</span>
								</div>
							</template>
						</triblock-table-column>
						<triblock-table-column
							title="Space Class"
							property="fromSpaceClassIdName"
							sortable
						>
							<template>
								<div class="cell-with-padding">
									[[item.fromSpaceClassIdName]]
								</div>
							</template>
						</triblock-table-column>
						<triblock-table-column
							title="Quantity"
							property="qty"
							class="qty-column"
							sortable
						>
							<template>
								<span>[[_formatDecimal(item.qty)]]</span>
							</template>
						</triblock-table-column>
						<triblock-table-column
							title="Area"
							property="area"
							type="STRING_WITH_ID"
							sortable
						>
							<template>
								<span
									>[[_formatDecimal(item.area.value)]]&nbsp;[[item.area.uom]]</span
								>
							</template>
						</triblock-table-column>
						<triblock-table-column
							title="From Building"
							property="fromBldg"
							type="STRING_WITH_ID"
							sortable
						>
							<template>
								<template
									is="dom-if"
									if="[[_computeFloorSet(item.fromFloor)]]"
								>
									<span>[[item.fromBldg.value]]</span>
								</template>
							</template>
						</triblock-table-column>
						<triblock-table-column
							title="From Floor"
							property="fromFloor"
							type="STRING_WITH_ID"
							sortable
						></triblock-table-column>
						<triblock-table-column
							title="To Building"
							property="toBldg"
							type="STRING_WITH_ID"
							sortable
						></triblock-table-column>
						<triblock-table-column
							title="To Floor"
							property="toFloor"
							type="STRING_WITH_ID"
							sortable
						></triblock-table-column>
					</triblock-table>
				</template>
			</div>
		`;
	}

	static get properties() {
		return {
			readonly: Boolean,
			_stackPlan: Object,
			_planningMoveItems: Array,

			_sortedPlanningMoveItems: Array,

			_sortProp: {
				type: String,
				notify: true,
				value: "name"
			},

			_sortDesc: {
				type: Boolean,
				notify: true,
				value: false
			},

			_sortType: {
				type: String,
				notify: true,
				value: "STRING"
			},

			_currentUser: Object,
			_detailsParams: Object,

			_showIsChangedOnly: Boolean,

			_showIsChangedOnlyCheckbox: Boolean
		};
	}

	static get importMeta() {
		return getModuleUrl(
			"triview-stacking/pages/stack-plan-summary/tripage-stack-plan-summary.js"
		);
	}

	static get observers() {
		return [
			"_handleCheckboxChanged(_showIsChangedOnlyCheckbox, _stackPlan.statusENUS)"
		];
	}

	_onRouteActive(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.stackPlanService
					.refreshBuildingStackSupply(this._detailsParams.stackPlanId)
					.then(bldgStackSupply => {
						this.$.stackPlanService
							.refreshStackPlan(this._detailsParams.stackPlanId)
							.then(stackPlan => {
								this.$.stackPlanService
									.refreshStackPlanBo(
										this._detailsParams.stackPlanId
									)
									.then(stackPlanBo => {
										if (
											stackPlanBo.statusENUS ==
												"Review In Progress" ||
											stackPlanBo.statusENUS == "Active"
										) {
											this.$.stackPlanService
												.refreshPlanningMoveItems(
													this._detailsParams
														.stackPlanId
												)
												.then(success => {
													this.set(
														"_planningMoveItems",
														this._addSpaceClassIdName(
															success.data
														)
													);
													this.set(
														"_showIsChangedOnly",
														""
													);
												}, this);
										} else {
											let allocationBlocks = stackPlan.allocationBlocksJSON
												? JSON.parse(
														stackPlan.allocationBlocksJSON
												  )
												: stackPlan.allocationBlocks;
											let tempPlanningMoveItems = this.$.stackPlanService.createPlanningMoveItemsFromAllocationBlocks(
												this._detailsParams.stackPlanId,
												false,
												allocationBlocks
											);
											this.set(
												"_planningMoveItems",
												this._addSpaceClassIdName(
													tempPlanningMoveItems
												)
											);
										}
									}, this);
							}, this);
					}, this);
			});
		} else {
			this._reset();
		}
	}

	_addSpaceClassIdName(moveItems) {
		if (moveItems && moveItems.length > 0) {
			moveItems.forEach(item => {
				item.fromSpaceClassIdName =
					item.fromSpaceClassId && item.fromSpaceClassId != ""
						? item.fromSpaceClassId +
						  " - " +
						  item.fromSpaceClass.value
						: item.fromSpaceClass.value;
			});
			return moveItems;
		}
	}

	_formatDecimal(value) {
		return round(value);
	}

	_computeShowTable(planningMoveItems) {
		return planningMoveItems && planningMoveItems.length > 0;
	}

	_inNonEditableState(statusENUS) {
		return statusENUS == "Review In Progress" || statusENUS == "Active";
	}

	_handleCheckboxChanged(showIsChangedOnlyCheckbox, status) {
		if (this._inNonEditableState(status) && !showIsChangedOnlyCheckbox) {
			this.set("_showIsChangedOnly", "");
		} else {
			this.set(
				"_showIsChangedOnly",
				showIsChangedOnlyCheckbox ? true : ""
			);
		}
	}

	_reset() {
		this.set("_showIsChangedOnlyCheckbox", false);
		this.set("_planningMoveItems", null);
	}

	_computeFloorSet(floor) {
		return floor && floor.value && floor.id;
	}

	_handleExcelExport(e) {
		e.stopPropagation();
		if (this._stackPlan.statusENUS === "Active") {
			this._doExcelExportForActive();
		} else {
			this._doExcelExportForDraft();
		}
	}

	_doExcelExportForDraft() {
		const __dictionary__planningMoveItemsReportFilename = `Planning Move Items for ${this._stackPlan.name}`;
		const filename =
			__dictionary__planningMoveItemsReportFilename + CSV_EXTENSION;
		const __dictionary__organization = "Organization";
		const __dictionary__spaceClass = "Space Class";
		const __dictionary__quantity = "Quantity";
		const __dictionary__area = "Area";
		const __dictionary__fromBuilding = "From Building";
		const __dictionary__fromFloor = "From Floor";
		const __dictionary__toBuilding = "To Building";
		const __dictionary__toFloor = "To Floor";
		const headers = [
			__dictionary__organization,
			__dictionary__spaceClass,
			__dictionary__quantity,
			__dictionary__area,
			__dictionary__fromBuilding,
			__dictionary__fromFloor,
			__dictionary__toBuilding,
			__dictionary__toFloor
		];

		const dataInCSV = generateExportCSV(
			headers,
			this._formatPlanningMoveItems(this._sortedPlanningMoveItems)
		);
		downloadFile(filename, dataInCSV);
	}

	async _doExcelExportForActive() {
		const {
			reportTemplateId
		} = await this.$.stackPlanService.getPlanningMoveItemsQueryMetadata(
			this._stackPlan._id
		);
		let planningMoveItemsQueryMetadataAjax = this
			._planningMoveItemsQueryMetadataAjax;
		if (!planningMoveItemsQueryMetadataAjax) {
			planningMoveItemsQueryMetadataAjax = document.createElement(
				"iron-ajax"
			);
			this.set(
				"_planningMoveItemsQueryMetadataAjax",
				planningMoveItemsQueryMetadataAjax
			);
		}

		planningMoveItemsQueryMetadataAjax.url = this._getExportExcelUrl();
		planningMoveItemsQueryMetadataAjax.method = "POST";
		planningMoveItemsQueryMetadataAjax.handleAs = "blob";
		planningMoveItemsQueryMetadataAjax.params = {
			objectId: 950000,
			actionId: 950005,
			reportTemplId: reportTemplateId,
			manager: -1,
			associatedId: this._stackPlan._id,
			accessLocalizedData: true
		};

		const request = planningMoveItemsQueryMetadataAjax.generateRequest();

		return request.completes.then(request => {
			if (request.succeeded && request.status == "200") {
				let blob = request.response;
				let headers = request.xhr.getAllResponseHeaders();

				headers = headers.trim().split(/[\r\n]+/);
				var headerMap = {};
				headers.forEach(line => {
					var parts = line.split(": ");
					var header = parts.shift();
					var value = parts.join(": ");
					headerMap[header] = value;
				});
				let filename = computeExportFilename(
					headerMap["content-disposition"]
				);
				const downloadUrl = URL.createObjectURL(blob);
				downloadFile(filename, downloadUrl);
			} else {
				console.log("throw error message");
			}
		});
	}

	_getExportExcelUrl(reportTemplateId, recordId) {
		let triCoreEl = this._triCoreEl;
		if (!triCoreEl) {
			triCoreEl = document.createElement("tricore-url");
			this.set("_triCoreEl", triCoreEl);
		}

		const EXPORT_EXCEL_URL = "/UIQueryActionHandler.srv";
		const exportExcelUrl = `${EXPORT_EXCEL_URL}`;
		return triCoreEl.getUrl(exportExcelUrl);
	}

	_formatPlanningMoveItems(items) {
		const output = [];
		for (let item of items) {
			const obj = {};

			let orgStr = item.orgId
				? `${item.orgId} - ${item.org.value}`
				: item.org.value;
			obj.orgId = orgStr;

			obj.fromSpaceClassIdName = item.fromSpaceClassIdName;
			obj.qty = this._formatDecimal(item.qty);
			obj.area = item.area
				? `${this._formatDecimal(item.area.value)} ${item.area.uom}`
				: "";
			obj.fromBldg = item.fromBldg ? item.fromBldg.value : "";
			obj.fromFloor = item.fromFloor ? item.fromFloor.value : "";
			obj.toBldg = item.toBldg ? item.toBldg.value : "";
			obj.toFloor = item.toFloor ? item.toFloor.value : "";

			output.push(obj);
		}
		return output;
	}
}

window.customElements.define(StackPlanSummaryPage.is, StackPlanSummaryPage);
