const parse = function(input){
	let barcodeID = input.substr(0,1);
	let barcode = input.substr(1);
	let parser = idToParser[barcodeID];
	
	if(parser == null){
		parser = parseUnknown;
	}
	
	return parser(barcode);
	
}

const BarcodeParser = function(){
	return ({
		parse
	});
}

export default BarcodeParser;

const parseUnknown = function(unknownBarcode){
	return ({
		id:null,
		pn:null,
		barcode:unknownBarcode
	});
}

const parseUPCA = function(upcaBarcode){
	return ({
		id:upcaBarcode.substr(1,5),
		pn:upcaBarcode.substr(6,5),
		barcode:upcaBarcode
	});
}

const parseEAN13 = function(ean13Barcode){
	return ({
		id:ean13Barcode.substr(1,6),
		pn:ean13Barcode.substr(7,5),
		barcode:ean13Barcode
	});
}

const idToParser = {
	'b' : parseUPCA, // UPC-A
	//  12 digits total
	// [0] 0,1,6,7, or 8
	// [1-5] manufacture id
	// [6-10] product number
	// [11] end buffer number
	'e' : parseEAN13, // EAN-13
	//  13 digits total
	// [0] country code
	// [1-6] manufacture id
	// [7-11] product number
	// [12] end buffer number
	
};

