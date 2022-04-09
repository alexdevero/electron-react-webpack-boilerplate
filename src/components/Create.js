import React from 'react';
import { ScannerListener } from './';
import './index.css';

function Create({queue, ss, bp, bg}) {

const [man, setMan] = React.useState('0000000000');
const [pn, setPn] = React.useState('');
const [bar, setBar] = React.useState({});
const [amt, setAmt] = React.useState(1);
const [msg, setMsg] = React.useState('');

const onScan = function(s){
	let b = bp.parse(s);
	setBar(b);
	if(b.pn){
		setPn(b.pn);
	}
	if(b.id  && ss.idToMan[b.id]){
		setMan(b.id);
	}
}

const print = function(){
	//pn value checks
	if(pn == null){
		setMsg('Error: Part number must be given. You gave: '+pn);
		return;
	}
	//man value checks
	if(man == null ||  man.toString().trim().length > 6){
		setMsg('Error: Potentially unknown manufacturerID ('+man+')');
		return;
	}
	//amt sanity check
	if(amt == null || amt < 1){
		setMsg('Error: Potentially negative quantity. ('+amt+')');
		return;
	}
	//construct barcode value
	let barcode = '';
	if(bar.pre){
		barcode += bar.pre;
	}
	barcode += ';';
	barcode += man;
	barcode += ';';
	barcode += pn;
	barcode += ';';
	if(bar.post){
		barcode += bar.post;
	}
	
	console.log(barcode);
	//print barcode
	for(let i = 0; i < amt; i++){
		queue.queueTask(bg.print, [barcode]);
	}
	
	
	setMsg('Print Requested: '+amt+' - '+ss.idToMan[man]+' #'+pn);
	setPn('');
	setMan('0000000000');
	setAmt(1);
	setBar({});
}

const createOptions = function(){
	let options = [];
	let ids = Object.keys(ss.idToMan);
	for(let i = 0; i < ids.length; i++){
		options.push(
			<option key={ids[i]} value={ids[i]}>
				{ss.idToMan[ids[i]]}
			</option>
		);
	}
	return options;
}

return(
    <div className="Create main">
		<ScannerListener onScan={onScan} />
		Manufacturer<br/>
		<select value = {man} onChange={(e) => setMan(e.target.value)}>
			<option value='0000000000000'>---</option>
			{createOptions()}
		</select><br/>
		Part Number<br/>
		<input type="text" value={pn} onChange={(e) => setPn(e.target.value)}></input><br/>
		Quantity<br/>
		<input type="number" value={amt} min="1" onChange={(e) => setAmt(e.target.value)}></input><br/>
		<button onClick={()=>print()}>Print</button><br/>
		{msg}<br/><br/>
		Create a barcode.<br/>
		Usage:<br/>
		Select a Manufacturer, enter part number, then print<br/>
		--or--<br/>
		Scan an existing barcode, then print<br/><br/>
		Potential Complications:<br/>
		If Manufacturer drop down is not showing, do not refresh! Try swapping to another tab and returning.<br/>
		If manufacturer is not in list, add manufacturer and manufacturerID to Google Sheets.<br/>
		If part number is greater than 5 digits, truncate leading digits?<br/>
		
		
    </div>
)
}



export default Create;