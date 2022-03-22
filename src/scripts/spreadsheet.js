import {GoogleSpreadsheet} from 'google-spreadsheet';
import 'regenerator-runtime/runtime';
import BarcodeParser from '../scripts/BarcodeParser.js';

const bp = BarcodeParser();

let invWorksheet;
let invHeaderIndexToName = [];
let invHeaderNameToIndex = {};
let invBCToRow = {};

let siWorksheet;
let siHeaderIndexToName = [];
let siHeaderNameToIndex = {};
let siBCToRow = {};

let manWorksheet;
let manHeaderIndexToName = [];
let manHeaderNameToIndex = {};
let manToID = {};
let idToMan = {};

const customPre = 27;


//params is [config, auth]
const init = async function(params){
	try{
		let doc = new GoogleSpreadsheet(params[0].spreadsheet_id);
		
		console.log("Authenticating...");
		await doc.useServiceAccountAuth(params[1]);
		
		console.log("Loading document information...");
		await doc.getInfo();
		invWorksheet = doc.sheetsByTitle["Inventory"];
		siWorksheet = doc.sheetsByTitle["Special Inventory"];
		manWorksheet = doc.sheetsByTitle["Manufacturers"];
		
		console.log("Loading Cells...");
		await invWorksheet.loadCells({
			"startRowIndex": 0,
			"endRowIndex": invWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": invWorksheet.columnCount
		});
		
		await siWorksheet.loadCells({
			"startRowIndex": 0,
			"endRowIndex": siWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": siWorksheet.columnCount
		});
		
		await manWorksheet.loadCells({
			"startRowIndex": 0,
			"endRowIndex": manWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": manWorksheet.columnCount
		});
		
		console.log("Mapping Headers/Columns...");
		
		let cell;
		for(let i = 0; i < invWorksheet.columnCount; i++){
			cell = invWorksheet.getCell(0,i);
			if(cell.value == null)
				break;
			invHeaderNameToIndex[cell.value] = i;
            invHeaderIndexToName[i] = cell.value;
		}
		for(let i = 0; i < siWorksheet.columnCount; i++){
			cell = siWorksheet.getCell(0,i);
			if(cell.value == null)
				break;
			siHeaderNameToIndex[cell.value] = i;
            siHeaderIndexToName[i] = cell.value;
		}
		for(let i = 0; i < manWorksheet.columnCount; i++){
			cell = manWorksheet.getCell(0,i);
			if(cell.value == null)
				break;
			manHeaderNameToIndex[cell.value] = i;
            manHeaderIndexToName[i] = cell.value;
		}
		
		console.log("Mapping Rows...");
		//invBCToRow
		let c = invHeaderNameToIndex["Barcode Number"];
		for(let r = 1; r < invWorksheet.rowCount; r++){
			cell = invWorksheet.getCell(r,c);
			if(cell.value == null)
				continue;
			invBCToRow[cell.value] = r;
		}
		//siBCToRow
		c = siHeaderNameToIndex["Barcode Number"];
		for(let r = 1; r < siWorksheet.rowCount; r++){
			cell = siWorksheet.getCell(r,c);
			if(cell.value == null)
				continue;
			siBCToRow[cell.value] = r;
		}
		
		//man <-> id
		let cMan = manHeaderNameToIndex["Manufacturer"];
		let cManID = manHeaderNameToIndex["ManufacturerID"];
		for(let r = 1; r < manWorksheet.rowCount; r++){
			let cellMan = manWorksheet.getCell(r,cMan);
			let cellManID = manWorksheet.getCell(r,cManID);
			if(cellMan.value == null || cellManID.value == null)
				continue;
			manToID[cellMan.value] = cellManID.value;
			idToMan[cellManID.value] = cellMan.value;
		}
		
		console.log("Done.");
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
	
}


/*
const getItemByPN = function(partNumber){
	let r = invPnToRow[partNumber];
	if(r == null)
		return null;
	
	let item = {};
	
	for(let c = 0; c < invHeaderIndexToName.length; c++){
		let cell = invWorksheet.getCell(r,c);
		if(cell.value == null)
			continue;
		item[invHeaderIndexToName[c]] = cell.value;
	}
	return item;
}
*/

//params is [scanInput]
const addItemByScan = async function(params){
	
	try{
		let data = bp.parse(params[0]);
		let barcode = data.barcode;
		
		if(data.pre == customPre){
			
			let r = siBCToRow[barcode];
			if(r == null){
				//can only add custom items by scan if they exist
				return;
			}
			
			let cell = siWorksheet.getCell(r, siHeaderNameToIndex["Quantity"]);
			cell.value = 1;
			
			await siWorksheet.saveUpdatedCells();
			return;
		}
		
		if(data.pre && data.id && data.pn && data.post){
			barcode = data.pre + data.id + data.pn + data.post;
		}
		let r = invBCToRow[barcode];
		
		if(r == null){
			//New Item
			//low on space add rows
			r = Object.keys(invBCToRow).length + 1;
			if(r == invWorksheet.rowCount){
				await invWorksheet.resize({
					rowCount: invWorksheet.rowCount + 100, 
					columnCount: invWorksheet.columnCount
				});
				await invWorksheet.loadCells({
					"startRowIndex": 1,
					"endRowIndex": invWorksheet.rowCount,
					"startColumnIndex": 0,
					"endColumnIndex": invWorksheet.columnCount
				});
			}
			
			//add to dictionary
			invBCToRow[barcode] = r;
		}
		
		//populate entry
		let cell = invWorksheet.getCell(r, invHeaderNameToIndex["Barcode Number"]);
		if(cell.value == null || cell.value == ''){
			cell.value = barcode;
		}
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["ManufacturerID"]);
		if(data.id && (cell.value == null || cell.value == '')){
			cell.value = data.id;
		}
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["Manufacturer"]);
		if(data.id && idToMan[data.id] && (cell.value == null || cell.value == '')){
			cell.value = idToMan[data.id];
		}
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["Part Number"]);
		if(data.pn && (cell.value == null || cell.value == '')){
			cell.value = data.pn;
		}
		
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["Quantity"]);
		cell.value += 1;
		
		await invWorksheet.saveUpdatedCells();
		console.log('added');
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
}

