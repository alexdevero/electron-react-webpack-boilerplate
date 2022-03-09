import React from 'react';
import Spreadsheet from '../scripts/Spreadsheet.js';


const config = require('../config/config.json');
const auth = require('../config/Inventory-System-Auth.json');

import '../assets/css/App.css'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, ScannerListener } from './';

//

function App() {
	const [scan, setScan] = React.useState('');
	const [ss, setSS] = React.useState(Spreadsheet());
	
	//init sheet once
	React.useEffect(() => {
		ss.init(config, auth);
	},[]);
	
	//<a href="https://www.barcodesinc.com/generator/"><img src="https://www.webarcode.com/barcode/image.php?code=022081230107&type=C128B&xres=1&height=50&width=206&font=3&output=png&style=197" alt="the barcode printer: free barcode generator" border="0"></a>
	
	const onScan = function(s){
		ss.addItemByScan(s);
		setScan(s);
	}
	
	return (
	<BrowserRouter><div className="app">
		
		<Navbar />
		<ScannerListener onScan={onScan} />
		
		<div className='app'>
			<h1>React Electron Boilerplate</h1>
			<p>Last Scan: {scan}</p>
	</div>
		
	</div></BrowserRouter>
	
		
	)
}
//<Routes>
		//	<Route path='/' element={<>
		//		<Searchbar searchBarValue={searchBarValue} onSearch={onSearch}/>
		//		
		//	</>} />
		//	
		//	<Route path='/search' element={<>
		//		<ProfileHome />
		//	</>} />
		//
		//	
		//	<Route path='/add' element={<>
		//		<ProfileEdit userAuth={userAuth} /> 
		//	</>} />
		//
		//</Routes>
export default App
