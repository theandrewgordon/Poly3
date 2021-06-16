/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

export function isEmptyArray(array) {
	return !array || !Array.isArray(array) || !array.length || array.length === 0;
}

export function computePercentageValue(x, total) {
	if (total > 0) {
		return parseFloat(x) / parseFloat(total) * 100;
	} else {
		return 0;
	}
};

export function round(x) {
	return Math.round(x * 100) / 100;
};

export function groupBy (data, prop1, prop2) {
	if (data && data.length > 0) {
		data.unshift( new Object() ); // first obj in array gets skipped and is assigned to 'groups'
		const grouped = data.reduce(function(groups, item) {
			let val = prop1 && prop2 ? item[prop1][prop2] : item[prop1];
			groups[val] = groups[val] || [];
			groups[val].push(item);
			return groups;
		});
		data.shift();
		return grouped;
	} else {
		return {};
	}
};

export function getOrgColor(orgPath, list) {
	const defaultColor = "#ff5003";

	if (list.length != 0) {
		const indexFound = list.findIndex(el => el.path == orgPath);
		return indexFound > -1 ? list[indexFound].fill : defaultColor;
	} else {
		return defaultColor;
	}
};

export function findBuildingFloorIndexes(spaceStack, stacks) {
	let building, floorIndex;
	const buildingIndex = stacks.buildings.findIndex(building => {
		return building._id == spaceStack.building.id;
	})
	if (buildingIndex != -1) {
		building = stacks.buildings[buildingIndex];
		floorIndex = building.floors.findIndex(floor => {
			return floor._id == spaceStack.floor.id;
		})
	}
	return [buildingIndex, floorIndex];
}

export function computeMismatch(spaceClass, supply, demand, type) {
	let supplyToCompare, demandToCompare;
	if (!supply[spaceClass]) {
		supplyToCompare = { count: 0, area: 0 };
	} else {
		supplyToCompare = {
			count: supply[spaceClass].count,
			area: supply[spaceClass].area
		}
	}

	if (!demand[spaceClass]) {
		demandToCompare = { count: 0, area: 0 };
	} else {
		demandToCompare = {
			count: demand[spaceClass].count,
			area: demand[spaceClass].area
		}
	}

	if (type == "count") {
		return [round(demandToCompare.count) > round(supplyToCompare.count), round(demandToCompare.count), round(supplyToCompare.count)];
	} else if (type == "area") {
		return [round(demandToCompare.area) > round(supplyToCompare.area), round(demandToCompare.area), round(supplyToCompare.area)];
	} else {
		return [false, 0, 0];
	}
}

export function calcAreaAndPercentage(spaces, area) {
	const stackArea = sumSpacesArea(spaces);
	const percentage = computePercentageValue(stackArea, area);
	return [stackArea, percentage];
}

export function sumSpaces(stacksOfSpaces) {
	const total = {};
	stacksOfSpaces.forEach(spaces => {
		Object.keys(spaces).forEach(spaceClass => {
			if (!total[spaceClass]) {
				total[spaceClass] = {
					area: spaces[spaceClass].area,
					assignable: spaces[spaceClass].assignable,
					uom: spaces[spaceClass].uom,
					count: spaces[spaceClass].count,
					spaceClassId: spaces[spaceClass].spaceClassId,
					spaceClass: spaceClass,
					spaceClassIdField: spaces[spaceClass].spaceClassIdField,
					building: spaces[spaceClass].building,
					floor: spaces[spaceClass].floor
				}
			} else {
				total[spaceClass].area += spaces[spaceClass].area;
				total[spaceClass].count += spaces[spaceClass].count;
			}
		});
	});
	return total;
}

export function sumSpacesArea(spaces) {
	let total = 0;
	Object.keys(spaces).forEach(spaceClass => {
		total += parseFloat(spaces[spaceClass].area);
	});
	return total;
}

export function calcDiscrepancy(floor, assignableSpacesOnly) {
	let hasDiscrepancy = false;
	const supply = assignableSpacesOnly ? floor.assignableSpaceSupply : floor.spaceSupply;
	const supplySpaceClasses = Object.keys(supply);
	const demand = sumSpaces(floor.stacks.map(stack => assignableSpacesOnly ? stack.assignableSpaces : stack.spaces));
	const demandSpaceClasses = Object.keys(demand);
	const allSpaceClasses = [...new Set([...supplySpaceClasses, ...demandSpaceClasses])];

	hasDiscrepancy = allSpaceClasses.some(spaceClass => {
		const countMismatch = computeMismatch(spaceClass, supply, demand, "count")[0];
		const areaMismatch = computeMismatch(spaceClass, supply, demand, "area")[0];
		return countMismatch || areaMismatch;
	})
	return hasDiscrepancy;
}

export function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

