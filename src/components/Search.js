import React from 'react';
import { ScannerListener } from './';


function Search({queue, ss, bp, bg}) {

const [item, setItem] = React.useState({});


const onScan = async function(s){
	//add set search result
	let item = ss.getItemByScan(s);
	setItem(item);
}

const createItem = function(){
	return (
		<div >
		{item.man?item.man:'no man name'} #{item.pn?item.pn:'no part number'}<br/>
		{item.price?'Price: $'+item.price:'no price'} <br/>
		{item.msrp?'MSRP: $'+item.msrp:''} <br/>
		{item.own?'Owner: '+item.own:''} <br/>
		{item.dec?item.dec:'no decscription'} <br/>
		{item.det?item.det:''} <br/>
		In stock: {item.amt?+item.amt:'0'}<br/>
		</div>
	);
}

return(
    <div className="Search main">
		<ScannerListener onScan={onScan} />
		Search/Look-Up Mode.<br/>
		Make sure this window is in focus then scan barcode to get item information.<br/><br/>
		
		{createItem()}
    </div>
)
}
    


export default Search;