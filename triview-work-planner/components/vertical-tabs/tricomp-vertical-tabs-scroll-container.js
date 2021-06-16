/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../../@polymer/polymer/lib/utils/async.js";
import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { IronMenubarBehavior } from "../../../@polymer/iron-menu-behavior/iron-menubar-behavior.js";
import { IronResizableBehavior } from "../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

class TricompVerticalTabsScrollContainer extends mixinBehaviors([IronMenubarBehavior, IronResizableBehavior, TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-vertical-tabs-scroll-container"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-center;
					@apply --layout-flex;
					@apply --layout-self-stretch;
					@apply --layout-vertical;
					overflow: hidden;
				}

				#tabsContainer {
					@apply --layout-flex-auto;
					@apply --layout-self-stretch;
					overflow-y: hidden;
					position: relative;
				}

				#tabsContainer:hover {
					overflow-y: auto;
				}

				#tabsContent {
					@apply --layout-vertical;
					-moz-flex-basis: auto;
					-ms-flex-basis: auto;
					flex-basis: auto;
					position: absolute;
					width: 100%;
				}

				#tabsContent > ::slotted(*) {
					/* IE - prevent tabs from compressing when they should scroll. */
					-ms-flex: 1 0 auto;
					-webkit-flex: 1 0 auto;
					flex: 1 0 auto;
					outline: none;
				}

				#selectionBar {
					position: absolute;
					top: 0;
					bottom: 0;
					left: 1px;
					width: 0;
					-webkit-transform: scale(0);
					transform: scale(0);
					-webkit-transform-origin: center top;
					transform-origin: center top;
					transition: -webkit-transform;
					transition: transform;
					z-index: 2;
				}
				:host([dir="ltr"]) #selectionBar {
					border-left: 5px solid var(--tri-primary-color-60);
				}
				:host([dir="rtl"]) #selectionBar {
					border-right: 5px solid var(--tri-primary-color-60);
				}

				#selectionBar.expand {
					transition-duration: 0.15s;
					transition-timing-function: cubic-bezier(0.4, 0.0, 1, 1);
				}
				#selectionBar.contract {
					transition-duration: 0.18s;
					transition-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1);
				}
			</style>

			<div id="tabsContainer" on-track="_scroll" on-down="_down">
				<div id="tabsContent">
					<div id="selectionBar" on-transitionend="_onBarTransitionEnd"></div>
					<slot></slot>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			buttonsAlwaysVisible: {
				type: Boolean,
				value: false
			},

			buttonsHidden: {
				type: Boolean,
				value: false,
				notify: true,
				observer: "_notifyResize"
			},

			upDisabled: {
				type: Boolean,
				value: false,
				notify: true
			},

			downDisabled: {
				type: Boolean,
				value: false,
				notify: true
			},

			_holdJob: {
				type: Number
			},

			_holdDelay: {
				type: Number,
				value: 1
			},

			_step: {
				type: Number,
				value: 10
			},

			_defaultFocusAsync: {
				type: Object
			},

			_position: {
				type: Object
			},

			_top: {
				type: Number
			},

			_previousTab: {
				type: Object
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this._holdJob = null;
		this.addEventListener("iron-resize", this._onTabSizingChanged);
		this.addEventListener("iron-items-changed", this._onTabSizingChanged);
		this.addEventListener("iron-select", this._onIronSelect);
		this.addEventListener("iron-deselect", this._onIronDeselect);
		afterNextRender(this, () => {
			this.setScrollDirection("x", this.$.tabsContainer);
			this.$.tabsContainer.addEventListener("scroll", this._onTabSizingChanged.bind(this));
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("iron-resize", this._onTabSizingChanged);
		this.removeEventListener("iron-items-changed", this._onTabSizingChanged);
		this.removeEventListener("iron-select", this._onIronSelect);
		this.removeEventListener("iron-deselect", this._onIronDeselect);
		this.$.tabsContainer.removeEventListener("scroll", this._onTabSizingChanged.bind(this));
	}

	_notifyResize() {
		this.notifyResize();
	}

	_onTabSizingChanged() {
		this._debounceOnTabSizingChanged = Debouncer.debounce(
			this._debounceOnTabSizingChanged,
			microTask,
			() => {
				this._scroll();
				this._tabChanged(this.selectedItem);
			}
		);
	}

	_onIronSelect(event) {
		this._tabChanged(event.detail.item, this._previousTab);
		this._previousTab = event.detail.item;
		if (this._debounceTabChanged) {
			this._debounceTabChanged.cancel();
		}
	}

	_onIronDeselect(event) {
		this._debounceTabChanged = Debouncer.debounce(
			this._debounceTabChanged,
			microTask,
			() => {
				this._tabChanged(null, this._previousTab);
				this._previousTab = null;
			}
		);
	}

	_tabChanged(tab, old) {
		if (!tab) {
			// Remove the bar without animation.
			this.$.selectionBar.classList.remove("expand");
			this.$.selectionBar.classList.remove("contract");
			this._positionBar(0, 0);
			return;
		}

		var tabsContainerRect = this.$.tabsContainer.getBoundingClientRect();
		var tabsContentRect = this.$.tabsContent.getBoundingClientRect();
		var tabsContentHeight = tabsContentRect.height;

		if (!this.buttonsAlwaysVisible) {
			this.buttonsHidden = tabsContentHeight <= tabsContainerRect.height;
		}

		var tabRect = tab.getBoundingClientRect();
		var tabOffsetTop = tabRect.top - tabsContentRect.top;

		this._position = {
			height: this._calcPercent(tabRect.height, tabsContentHeight),
			top: this._calcPercent(tabOffsetTop, tabsContentHeight)
		};

		if (old == null) {
			// Position the bar without animation.
			this.$.selectionBar.classList.remove("expand");
			this.$.selectionBar.classList.remove("contract");
			this._positionBar(this._position.height, this._position.top);
			return;
		}

		var oldRect = old.getBoundingClientRect();

		// bar animation: expand
		this.$.selectionBar.classList.add("expand");

		this._positionBar(
			this._calcPercent(tabRect.top + tabRect.height - oldRect.top, tabsContentHeight),
			this._top
		);

		this._scrollToSelectedIfNeeded(tabRect.height, tabOffsetTop);
	}

	_calcPercent(height, height0) {
		return 100 * height / height0;
	}
	
	_scrollToSelectedIfNeeded(tabHeight, tabOffsetTop) {
		var top = tabOffsetTop - this.$.tabsContainer.scrollTop;
		if (top < 0) {
			this.$.tabsContainer.scrollTop += top;
		} else {
			top += (tabHeight - this.$.tabsContainer.offsetHeight);
			if (top > 0) {
				this.$.tabsContainer.scrollTop += top;
			}
		}
	}

	get _tabContainerScrollSize() {
		return Math.max(0, this.$.tabsContainer.scrollHeight - this.$.tabsContainer.offsetHeight);
	}

	onScrollButtonUp() {
		clearInterval(this._holdJob);
		this._holdJob = null;
	}

	onUpScrollButtonDown() {
		this._scrollUp();
		this._holdJob = setInterval(this._scrollUp.bind(this), this._holdDelay);
	}
	
	onDownScrollButtonDown() {
		this._scrollDown();
		this._holdJob = setInterval(this._scrollDown.bind(this), this._holdDelay);
	}

	_scrollUp() {
		this._affectScroll(-this._step);
	}

	_scrollDown() {
		this._affectScroll(this._step);
	}

	_affectScroll(dy) {
		this.$.tabsContainer.scrollTop += dy;
	
		var scrollTop = this.$.tabsContainer.scrollTop;
	
		this.upDisabled = scrollTop === 0;
		this.downDisabled = scrollTop === this._tabContainerScrollSize;
	}

	_scroll(e, detail) {
		var ddy = (detail && -detail.ddy) || 0;
		this._affectScroll(ddy);
	}

	_down(e) {
		// go one beat async to defeat IronMenuBehavior
		// autorefocus-on-no-selection timeout
		setTimeout(() => {
			if (this._defaultFocusAsync) {
				this.cancelAsync(this._defaultFocusAsync);
				this._defaultFocusAsync = null;
			}
		}, 1);
	}

	_onBarTransitionEnd(e) {
		var classList = this.$.selectionBar.classList;
		// bar animation: expand -> contract
		if (classList.contains("expand")) {
			classList.remove("expand");
			classList.add("contract");
			this._positionBar(this._position.height, this._position.top);
			// bar animation done
		} else if (classList.contains("contract")) {
			classList.remove("contract");
		}
	}

	_positionBar(height, top) {
		height = height || 0;
		top = top || 0;
	
		this._top = top;
		this.transform(
			"translateY(" + top + "%) scaleY(" + (height / 100) + ")",
			this.$.selectionBar
		);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/vertical-tabs/tricomp-vertical-tabs-scroll-container.js");
	}
}

window.customElements.define(TricompVerticalTabsScrollContainer.is, TricompVerticalTabsScrollContainer);