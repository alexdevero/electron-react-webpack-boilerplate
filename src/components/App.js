import React from 'react';
import Spreadsheet from '../scripts/spreadsheet.js';

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
	
	
	
	const onScan = function(s){
		ss.addItemByPN(s);
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
