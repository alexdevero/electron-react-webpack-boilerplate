const Dymo = require('dymojs');
const dymo = new Dymo();

//params is [barcode]
const print = async function(params){
	
	try{
		const labelXml = `<?xml version="1.0" encoding="utf-8"?>
<DesktopLabel Version="1">
  <DYMOLabel Version="3">
    <Description>DYMO Label</Description>
    <Orientation>Landscape</Orientation>
    <LabelName>Address30251</LabelName>
    <InitialLength>0</InitialLength>
    <BorderStyle>SolidLine</BorderStyle>
    <DYMORect>
      <DYMOPoint>
        <X>0.23</X>
        <Y>0.06</Y>
      </DYMOPoint>
      <Size>
        <Width>3.21</Width>
        <Height>0.9966666</Height>
      </Size>
    </DYMORect>
    <BorderColor>
      <SolidColorBrush>
        <Color A="1" R="0" G="0" B="0"></Color>
      </SolidColorBrush>
    </BorderColor>
    <BorderThickness>1</BorderThickness>
    <Show_Border>False</Show_Border>
    <DynamicLayoutManager>
      <RotationBehavior>ClearObjects</RotationBehavior>
      <LabelObjects>
        <BarcodeObject>
          <Name>IBarcodeObject0</Name>
          <Brushes>
            <BackgroundBrush>
              <SolidColorBrush>
                <Color A="1" R="1" G="1" B="1"></Color>
              </SolidColorBrush>
            </BackgroundBrush>
            <BorderBrush>
              <SolidColorBrush>
                <Color A="1" R="0" G="0" B="0"></Color>
              </SolidColorBrush>
            </BorderBrush>
            <StrokeBrush>
              <SolidColorBrush>
                <Color A="1" R="0" G="0" B="0"></Color>
              </SolidColorBrush>
            </StrokeBrush>
            <FillBrush>
              <SolidColorBrush>
                <Color A="1" R="0" G="0" B="0"></Color>
              </SolidColorBrush>
            </FillBrush>
          </Brushes>
          <Rotation>Rotation0</Rotation>
          <OutlineThickness>1</OutlineThickness>
          <IsOutlined>False</IsOutlined>
          <BorderStyle>SolidLine</BorderStyle>
          <Margin>
            <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
          </Margin>
          <BarcodeFormat>Code128Auto</BarcodeFormat>
          <Data>
            <MultiDataString>
              <DataString>${params[0]}</DataString>
            </MultiDataString>
          </Data>
          <HorizontalAlignment>Center</HorizontalAlignment>
          <VerticalAlignment>Middle</VerticalAlignment>
          <Size>SmallMedium</Size>
          <TextPosition>Bottom</TextPosition>
          <FontInfo>
            <FontName>Arial</FontName>
            <FontSize>12</FontSize>
            <IsBold>False</IsBold>
            <IsItalic>False</IsItalic>
            <IsUnderline>False</IsUnderline>
            <FontBrush>
              <SolidColorBrush>
                <Color A="1" R="0" G="0" B="0"></Color>
              </SolidColorBrush>
            </FontBrush>
          </FontInfo>
          <ObjectLayout>
            <DYMOPoint>
              <X>0.23</X>
              <Y>0.06</Y>
            </DYMOPoint>
            <Size>
              <Width>3.21</Width>
              <Height>0.9833333</Height>
            </Size>
          </ObjectLayout>
        </BarcodeObject>
      </LabelObjects>
    </DynamicLayoutManager>
  </DYMOLabel>
  <LabelApplication>Blank</LabelApplication>
  <DataTable>
    <Columns></Columns>
    <Rows></Rows>
  </DataTable>
</DesktopLabel>`;

		await dymo.print('DYMO LabelWriter 450 Turbo', labelXml);
		console.log(labelXml);
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
}
//const upc = require('./upc.min.js');
//var { createCanvas } = require("canvas");
//var canvas = createCanvas();

//const imageType = 'PNG';
//const dpi = 300;
//const scale = 2;
//const rotation = 0;
//const fontSize = 8;
//const thickness = 20;


//params is [value, filepath]
//const generateAndSaveBarcode = async function(params){
//	try{
//		if(params[0].toString().length != 11){
//			console.log('Error: tried to generate barcode with improper value length');
//			return;
//		}
//		
//		JsBarcode(canvas, '12345678901', {format: 'UPC'});
//		let data = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
//		let buffer = new Buffer(data, 'base64');
//		await fs.promises.writeFile('./barcode.png', buffer);
//		console.log('file written');
//		
//	}catch (err) {
//		console.log("ERROR: " + err.message);
//	}
//}
//
//const asyncImageLoader = async function(url){
//    return new Promise( (resolve, reject) => {
//        var image = new Image();
//        image.src = url;
//        image.onload = () => resolve(image)
//        image.onerror = () => reject(new Error('could not load image'))
//    })
//}
//
const BarcodeGenerator = function(){
	return ({
		print
	});
}

export default BarcodeGenerator;