//params is [scanInput]
const removeItemByScan = async function(params){
	
	try{
		let data = bp.parse(params[0]);
		let barcode = data.barcode;
		//custom inventory removal
		if(data.pre == customPre){
			
			let r = siBCToRow[barcode];
			if(r == null){
				//item does not exist
				return;
			}
			
			let cell = siWorksheet.getCell(r, siHeaderNameToIndex["Quantity"]);
			if(cell.value > 0){
				cell.value -= 1;
			}
			
			await siWorksheet.saveUpdatedCells();
			return;
		}
		
		if(data.pre && data.id && data.pn && data.post){
			barcode = data.pre + data.id + data.pn + data.post;
		}
		let r = invBCToRow[barcode];
		if(r == null){
			//item does not exist
			return;
		}
		
		let cell = invWorksheet.getCell(r, invHeaderNameToIndex["Quantity"]);
		if(cell.value > 0){
			cell.value -= 1;
		}
		
		await invWorksheet.saveUpdatedCells();
		
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
}


//params is [itemInfo]
const addCustomItem = async function(params){
	
	try{
		//low on space add rows
		let r = Object.keys(siBCToRow).length + 1;
		if(r == siWorksheet.rowCount){
			await siWorksheet.resize({
				rowCount: siWorksheet.rowCount + 100, 
				columnCount: siWorksheet.columnCount
			});
			await siWorksheet.loadCells({
				"startRowIndex": 1,
				"endRowIndex": siWorksheet.rowCount,
				"startColumnIndex": 0,
				"endColumnIndex": siWorksheet.columnCount
			});
		}
		
		//add to dictionary
		siBCToRow[params[0].barcode] = r;
		
		//populate entry
		let cell = siWorksheet.getCell(r, siHeaderNameToIndex["Barcode Number"]);
		if(cell.value == null || cell.value == ''){
			cell.value = params[0].barcode;
		}
		cell = siWorksheet.getCell(r, siHeaderNameToIndex["Manufacturer"]);
		if(params[0].man && idToMan[params[0].man] && (cell.value == null || cell.value == '')){
			cell.value = idToMan[params[0].man];
		}
		cell = siWorksheet.getCell(r, siHeaderNameToIndex["Part Number"]);
		if(params[0].pn && (cell.value == null || cell.value == '')){
			cell.value = params[0].pn;
		}
		cell = siWorksheet.getCell(r, siHeaderNameToIndex["Owner"]);
		if(params[0].own && (cell.value == null || cell.value == '')){
			cell.value = params[0].own;
		}
		cell = siWorksheet.getCell(r, siHeaderNameToIndex["Price"]);
		if(params[0].price && (cell.value == null || cell.value == '')){
			cell.value = params[0].price;
		}
		cell = siWorksheet.getCell(r, siHeaderNameToIndex["Description"]);
		if(params[0].dec && (cell.value == null || cell.value == '')){
			cell.value = params[0].dec;
		}
		cell = siWorksheet.getCell(r, siHeaderNameToIndex["Details"]);
		if(params[0].det && (cell.value == null || cell.value == '')){
			cell.value = params[0].det;
		}
		
		
		
		cell = siWorksheet.getCell(r, siHeaderNameToIndex["Quantity"]);
		cell.value = 1;
		
		await siWorksheet.saveUpdatedCells();
		console.log('added');
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
}

const getUniqueCustomBarcode = function(pn){
	//construct barcode value
	let postStr = ';'+pn+';';
	for(let i = 0; i < 1000000; i++){
		let preStr = customPre+';'+i;
		if(!siBCToRow[preStr+postStr]){
			return preStr+postStr;
		}
	}
	return null;
}

const getItemByScan = function(scanInput){
	try{
		let data = bp.parse(scanInput);
		let item = {};
		let barcode = data.barcode;
		//custom inventory search
		if(data.pre == customPre){
			
			let r = siBCToRow[barcode];
			
			if(r == null){
				//item does not exist
				return item;
			}
			
			let cell = siWorksheet.getCell(r, siHeaderNameToIndex["Manufacturer"]);
			if(cell.value && cell.value != ''){
				item.man = cell.value;
			}
			cell = siWorksheet.getCell(r, siHeaderNameToIndex["Part Number"]);
			if(cell.value && cell.value != ''){
				item.pn = cell.value;
			}
			cell = siWorksheet.getCell(r, siHeaderNameToIndex["Quantity"]);
			if(cell.value && cell.value != ''){
				item.amt = cell.value;
			}
			cell = siWorksheet.getCell(r, siHeaderNameToIndex["Owner"]);
			if(cell.value && cell.value != ''){
				item.own = cell.value;
			}
			cell = siWorksheet.getCell(r, siHeaderNameToIndex["Price"]);
			if(cell.value && cell.value != ''){
				item.price = cell.value;
			}
			cell = siWorksheet.getCell(r, siHeaderNameToIndex["Description"]);
			if(cell.value && cell.value != ''){
				item.dec = cell.value;
			}
			cell = siWorksheet.getCell(r, siHeaderNameToIndex["Details"]);
			if(cell.value && cell.value != ''){
				item.det = cell.value;
			}
			
			return item;
		}
		if(data.pre && data.id && data.pn && data.post){
			barcode = data.pre + data.id + data.pn + data.post;
		}
		let r = invBCToRow[barcode];
		
		if(r == null){
			//item does not exist
			return item;
		}
		
		let cell = invWorksheet.getCell(r, invHeaderNameToIndex["Manufacturer"]);
		if(cell.value && cell.value != ''){
			item.man = cell.value;
		}
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["Part Number"]);
		if(cell.value && cell.value != ''){
			item.pn = cell.value;
		}
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["Quantity"]);
		if(cell.value && cell.value != ''){
			item.amt = cell.value;
		}
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["MSRP"]);
		if(cell.value && cell.value != ''){
			item.msrp = cell.value;
		}
		//cell = invWorksheet.getCell(r, invHeaderNameToIndex["Price"]);
		//if(cell.value && cell.value != ''){
		//	item.price = cell.value;
		//}
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["Description"]);
		if(cell.value && cell.value != ''){
			item.dec = cell.value;
		}
		return item;
		
		
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
}

const Spreadsheet = function(){
	return ({
		init,
		addItemByScan,
		idToMan,
		manToID,
		addCustomItem,
		getUniqueCustomBarcode,
		removeItemByScan,
		getItemByScan
	});
}

export default Spreadsheet;



