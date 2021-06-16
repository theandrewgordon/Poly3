/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { dom } from "../../../@polymer/polymer/lib/legacy/polymer.dom.js";
import "../../../@polymer/paper-menu-button/paper-menu-button-animations.js";
import "../../../@polymer/neon-animation/animations/fade-out-animation.js";

let openedDropdowns = new Set();

export function closeAllDropdowns() {
	openedDropdowns.forEach(item => item.close());
}

export const TrimixinDropdown = (superClass) => class extends superClass {
	static get properties() {
		return {
			_opened: {
				type: Boolean,
				observer: "_handleOpenedChanged"
			},

			_fitInto: {
				type: Object
			},

			_scrollContainer: {
				type: Object
			},

			_targetElement: {
				type: Object
			},

			_openAnimationConfig: {
				type: Object,
				value: function() {
					return [
						{name: "fade-in-animation", timing: {delay: 100, duration: 200}},
						{
							name: "paper-menu-grow-width-animation",
							timing: {
								delay: 100,
								duration: 150,
								easing: "cubic-bezier(.3,.95,.5,1)"
							}
						},
						{
							name: "paper-menu-grow-height-animation",
							timing: {
								delay: 100,
								duration: 275,
								easing: "cubic-bezier(.3,.95,.5,1)"
							}
						}
					];
				}
			},

			_closeAnimationConfig: {
				type: Object,
				value: function() {
					return [
						{name: "fade-out-animation", timing: {duration: 150}},
						{
							name: "paper-menu-shrink-width-animation",
							timing: {
								delay: 100,
								duration: 50,
								easing: "cubic-bezier(.3,.95,.5,1)"
							}
						},
						{
							name: "paper-menu-shrink-height-animation",
							timing: {duration: 200, easing: "ease-in"}
						}
					];
				}
			},

			_scrollAction: {
				type: String,
				value: "none"
			}
		};
	}

	constructor() {
		super();
		this._handleOnScrollListener = this._handleOnScroll.bind(this);
		this._onDropdownCanceledListener = this._onDropdownCanceled.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("iron-overlay-canceled", this._onDropdownCanceledListener);
	}
	
	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("iron-overlay-canceled", this._onDropdownCanceledListener);
	}

	_addScrollListener() {
		let scrollContainer = (!this._scrollContainer || this._scrollContainer === null || this._scrollContainer === undefined) ? this._fitInto : this._scrollContainer;
		if (scrollContainer) {
			scrollContainer.addEventListener(
				"scroll", 
				this._handleOnScrollListener,
				{
					capture: true,
					passive: true,
				}
			);
			this._scrollContainerWithListener = scrollContainer;
		}
	}

	_removeScrollListener() {
		if (this._scrollContainerWithListener) {
			this._scrollContainerWithListener.removeEventListener(
				"scroll", 
				this._handleOnScrollListener,
				{
					capture: true,
					passive: true,
				}
			);
			this._scrollContainerWithListener = null;
		}
	}

	_handleOnScroll(e) {
		let dropdownRect = this.$.dropdown.getBoundingClientRect();
		let targetRect = e.target.getBoundingClientRect();
		if (dropdownRect.top <= targetRect.top || dropdownRect.bottom >= targetRect.bottom) {
			this.$.dropdown.close()
		} else {
			this.$.dropdown.notifyResize();
		}
	}

	_handleOpenedChanged(opened) {
		if (this._targetElement) {
			this._targetElement.opened = opened;
		}
		if (opened) {
			this._addScrollListener();
			openedDropdowns.add(this);
		} else {
			this._removeScrollListener();
			openedDropdowns.delete(this);
		}
	}

	applyScrollContainer(newScrollContainer) {
		if (this._opened) {
			this._scrollContainer = newScrollContainer;
			this._removeScrollListener();
			this._addScrollListener();
			this.$.dropdown.notifyResize();
		}
	}

	_onDropdownCanceled(event) {
		var uiEvent = event.detail;
		var trigger = this._targetElement;
		var path = dom(uiEvent).path;

		if (path && path.indexOf(trigger) > -1) {
			event.preventDefault();
		}
	}

	_setDropdownWidth() {
		if (this._targetElement) {
			let targetWidth = this._targetElement.getBoundingClientRect().width.toString() + "px";
			this.$.dropdown.style.minWidth = targetWidth;
			this.$.dropdown.style.maxWidth = targetWidth;
		}
	}
}