import {GoogleSpreadsheet} from 'google-spreadsheet';
import 'regenerator-runtime/runtime';
const async = require('async');


import BarcodeParser from '../scripts/BarcodeParser.js';
const bp = BarcodeParser();

/////////////////////////////////////////////////////
// EXTERNAL FUNCTIONS
/////////////////////////////////////////////////////

const init = function(config, auth){
	let task = new initTask(config, auth);
	queueTask(task);
}
const addItemByScan = function(scanInput, amount){
	let task = new addTask(scanInput, amount);
	queueTask(task);
}

const Spreadsheet = function(){
	return ({
		init,
		addItemByScan,
	});
}

export default Spreadsheet;

//////////////////////////////////////////////////
//INTERNAL FUNCTIONS
//////////////////////////////////////////////////

//object generators for task to que
const initTask = function(config, auth){
	this.type = 'init';
	this.config = config;
	this.auth = auth;
}

const addTask = function(scan, amt){
	this.type = 'add';
	this.scan = scan;
	this.amt = amt ? amt : 1;
}

// function run on queued tasks
const queue = async.queue(async (task, callback) => {
	console.log("Processing task: " + task.type);
	switch(task.type){
		case 'init':
			await load(task.config, task.auth);
			break;
		case 'add':
			await addScan(task.scan, task.amt);
			break;
		default:
			console.log('Error: Spreadsheet queue recieved unknown task.');
	}
	callback(null, {task});
}, 1);

//add tasks to que
const queueTasks = function(tasks){
	queue.push(tasks, (err, {task}) => {
		if(err){
			console.log('An error occurred while processing task: ' + task.type);
			return;
		}
		console.log('Finished task: ' + task.type);
	});
}

const queueTask = function(task){
	queueTasks([task]);
}

//call when que has nothing to run
queue.drain(() => {
   console.log('All items are succesfully processed !');
});

let docInfo;

let invWorksheet;
let invHeaderIndexToName = [];
let invHeaderNameToIndex = {};

let invBCToRow = {};

let catWorksheet;
let catHeaderIndexToName = [];
let catHeaderNameToIndex = {};

let oidToOwner = [];
let cidToCondition = [];
let midToManufacturer = {};

const load = async function(config, auth){
	try{
		let doc = new GoogleSpreadsheet(config.spreadsheet_id);
		console.log("Authenticating...");
		await doc.useServiceAccountAuth(auth);
		console.log("Loading document information...");
		await doc.getInfo();
		docInfo = doc;
		
		invWorksheet = doc.sheetsByTitle["Inventory"];
		console.log("Loading inventory headers...");
		await invWorksheet.loadCells({
			"startRowIndex": 0,
			"endRowIndex": 1,
			"startColumnIndex": 0,
			"endColumnIndex": invWorksheet.columnCount
		});
		
		for(let i = 0; i < invWorksheet.columnCount; i++){
			let cell = invWorksheet.getCell(0,i);
			if(cell.value == null)
				break;
			invHeaderNameToIndex[cell.value] = i;
            invHeaderIndexToName[i] = cell.value;
		}
		
		catWorksheet = doc.sheetsByTitle["Categories"];
		console.log("Loading categories headers...");
		await catWorksheet.loadCells({
			"startRowIndex": 0,
			"endRowIndex": 1,
			"startColumnIndex": 0,
			"endColumnIndex": catWorksheet.columnCount
		});
		
		for(let i = 0; i < catWorksheet.columnCount; i++){
			let cell = catWorksheet.getCell(0,i);
			if(cell.value == null)
				break;
			catHeaderNameToIndex[cell.value] = i;
            catHeaderIndexToName[i] = cell.value;
		}
		
		console.log("Loading inventory...");
	
		await invWorksheet.loadCells({
			"startRowIndex": 1,
			"endRowIndex": invWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": invWorksheet.columnCount
		});
		
		console.log("Loading categories...");
	
		await catWorksheet.loadCells({
			"startRowIndex": 1,
			"endRowIndex": catWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": catWorksheet.columnCount
		});
		
		
		//invBCToRow
		let c = invHeaderNameToIndex["Barcode Number"];
		for(let r = 1; r < invWorksheet.rowCount; r++){
			let cell = invWorksheet.getCell(r,c);
			if(cell.value == null)
				continue;
			invBCToRow[cell.value] = r;
		}
		
		//oidToOwner
		c = catHeaderNameToIndex["OwnerID"];
		for(let r = 1; r < catWorksheet.rowCount; r++){
			let cell = catWorksheet.getCell(r,c);
			if(cell.value == null)
				break;
			oidToOwner[cell.value] = catWorksheet.getCell(r,c+1).value;
		}
		//cidToCondition
		c = catHeaderNameToIndex["ConditionID"];
		for(let r = 1; r < catWorksheet.rowCount; r++){
			let cell = catWorksheet.getCell(r,c);
			if(cell.value == null)
				break;
			cidToCondition[cell.value] = catWorksheet.getCell(r,c+1).value;
		}
		//midToManufacturer
		c = catHeaderNameToIndex["ManufacturerID"];
		for(let r = 1; r < catWorksheet.rowCount; r++){
			let cell = catWorksheet.getCell(r,c);
			if(cell.value == null)
				break;
			midToManufacturer[cell.value] = catWorksheet.getCell(r,c+1).value;
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

const addScan = async function(scanInput, amount){
	try{
		let data = bp.parse(scanInput);
		let r = invBCToRow[data.barcode];
		let cell;
		
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
			invBCToRow[data.barcode] = r;
			//insert barcode
			cell = invWorksheet.getCell(r, invHeaderNameToIndex["Barcode Number"]);
			cell.value = data.barcode;
			if(data.pn){
				cell = invWorksheet.getCell(r, invHeaderNameToIndex["Part Number"]);
				cell.value = data.pn;
			}
			if(data.id){
				cell = invWorksheet.getCell(r, invHeaderNameToIndex["Manufacturer"]);
				let m = data.id;
				if(midToManufacturer[data.id]){
					m = midToManufacturer[data.id];
				}
				cell.value = m;
			}
			
		}
		
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["Quantity"]);
		cell.value += amount;
		
		await invWorksheet.saveUpdatedCells();
		console.log('added');
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
}






