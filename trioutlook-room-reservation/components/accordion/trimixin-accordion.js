/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

/**
 * This mixin controls a set of accordions: it will keep only opened at a time.
 */

let openedAccordions = new Map();

export const TrimixinAccordion = (superClass) => class extends superClass {
	static get properties() {
		return {
			_opened: {
				type: Boolean,
				value: false,
				reflectToAttribute: true,
				observer: "_handleOpenedChanged"
			}
		};
	}

	_handleOpenedChanged(opened) {
		const componentName = Object.getPrototypeOf(this).constructor.is;
		let openedAccordion = openedAccordions.get(componentName);

		if (opened) {
			if (openedAccordion && openedAccordion != this && openedAccordion._opened) openedAccordion._opened = false;
			openedAccordions.set(componentName, this);
		} else {
			if (openedAccordion && openedAccordion == this) openedAccordions.set(componentName, null);
		}
	}
}