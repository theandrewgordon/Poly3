export function shiftRequiredRolesInFront(contactRoles) {
	let output = contactRoles;
	if(contactRoles && contactRoles.length > 0) {
		let requiredList = [];
		let nonRequiredList = [];
		contactRoles.forEach(contactRole => {
			const isRequired = contactRole.required;
			if (isRequired) {
				requiredList.push(contactRole);
			} else {
				nonRequiredList.push(contactRole);
			}
		})
		output = [...requiredList, ...nonRequiredList];
	}
	return output;
}

export function formatNameForContact(contact) {
	let name = contact.name ? contact.name : "";
	let organization = contact.organization ? ", " + contact.organization : "";
	let email = contact.email ? ", " + contact.email : "";
	return name + "" + organization + "" + email;
}

export function computeNonEmptyContactRolesCount(contactRoles) {
	let count = 0;
	if(contactRoles && contactRoles.length > 0) {
		contactRoles.forEach(contact => {
			if(contact.role != "" || contact.name != "") count++;
		})
	}
	return count;
};

export function isEmptyArray(array) {
	return !array || !Array.isArray(array) || !array.length || array.length === 0;
}

export function computeRoleRequired(roleRequirement, linkedBusinessObject, linkedForm, recordBusinessObject, recordForm) {
	if (linkedForm) {
		return roleRequirement !== "Available But Not Required" && linkedBusinessObject === recordBusinessObject && linkedForm === recordForm;
	} else {
		return roleRequirement !== "Available But Not Required" && linkedBusinessObject === recordBusinessObject;
	}
}

export function getUniqueId() {
	return new Date().valueOf().toString(36) + Math.random().toString(36).substring(2);
}