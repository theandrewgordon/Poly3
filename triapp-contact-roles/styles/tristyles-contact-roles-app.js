/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { addDomStyleModule } from "../../tricore-util/tricore-util.js";

const contactRolesAppTableStyles = `
<dom-module id="contact-roles-app-table-styles">
	<template>
		<style>

			.row {
				@apply --layout-horizontal;
			}

			.column-2 {
				@apply --layout-flex-2;
			}

			.column-1 {
				@apply --layout-flex;
			}

			.column-icon-expand {
				width: 28px;
			}

			.column-icon-delete {
				width: 38px;
			}

			.cell {
				@apply --layout-center;
				@apply --layout-horizontal;
				box-sizing: border-box;
				min-width: 0;
				overflow: hidden;
				padding: 20px 10px;
			}

			.cell > div,
			.cell > span {
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.table-body .cell {
				min-height: 60px;
			}

			.cell-expand-icon {
				padding: 10px 0 10px 10px;
			}

			.number-cell {
				@apply --layout-flex;
				text-align: right;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(contactRolesAppTableStyles, "triapp-contact-roles/styles/tristyles-contact-roles-app.js");

const contactRolesAppDropdownStyles = `
<dom-module id="contact-roles-app-dropdown-styles">
	<template>
		<style>

			.content {
				@apply --layout-vertical;
				padding: 15px 10px;
				background-color: var(--primary-background-color);
				border: 1px solid var(--ibm-gray-30);
				box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(contactRolesAppDropdownStyles, "triapp-contact-roles-app/styles/tristyles-contact-roles-app.js");