export function getFloorElem(event) {
	const floorElemIndex = event.composedPath().findIndex(el => {return el.nodeName == "TRICOMP-FLOOR-STACK"});
	let floorElem;
	if (floorElemIndex != -1) {
		floorElem = event.composedPath()[floorElemIndex];
	}
	return floorElem;
}

export function computeAllocationWidth(stack, assignableSpacesOnly, showToScale, floorArea, maxFloorArea) {
	let width = 0;
	if (stack.assignableSpacesAreaAllocated || stack.areaAllocated) {
		const stackArea = assignableSpacesOnly ? stack.assignableSpacesAreaAllocated : stack.areaAllocated;
		if (floorArea > 0 || showToScale && maxFloorArea > 0) {
			const totalArea = showToScale ? maxFloorArea : floorArea;
			width = computePercentageValue(stackArea, totalArea);
		} else {
			width = computePercentageValue(stackArea, maxFloorArea);
		}
	}
	return width;
}

export function compareOrgs(orgA, orgB) {
	const nameA = orgA.name.toUpperCase();
	const nameB = orgB.name.toUpperCase();

	if (nameA == nameB) return 0;
	return nameA < nameB ? -1 : 1;
}

export function isEquivalent(a, b) {
	if (!a || !b ) return false;
	let aProps = Object.getOwnPropertyNames(a);
	let bProps = Object.getOwnPropertyNames(b);

	if (aProps.length != bProps.length) {
		return false;
	}

	for (let i = 0; i < aProps.length; i++) {
		let propName = aProps[i];
		if (a[propName] !== b[propName]) {
			return false;
		}
	}
	return true;
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

export function formatNameForContact(contact) {
	let name = contact.name ? contact.name : "";
	let organization = contact.organization ? ", " + contact.organization : "";
	let email = contact.email ? ", " + contact.email : "";
	return name + "" + organization + "" + email;
}

export function computeExportFilename(disposition) {
	let filename = "";
	let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	let matches = filenameRegex.exec(disposition);
	if (matches != null && matches[1]) { 
		filename = matches[1].replace(/['"]/g, '');
		filename = filename.replace(/UTF\-8/g, '');
		filename = filename.replace(/\%20/g, ' ');
	}
	return filename;
}

export function removeDuplicates(arr1, arr2) {
	let newArray = [];
	arr1.forEach(item1 => {
		let index = arr2.map(item2 => item2._id).indexOf(item1._id);
		if(index == -1) newArray.push(item1);
	})
	return newArray;
}

export function generateExportCSV(headers, dataArray) {
	let csvContent = "data:text/csv;charset=utf-8,";
	csvContent += rowToCSV([...headers]);
	for(let item of dataArray) {
		let rowOutput = [];
		for (let prop in item) {
			rowOutput.push(getStringFromValue(item[prop]));	
		}
		csvContent += rowToCSV(rowOutput);
	}
	csvContent = encodeURI(csvContent);
	return csvContent;
}

function getStringFromValue(value) {
	if (!value) return '';

	if (typeof value === "object") {
		return value.value;
	} else {
		return value.toString();
	}

}

function rowToCSV(row) {
	var output = [];
	for (let prop in row) {
		let value = !row[prop] && row[prop] !== 0 ? '' : row[prop].toString();
		let result = value.replace(/"/g, '""');
		result = `"${result}"`;
		output.push(result);
	}
	return output.join(',') + "\r\n";
}

export function downloadFile(filename, source) {
	const a = document.createElement("a");
	a.href = source; 
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

export function computeContactsInvalid(stackPlan) {
	let contactsJSONInvalid = false;
	let contactsJSON = stackPlan.contactsJSON;
	if(contactsJSON && contactsJSON !== "null") {
		contactsJSONInvalid = checkForValidContactRows(JSON.parse(contactsJSON));
	}
	return contactsJSONInvalid;
}

export function checkForValidContactRows(contactRoles) {
	let count = 0;
	if(contactRoles && contactRoles.length) {
	contactRoles.forEach(contactRole => {
		if((contactRole.name == "" || contactRole.role == "") && !(contactRole.name == "" && contactRole.role == ""))
			count++;
	})
	}
	return count > 0;
}

export function computeStatusReadonly(authReadonly, statusENUS) {
	const editable = statusENUS === "Draft" || statusENUS === undefined || statusENUS === null;
	return authReadonly || !editable;
}

export function getCompleteIncomplete(contactRoles) {
	const incompletes = contactRoles.filter((contactRole, index) => {
		contactRole.pos = index;
		return (contactRole.name == "" || contactRole.role == "") && !(contactRole.name == "" && contactRole.role == "");
	});

	const completes = contactRoles.filter(contactRole => {
		return contactRole.name && contactRole.role;
	});

	return [completes, incompletes];
}