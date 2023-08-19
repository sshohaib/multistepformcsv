import React, { useRef, useState } from 'react';
import {Button, TextField} from '@mui/material'
import Papa from 'papaparse'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function MultiStepForm() {
  const [csvData, setCsvData] = useState([]);
  const [maxValue_X, setMaxValue_X] = useState(null);
  const [minValue_X, setMinValue_X] = useState(null);
  const [maxValue_Y, setMaxValue_Y] = useState(null);
  const [minValue_Y, setMinValue_Y] = useState(null);
  const [maxValue_Z, setMaxValue_Z] = useState(null);
  const [minValue_Z, setMinValue_Z] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectname: '',
    projectdesc: '',
    client: '',
    contractor: '',
    Max_X: maxValue_X,
    Min_X: minValue_X,
    Max_Y: maxValue_Y,
    Min_Y: minValue_Y,
    Max_Z: maxValue_Z,
    Min_Z: minValue_Z,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const goToNextStep = () => {
    setStep(step + 1);
  };
  const goToPrevtStep = () => {
    setStep(step - 1);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        findMaxMinValues(result.data);
      },
      header: true, // If the CSV has headers
    });
  };

  const handleUpload = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
        ...prevData,
      [name]: value,
    }));
  };

  const findMaxMinValues = (data) => {
    const values_X = data.map((row) => parseFloat(row['X'])); // Replace 'columnName' with the actual column name
    const values_Y = data.map((row) => parseFloat(row[2]));
    const values_Z = data.map((row) => parseFloat(row[3]));

    setMaxValue_X(Math.max(...values_X));
    setMinValue_X(Math.min(...values_X));
    setMaxValue_Y(Math.max(...values_Y));
    setMinValue_Y(Math.min(...values_Y));
    setMaxValue_Z(Math.max(...values_Z));
    setMinValue_Z(Math.min(...values_Z));
    

  };

  const [loader, setLoader] = useState(false);
  const pdfRef = useRef();

  const downloadPDF = () =>{
    const input = pdfRef.current;
    setLoader(true);
    html2canvas(input).then((canvas)=>{
      const imgData = canvas.toDataURL('img/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save('xyzengine.pdf');
    })
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <div><TextField
            type="text"
            name="projectname"
            value={formData.projectname}
            onChange={handleInputChange}
            label="Project Name" margin="normal" variant="outlined" color="secondary"
          /></div>
          <div><TextField
            type="text"
            name="projectdesc"
            value={formData.projectdesc}
            onChange={handleInputChange}
            label="Project Description" margin="normal" variant="outlined" color="secondary"
          /></div>
          <div><TextField
            type="text"
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            label="Client" margin="normal" variant="outlined" color="secondary"
          /></div>
          <div><TextField
            type="text"
            name="contractor"
            value={formData.contractor}
            onChange={handleInputChange}
            label="Contarctor" margin="normal" variant="outlined" color="secondary"
          /></div>
          <Button onClick={goToNextStep} variant="contained" color="primary">Next</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div><TextField
            type="text"
            name="projectname"
            value={formData.projectname}
            disabled
            label="Project Name" margin="normal" variant="outlined" color="secondary"
          /></div>
          <div><TextField
            type="text"
            name="projectdesc"
            value={formData.projectdesc}
            disabled
            label="Project Description" margin="normal" variant="outlined" color="secondary"
          /></div>
          <div><TextField
            type="text"
            name="client"
            value={formData.client}
            disabled
            label="Client" margin="normal" variant="outlined" color="secondary"
          /></div>
          <div><TextField
            type="text"
            name="contractor"
            value={formData.contractor}
            disabled
            label="Contarctor" margin="normal" variant="outlined" color="secondary"
          /></div>
          <input type='file' name='file' accept='.csv' onChange={handleFileUpload} style={{align:'center', display: 'block', margin: '10px auto'}}></input>
        <Button variant='contained' color='primary' onClick={handleUpload}>Upload</Button>
          <div><TextField type="number"
              name="Max_X"
              value={formData.Max_X} onChange={handleInputChange} label="Max_X" margin="normal" variant="outlined" color="secondary"></TextField></div>
          <div><TextField type="number"
              name="Min_X"
              value={formData.Min_X} onChange={handleInputChange} label="Min_X" margin="normal" variant="outlined" color="secondary"></TextField></div>
          <div><TextField type="number"
              name="Max_Y"
              value={formData.Max_Y} onChange={handleInputChange} label="Max_Y" margin="normal" variant="outlined" color="secondary"></TextField></div>
          <div><TextField type="number"
              name="Min_Y"
              value={formData.Min_Y} onChange={handleInputChange} label="Min_Y" margin="normal" variant="outlined" color="secondary"></TextField></div>
          <div><TextField type="number"
              name="Max_Z"
              value={formData.Max_Z} onChange={handleInputChange} label="Max_Z" margin="normal" variant="outlined" color="secondary"></TextField></div>
          <div><TextField type="number"
              name="Min_Z"
              value={formData.Min_Z} onChange={handleInputChange} label="Min_Z" margin="normal" variant="outlined" color="secondary"></TextField></div>
    
          <div><Button onClick={goToPrevtStep} variant="contained" color="primary">Back</Button> <Button onClick={goToNextStep} variant="contained" color="primary">Submit</Button></div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div ref={pdfRef}>
            <p>Project name: {formData.projectname}</p>
            <p>Project Description: {formData.projectdesc}</p>
            <p>Client: {formData.client}</p>
            <p>Contarctor: {formData.contractor}</p>
            <p>Max_X: {formData.Max_X}</p>
            <p>Min_X: {formData.Min_X}</p>
            <p>Max_Y: {formData.Max_Y}</p>
            <p>Min_Y: {formData.Min_Y}</p>
            <p>Max_Z: {formData.Max_Z}</p>
            <p>Min_Z: {formData.Min_Z}</p>
          </div>
          <Button
                variant='contained' color='primary'
                onClick={downloadPDF}
                disabled={!(loader===false)}
              >
                {loader?(
                  <span>Downloading</span>
                ):(
                  <span>Download</span>
                )}

              </Button> 
          
        </div>
      )}
    </div>
  );
}

export default MultiStepForm;
