import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../styles/tristyles-carbon-theme.js";

class TricompFloorPlanLegendItem extends PolymerElement {
	static get is() { return "tricomp-floor-plan-legend-item"; }

	static get template() {
		return html `
			<style include="carbon-style">

				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.box {
					border-radius: 1px;
					height: 16px;
					width: 16px;
				}

				.name {
					padding-left: 8px;
					padding-right: 8px;
				}

				.available {
					background-color: var(--carbon-inverse-support-02);
				}

				.unavailable {
					background-color: var(--carbon-inverse-support-01);
				}

				.added {
					background-color: var(--carbon-inverse-support-04);
				}
			</style>

			<div id="box" class="box"></div>
			<span class="name body-short-01">[[_name]]</span>
		`
	}

	static get properties() {
		return {
			type: String,
			_name: String
		}
	}

	connectedCallback() {
		super.connectedCallback();
		const __dictionary__available = "Available";
		const __dictionary__unavailable = "Unavailable";
		const __dictionary__added = "Added";

		switch (this.type) {
			case 'available':
				this.set('_name', __dictionary__available);
				this.shadowRoot.querySelector("#box").classList.add('available');
				break;
			case 'unavailable':
				this.set('_name', __dictionary__unavailable);
				this.shadowRoot.querySelector("#box").classList.add('unavailable');
				break;
			case 'added':
				this.set('_name', __dictionary__added);
				this.shadowRoot.querySelector("#box").classList.add('added');
				break;
		} 

		return name;
	}
}

window.customElements.define(TricompFloorPlanLegendItem.is, TricompFloorPlanLegendItem);