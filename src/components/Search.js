import React from 'react';
import { ScannerListener } from './';
import './index.css';


function Search({queue, ss, bp, bg}) {

const [item, setItem] = React.useState({});


const onScan = async function(s){
	//add set search result
	let item = ss.getItemByScan(s);
	setItem(item);
}

const createItem = function(){
	let parts = [];
	for(let [name, val] of Object.entries(item)){
		
		if(typeof(val) == 'string' || typeof(val) == 'number'){
			parts.push(
				<div key={name}>
					{name}<br/>
					<textarea onChange={(e) => {
							let newItem = {
								... item
							}
							newItem[name] = e.target.value;
							setItem(newItem);
					}} value={item[name]}></textarea><br/>
					
				</div>
			);
		}
	}
	return parts;
}

const save = function(){
	queue.queueTask(ss.updateItem, [item]);
}

return(
    <div className="Search main">
		<ScannerListener onScan={onScan} />
		Search/Edit Mode.<br/>
		Make sure this window is in focus then scan barcode to get item information.<br/><br/>
		
		{createItem()}<br/>
		
		<button onClick={()=>save()}>Save</button><br/>
		
    </div>
)
}
    


export default Search;