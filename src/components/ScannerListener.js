import React from 'react';


const prefix = '`';
const suffix = 'Enter';


function ScannerListener({onScan}) {
    
	const [input, _setInput] = React.useState('');
	const inputRef = React.useRef(input);
	const setInput = (i) => {
		inputRef.current = i;
		_setInput(i);
	}
	
	const [time, _setTime] = React.useState(0);
	const timeRef = React.useRef(time);
	const setTime = (t) => {
		timeRef.current = t;
		_setTime(t);
	}
	
	const inputHandler = function(e){
		if(e.key == 'Enter'){
			e.preventDefault();
		}
		
		if(e.key == prefix){
			setInput(inputRef.current.substr(-1));
			setTime(Date.now());
		}else if(e.key == suffix){
			//scan should be input fast
			if(Date.now() - timeRef.current < 200){
				onScan(inputRef.current);
			}
			//reset
			setInput('');
			setTime(0);
		}else if(timeRef.current > 0){
			setInput(inputRef.current + e.key);
		}else{
			setInput(e.key);
		}
	}
	
	//add event listener once
	React.useEffect(() => {
		// Make sure element supports addEventListener
		const isSupported = window && window.addEventListener;
		if (!isSupported) return;

		// Add event listener
		window.addEventListener('keydown', inputHandler);
		
		return (() => {
			window.removeEventListener('keydown', inputHandler);
		})
		
	},[]);

	return(<></>)
}
    


export default ScannerListener;