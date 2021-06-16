/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-input/paper-input-container.js";
import "../@polymer/iron-input/iron-input.js";
import "../@polymer/paper-button/paper-button.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-route.js";
import "../triplat-number-input/triplat-number-input.js";
import "../triplat-uom/triplat-uom.js";
import "../triblock-popup/triblock-popup.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "./triservice-work-task.js";
import "./tristyles-work-task-app.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-popup tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				:host([small-layout]) {
					padding: 0px;
				}

				.content {
					@apply --layout-vertical;
				}

				:host([small-layout]) .content {
					padding: 10px 20px;
				}

				triblock-popup {
					width: 350px;
				}

				@media (max-height: 400px) {
					triblock-popup {
						top: 0px;
						bottom: 0px;
					}

					.popup-content {
						max-height: 100%;
						overflow-y: auto;
					}
				}

				.quantity {
					@apply --layout-horizontal;
					margin: 8px 0px 10px;
				}

				.quantity-input {
					@apply --layout-flex;
				}

				:host([dir="ltr"]) .quantity-input {
					padding-right: 20px;
				}

				:host([dir="rtl"]) .quantity-input {
					padding-left: 20px;
				}

				triplat-number-input {
					--paper-input-container-input: {
						text-align: right;
						padding: 8px 0px;
					};

					--triplat-paper-input: {
						@apply --layout-flex;
					}
				}

				.estimated-input {
					--paper-input-container-underline: {
						border-bottom: 1px dotted var(--tri-primary-content-color)!important;
						background-color: transparent;
					};
					--paper-input-container-underline-focus: {
						border-bottom: 1px dotted var(--tri-primary-color);
						background-color: transparent;
					};
				}

				.action-bar {
					padding-top: 15px;
					@apply --layout-horizontal;
				}

				:host([small-layout]) paper-button {
					@apply --layout-flex;
				}

				:host([small-layout]) .material-header {
					background-color: var(--ibm-neutral-3);
					padding: 12px 15px;
				}

				.popup-content {
					position: relative;
				}

				:host([small-layout]) #materialPopup {
					overflow: auto;
				}

				:host([small-layout]) .popup-content {
					padding-bottom: 102px;
				}

				.quantity-uom {
					@apply --layout-flex;
					--triplat-uom-dropdown-content: {
						min-width: 200px;
					};
				}

				:host([small-layout]) .quantity-uom {
					--triplat-uom-dropdown-content: {
						min-width: 180px;
					};
					--triplat-uom-dropdown: {
						width: 100%;
					}
				}

				.required {
					color: var(--ibm-red-50);
				}

				paper-input-container {
					--paper-input-container: {
						padding-top: 8px;
						padding-bottom: 8px;
					}
				}

				.costInputs {
					@apply --layout-flex;
					padding : 20px 0px 10px;
				}
				
				input {
					@apply --paper-input-container-shared-input-style;
				}
		</style>

		<triplat-route name="taskMaterialDetail" params="{{_materialParams}}" on-route-active="_onRouteActive" active="{{opened}}"></triplat-route>

		<triservice-work-task id="workTaskService" material="{{_material}}" currencies="{{_currencies}}" quantities="{{_quantities}}" loading-material="{{_loadingMaterial}}" loading-materials="{{_loadingMaterials}}"></triservice-work-task>

		<triblock-popup id="materialPopup" with-backdrop="" modal="" on-iron-overlay-canceled="_historyBack" aria-label="Add or Edit Material" small-screen-width="[[smallLayout]]" disable-screen-size-detection>
			<div class="popup-content">
				<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>
			
				<div class="material-header tri-h2" hidden\$="[[!_isNew]]">[[_addMaterialHeader]]</div>
				<div class="material-header tri-h2" hidden\$="[[_isNew]]">[[_material.id]]</div>
		
				<div class="content">
					<paper-input-container id="description">
						<label id="descriptionLabel" slot="label">
							<span class="required">*</span>
							<span>Description</span>
						</label>
						<iron-input id="descriptionInput" maxlength="50" bind-value="{{_material.description}}" slot="input">
							<input aria-label="Description" readonly="[[readonly]]" maxlength="50" aria-required="true" title="Please fill out this field." required>
						</iron-input>
					</paper-input-container>
					<div class="quantity">
						<triplat-number-input id="quantityInput" class="quantity-input" label="Quantity" aria-label="Quantity" readonly="[[readonly]]" unformatted-value="{{_material.quantity}}" user="[[currentUser]]" uom="[[_material.quantityUOM]]" uom-list="[[_quantities]]" min="0" max="999999999" auto-validate="" invalid="{{_invalidQuantity}}">
						</triplat-number-input>
						<triplat-uom class="quantity-uom" label="Unit" uom-value="{{_material.quantityUOM}}" uom-list="{{_quantities}}"></triplat-uom>
					</div>
					<triplat-number-input id="rateInput" class="costInputs" display-symbol="" label="Cost per unit" readonly="[[readonly]]" unformatted-value="{{_material.rate.value}}" user="[[currentUser]]" uom="[[_material.rate.uom]]" uom-list="[[_currencies]]" display-abbr="" min="0" max="999999999" auto-validate="" invalid="{{_invalidCostPerUnit}}">
					</triplat-number-input>
					<triplat-number-input id="estimatedInput" class="costInputs" display-symbol="" class="estimated-input" label="Estimated cost" readonly="" unformatted-value="{{_material.estimatedCost.value}}" user="[[currentUser]]" uom="[[_material.estimatedCost.uom]]" uom-list="[[_currencies]]" display-abbr="" auto-validate="" invalid="{{_invalidEstimatedCost}}">
					</triplat-number-input>
					<triplat-number-input id="actualInput" class="costInputs" display-symbol="" label="Actual cost" readonly="[[readonly]]" unformatted-value="{{_material.actualCost.value}}" user="[[currentUser]]" uom="[[_material.actualCost.uom]]" uom-list="[[_currencies]]" display-abbr="" min="0" max="999999999" auto-validate="" invalid="{{_invalidActualCost}}">
					</triplat-number-input>
				</div>

				<div class="action-bar" hidden\$="[[_computeHideActionBar(readonly, opened)]]">
					<paper-button secondary\$="[[!smallLayout]]" footer-secondary\$="[[smallLayout]]" on-tap="_handleCancelChanges">Cancel</paper-button>
					<paper-button id="doneButton" footer\$="[[smallLayout]]" on-tap="_handleDone" disabled\$="[[_computeDoneDisable(_material.description, _loadingMaterial, _loadingMaterials, _invalidQuantity, _invalidCostPerUnit, _invalidEstimatedCost, _invalidActualCost)]]">Done</paper-button>
				</div>
			</div>
		</triblock-popup>
	`,

    is: "tripage-material",
		behaviors: [ 
			TriComputeLoadingBehavior, 
			TriDirBehavior
		],

    properties: {
		currentUser: Object,
		readonly: Boolean,

		opened: {
			type: Boolean,
			value: false,
			notify: true
		},

		task: Object,

		_isNew: {
			type: Boolean,
			value: false
		},

		_materialParams: {
			type: Object,
			value: function() {
				return {};
			}
		},

		_material: {
			type: Object,
			notify: true
		},

		_currencies: {
			type: Array
		},

		_quantities: {
			type: Array
		},

		_addMaterialHeader: {
			type: String,
			notify: true
		},

		_loadingMaterial: {
			type: Boolean
		},

		_loadingMaterials: {
			type: Boolean,
		},

		_invalidQuantity: {
			type: Boolean
		},

		_invalidCostPerUnit: {
			type: Boolean
		},

		_invalidEstimatedCost: {
			type: Boolean
		},

		_invalidActualCost: {
			type: Boolean
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		"_calculateEstimatedCost(_material.quantity, _material.rate.value)",
		"_setValidLoadings(_loadingMaterial, _loadingMaterials)"
	],

    attached: function() {
		var __dictionary__addMaterial = "Add Material";
		this.set('_addMaterialHeader', __dictionary__addMaterial);
		this.$.quantityInput.addEventListener('focus', this._handleInputFocused);
		this.$.rateInput.addEventListener('focus', this._handleInputFocused);
		this.$.actualInput.addEventListener('focus', this._handleInputFocused);
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this._cleanup();
				this._refreshMaterial();
			});
			this.async(function() {
				this.$.materialPopup.openPopup();
			}, 100);
		} else {
			this.$.materialPopup.closePopup();
		}
	},

    _refreshMaterial: function() {
		if (this._materialParams.materialId && this._materialParams.materialId != "-1") {
			this.$.workTaskService.refreshMaterial(this._materialParams.taskId, this._materialParams.materialId, true);
		} else {
			this.set("_isNew", true); 
			this.set('_material.rate.uom', this.task.currency);
			this.set('_material.estimatedCost.uom', this.task.currency);
			this.set('_material.actualCost.uom', this.task.currency);
			this.set('_material.currencyUOM', this.task.currency);
		}
	},

    _cleanup: function() {
		this.set("_isNew", false);
		this._material = this._getEmptyMaterial();
		this.$.descriptionInput.bindValue = "";
		this.$.quantityInput.unformattedValue = null;
		this.$.rateInput.unformattedValue = 0;
		this.$.estimatedInput.unformattedValue = 0;
		this.$.actualInput.unformattedValue = 0;

	},

    _handleCancelChanges: function(e) {
		e.stopPropagation();
		this._historyBack();
	},

    _handleDone: function(e) {
		e.stopPropagation();
		if(this._material._id && this._material._id !== "")
			this._materialUpdated();
		else {
			this._materialAdded();
		}
	},

    _materialUpdated: function() {
		this.debounce("materialUpdate", function() {
			this.$.workTaskService.updateMaterial(this._materialParams.taskId, this._material)
			.then(function() {
				this._historyBack();
			}.bind(this));
		}, 100);
	},

    _materialAdded: function() {
		this.debounce("materialAdd", function() {
			this.$.workTaskService.addMaterial(this._materialParams.taskId, this._material)
				.then(function() {
					this._historyBack();
					if(this.smallLayout){this._historyBack();}
				}.bind(this));
		}, 100);
	},

    _calculateEstimatedCost: function(quantity, rate) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (quantity && rate) {
			this.set('_material.estimatedCost.value', quantity * rate);
		} else {
			this.set('_material.estimatedCost.value', 0);
		}
	},

    _historyBack: function(e) {
		window.history.back();
	},

    _getEmptyMaterial: function() {
		return {
				id: "",
				description: "",
				quantity: null,
				quantityMobile: null,
				quantityUOM: null,
				currencyUOM: "",
				rate: {value: 0, uom: ""},
				rateMobile: 0,
				estimatedCost: {value: 0, uom: ""},
				actualCost: {value: 0, uom: ""},
				actualCostMobile: 0,
				mobileUpdate: false
			};
	},

    _handleInputFocused: function(e) {
		e.stopPropagation();
		let input = e.target.paperInputElement._focusableElement;
		this.async(function() {
			input.setSelectionRange(0, 9999);
			input.scrollIntoView();
		}.bind(this), 500);
	},

    _computeHideActionBar: function(readonly, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return readonly || !opened;
	},

    _computeDoneDisable: function(description, loadingMaterial, loadingMaterials, invalidQuantity, invalidCostPerUnit, invalidEstimatedCost, invalidActualCost) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !description || loadingMaterial || loadingMaterials || invalidQuantity || invalidCostPerUnit || invalidEstimatedCost || invalidActualCost;
	}
});