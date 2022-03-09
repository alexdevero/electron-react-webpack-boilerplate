import {GoogleSpreadsheet} from 'google-spreadsheet';
import 'regenerator-runtime/runtime';
const async = require('async');

/////////////////////////////////////////////////////
// EXTERNAL FUNCTIONS
/////////////////////////////////////////////////////

const init = function(config, auth){
	let task = new initTask(config, auth);
	queueTask(task);
}
const addItemByPN = function(partNumber, amount){
	let task = new addTask(partNumber, amount);
	queueTask(task);
}

const Spreadsheet = function(){
	return ({
		init:init,
		addItemByPN:addItemByPN,
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

const addTask = function(pn, amt){
	this.type = 'add';
	this.pn = pn;
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
			await addPN(task.pn, task.amt);
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

let invPnToRow = {};

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
		
		console.log("Loading inventory...");
	
		await invWorksheet.loadCells({
			"startRowIndex": 1,
			"endRowIndex": invWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": invWorksheet.columnCount
		});
		
		let c = invHeaderNameToIndex["Part Number"];
		for(let r = 1; r < invWorksheet.rowCount; r++){
			let cell = invWorksheet.getCell(r,c);
			if(cell.value == null)
				continue;
			invPnToRow[cell.value] = r;
		}
		
		console.log("Done.");
		
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
	
}

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

const addPN = async function(partNumber, amount){
	try{
		let r = invPnToRow[partNumber];
		let cell;
		if(r == null){
			//low on space add rows
			r = Object.keys(invPnToRow).length + 1;
			if(r == invWorksheet.rowCount){
				await invWorksheet.resize({
					rowCount: invWorksheet.rowCount + 100, 
					columnCount: invWorksheet.columnCount
				});
			}
			
			//new item create entry
			invPnToRow[partNumber] = r;
			cell = invWorksheet.getCell(r, invHeaderNameToIndex["Part Number"]);
			cell.value = partNumber;
			
		}
		
		cell = invWorksheet.getCell(r, invHeaderNameToIndex["Quantity"]);
		cell.value += amount;
		
		await invWorksheet.saveUpdatedCells();
		console.log('added');
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
}






