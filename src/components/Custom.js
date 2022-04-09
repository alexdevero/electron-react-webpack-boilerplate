import React from 'react';
import { ScannerListener } from './';
import './index.css';

function Custom({queue, ss, bp, bg}) {

const [man, setMan] = React.useState('0000000000');
const [pn, setPn] = React.useState('');
const [own, setOwn] = React.useState('Upland Trians');
const [dec, setDec] = React.useState('');
const [det, setDet] = React.useState('');
const [price, setPrice] = React.useState('');

const [msg, setMsg] = React.useState('');

const [bar, setBar] = React.useState({});

const onScan = function(s){
	let b = bp.parse(s);
	setBar(b);
	if(b.pn){
		setPn(b.pn);
	}
	if(b.id && ss.idToMan[b.id]){
		setMan(b.id);
	}
	//TODO auto fill as much as possible
}

const addAndPrint = function(){
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
	//construct barcode value
	let barcode = ss.getUniqueCustomBarcode(pn);
	console.log(barcode);
	
	//print barcode
	queue.queueTask(bg.print, [barcode]);
	
	//add item to special inventory
	queue.queueTask(ss.addCustomItem, [{
		barcode,
		man,
		pn,
		own,
		price,
		dec,
		det
	}]);
	
	setMsg('Print Requested: '+ss.idToMan[man]+' #'+pn);
	
	//clear some fields
	setPn('');
	setMan('0000000000');
	setBar({});
	setDec('');
	
	
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
    <div className="Custom main">
		<ScannerListener onScan={onScan} />
		Manufacturer<br/>
		<select value = {man} onChange={(e) => setMan(e.target.value)}>
			<option value='0000000000000'>---</option>
			{createOptions()}
		</select><br/>
		Part Number<br/>
		<input type="text" value={pn} onChange={(e) => setPn(e.target.value)}></input><br/>
		Owner<br/>
		<input type="text" value={own} onChange={(e) => setOwn(e.target.value)}></input><br/>
		Price<br/>
		<input type="number" value={price} min="0" step="any" onChange={(e) => setPrice(e.target.value)}></input><br/>
		Product Details (Condition etc)<br/>
		<textarea placeholder="Details" onChange={(e) => setDet(e.target.value)} value={det}></textarea><br/>
		Product Description (What was it new?)<br/>
		<textarea placeholder="Description" onChange={(e) => setDec(e.target.value)} value={dec}></textarea><br/><br/>
		<button onClick={()=>addAndPrint()}>Add and Print</button><br/>
		{msg}<br/><br/>
		Create a custom barcode.<br/>
		Usage:<br/>
		Fill in manually, then add and print.<br/>
		--or--<br/>
		Scan an existing barcode to try to autofill some info.<br/><br/>
		Potential Complications:<br/>
		If Manufacturer drop down is not showing, do not refresh! Try swapping to another tab and returning.<br/>
		If manufacturer is not in list, add manufacturer and manufacturerID to Google Sheets.<br/>
		
		
    </div>
)
}
    


export default Custom;