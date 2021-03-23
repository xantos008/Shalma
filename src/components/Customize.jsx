import React, { useState } from 'react';

import ColorPicker from "../store/ColorPicker";

import LivePreview from '../components/LivePreview';

import { updateAppUiPreferences } from '../services/customerApi';

import { Container, Row, Card } from "react-bootstrap";

function Customize() {
  const [formData, setFormData] = useState(
  localStorage.getItem('uiPreferences') !== "undefined" ? JSON.parse(localStorage.getItem('uiPreferences')) : {
	  bgColor: "#ffffff",
	  textColor: "#000000",
	  heading: "Earn 10.000 Satoshis",
	  textMessage: "{{name}} is inviting you with code {{referral_code}}, click link {{link}} to claim the reward"
  });
  const [showColorBackground, setShowColorBackground] = useState(true);
  
  const onColorPickerInfoChangeBackground = (color) => {
    setFormData(v => ({
		...v,
		bgColor: color.hex
	}))
	localStorage.setItem('uiPreferences', JSON.stringify(formData))
  };
  const onColorPickerInfoChangeText = (color) => {
    setFormData(v => ({
		...v,
		textColor: color.hex
	}))
	localStorage.setItem('uiPreferences', JSON.stringify(formData))
  };
  
  
  const setFormDataPicture = (e) => {
    setFormData(v => ({
		...v,
		bgColor: e.target.value
	}))
	localStorage.setItem('uiPreferences', JSON.stringify(formData))
  };
  const setFormDataHeding = (e) => {
    setFormData(v => ({
		...v,
		heading: e.target.value
	}))
	localStorage.setItem('uiPreferences', JSON.stringify(formData))
  };
  const setFormDataTextMessage = (e) => {
    setFormData(v => ({
		...v,
		textMessage: e.target.value
	}))
	localStorage.setItem('uiPreferences', JSON.stringify(formData))
  };
  const selectionChange = (e) => {
	if(Number(e.target.value) === 1){
		setShowColorBackground(true)
	} else {
		setShowColorBackground(false)
	}
  };
  
  
  const handleUpdateUi = (async () => {
	localStorage.setItem('uiPreferences', JSON.stringify(formData))
	await updateAppUiPreferences({
		data: formData,
		userId: localStorage.getItem('userId'),
	});
	alert('Saved!')
  });
  
  const styles = {
      title: "Color Picker",
      labelStyle: {
        paddingBottom: "7px",
        fontSize: "11px"
      },
      colorTextBoxStyle: {
        height: "35px",
        border: "none",
        borderBottom: "1px solid lightgray",
        paddingLeft: "35px"
      }
    };
    return (
     <>
     <div className="customize_page p-4">
     	<Container>
               <Row>
                    <Card className="col-md-12 p-4 border-0">
          		<div className="settingForm">
          			
          			<div className="form-field">
          			  <div className="field-title">
          				Background:
          			  </div>
          			  <div className="field-selection">
          				<select name="giveChoise" onChange={selectionChange} >
          					<option value="0">Choose type</option>
          					<option value="1">Color</option>
          					<option value="2">Picture</option>
          				</select>
          			  </div>
          			  {showColorBackground && (
          			  <div className="colorPicker">
          				  <ColorPicker
          					onColorChange={onColorPickerInfoChangeBackground}
          					title={styles.title}
          					labelStyle={styles.labelStyle}
          					colorTextBoxStyle={styles.colorTextBoxStyle}
          					pickerType={"Chrome"}
          					color={formData.bgColor}
          				  />
          			  </div>
          			  )}
          			  {!showColorBackground && (
          				<input type="text" name="backgroundPicture" placeholder="https://yoursite.url/path/to/image.jpg" value={formData.bgColor || ''} onChange={setFormDataPicture} />
          			  )}
          		  </div>
          		  <div className="form-field">
          			  <div className="field-title">
          				Text color:
          			  </div>
          			  <div className="colorPicker">
          				  <ColorPicker
          					onColorChange={onColorPickerInfoChangeText}
          					title={styles.title}
          					labelStyle={styles.labelStyle}
          					colorTextBoxStyle={styles.colorTextBoxStyle}
          					pickerType={"Chrome"}
          					color={formData.textColor}
          				  />
          			  </div>
          		  </div>
          		  <div className="form-field">
          			  <div className="field-title">
          				Text color:
          			  </div>
          			  <div className="colorPicker">
          				  <input type="text" name="heading" value={formData.heading || ''} onChange={setFormDataHeding} />
          			  </div>
          		  </div>
          		  <div className="form-field">
          			  <div className="field-title">
          				Text message:
          			  </div>
          			  <div className="colorPicker">
          				  <input type="text" name="textMessage" value={formData.textMessage || ''} onChange={setFormDataTextMessage} />
          			  </div>
          		  </div>
          		</div>
          		<button className="ant-btn ant-btn-primary settingsButton" onClick={handleUpdateUi}>
          			Save
          		</button>
          		
          		<div className="previewText">
          			Previews
          		</div>
          		
          		<LivePreview data={formData} />
                    </Card>
     		</Row>
     	</Container>
     </div>
     </>
    );
}

export default Customize
