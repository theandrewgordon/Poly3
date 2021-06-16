import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "./tricomp-floor-plan-legend-item.js";
import "../../styles/tristyles-carbon-theme.js";

class TricompFloorPlanLegend extends PolymerElement {
	static get is() { return "tricomp-floor-plan-legend"; }

	static get template() {
		return html `
			<style include="carbon-style">
				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
					background-color: var(--carbon-inverse-01);
					opacity: 0.9;
					min-width: 100px;
					padding: 0px 10px 10px;
				}

			</style>
			<div>
				<div class="productive-heading-02 bottom-8">Legend</div>
				<tricomp-floor-plan-legend-item class="bottom-8" type="added"></tricomp-floor-plan-legend-item>
				<tricomp-floor-plan-legend-item class="bottom-8" type="available"></tricomp-floor-plan-legend-item>
				<tricomp-floor-plan-legend-item class="bottom-8" type="unavailable"></tricomp-floor-plan-legend-item>
			</div>
		`
	}

	static get properties() {
		return {

		}
	}
}

window.customElements.define(TricompFloorPlanLegend.is, TricompFloorPlanLegend);