import React from 'react';
import Spreadsheet from '../scripts/Spreadsheet.js';
import AsyncTaskQueue from '../scripts/AsyncTaskQueue.js';
import BarcodeParser from '../scripts/BarcodeParser.js';
const bp = BarcodeParser();
import BarcodeGenerator from '../scripts/BarcodeGenerator.js';
const bg = BarcodeGenerator();

const config = require('../config/config.json');
const auth = require('../config/Inventory-System-Auth.json');

import '../assets/css/App.css'

import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Navbar, ScannerListener, Add, Create, Custom, Remove, Search } from './';

function App() {
	//const [scan, setScan] = React.useState('');
	const [ss, setSS] = React.useState(Spreadsheet());
	const [queue, setQueue] = React.useState(AsyncTaskQueue());
	
	//init sheet once
	React.useEffect(() => {
		queue.queueTask(ss.init, [config, auth]);
	},[]);
	
	return (
	<HashRouter>
		
		<Navbar />
		
		<Routes>
			<Route path='' element={
				<Navigate to='add' />
			}/>
			
			<Route path='/add' element={<>
				<Add queue={queue} ss={ss} bg={bg} bp={bp}/> 
			</>} />
			
			<Route path='/create' element={<>
				<Create queue={queue} ss={ss} bg={bg} bp={bp}/> 
			</>} />
			
			<Route path='/custom' element={<>
				<Custom queue={queue} ss={ss} bg={bg} bp={bp}/> 
			</>} />
			
			<Route path='/remove' element={<>
				<Remove queue={queue} ss={ss} bg={bg} bp={bp}/> 
			</>} />
			
			<Route path='/search' element={<>
				<Search queue={queue} ss={ss} bg={bg} bp={bp}/> 
			</>} />
			
		
		</Routes>
		
	</HashRouter>
	
		
	)
}
//
export default App
