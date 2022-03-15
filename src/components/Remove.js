import React from 'react';
import { ScannerListener } from './';


function Remove({queue, ss, bp, bg}) {

const [hist, setHist] = React.useState([]);
const MAX_LEN = 25;

//object generator for scans
const ScanRecord = function(s){
	let data = bp.parse(s);
	this.pn = data.pn;
	this.id = data.id;
	this.time = new Date();
	//TODO: extract info from spreadsheet?
}

const onScan = function(s){
	//add task
	queue.queueTask(ss.removeItemByScan, [s]);
	//update history
	setHist(arr => {
		let temp = [new ScanRecord(s), ... arr];
		if(temp.length > MAX_LEN){
			temp = temp.slice(0,MAX_LEN);
		}
		return temp;
	});
	
	
}

const createRecord = function(scanRecord){
	return (
		<div key={scanRecord.time.getTime()}>
		removed  #{scanRecord.pn} @ {scanRecord.time.toLocaleTimeString("en-US")}
		</div>
	);
}

const createHist = function(){
	return hist.map(createRecord);
}

return(
    <div className="Add main">
		<ScannerListener onScan={onScan} />
		Check-Out/Remove Mode.<br/>
		Make sure this window is in focus then scan barcode to decrement item quantity by 1.<br/><br/>
		Last scans:<br/>
		{createHist()}
    </div>
)
}
    


export default Remove;