import React, { useRef, useEffect, useState } from 'react';
import NavBar from './nav/NavBar';
import axios from 'axios';
import './style/testSearchPicStyles.css';
import * as faceapi from 'face-api.js';
import { Container, InputGroup, Form, Button, Table } from 'react-bootstrap';
export default function TestSearchPic() {

  const imageUploadRef = useRef();
  const canvasRef = useRef();
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picpng, setpicPNG] = useState(null);
  const [data, setData] = useState([])
  const [namefile, setNameFile] = useState(null)
  const [noface,setNoFace] = useState(null)
  useEffect(() => {
    const MODEL_URL = '/models';
    setLoading(true);

    Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ]).then(async () => {
      const labelsData = await axios.get(import.meta.env.VITE_API + '/api/labels');
      // setLabels(labelsData.data);
      const labeledFaceDescriptors = await loadLabeledImage(labelsData.data);
      // console.log(labeledFaceDescriptors)
    
      const matcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.59);
      console.log(matcher)
      setFaceMatcher(matcher);

      setLoading(false);
    }).catch(error => {
      console.error("Error loading models", error);
      setLoading(false);
    });
  }, []);

  const getImagePath = (dname, single_img) => {
    if (dname == 'unknown') {
      return import.meta.env.VITE_API + `/api/detectedSingleFace/${single_img}`;
    } else {
      return import.meta.env.VITE_API + `/getDetectedSingleFaceKnown/${single_img}`;
    }
  };
  async function searchInDetectedSingleFace(detectedDescriptor) {
    const baseUrl = import.meta.env.VITE_API + '/api/detectedSingleFace';
    const files = await getFilesInDirectory();
    let matches = [];
    for (const file of files) {
      const img = await faceapi.fetchImage(`${baseUrl}/${file}`);
      const singleResult = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

      if (singleResult) {
        const distance = faceapi.euclideanDistance(detectedDescriptor, singleResult.descriptor);
        if (distance < 0.6) {
          matches.push({ distance, file });
        }
      }
    }

    matches.sort((a, b) => a.distance - b.distance);

    const pngFiles = matches
      .filter(match => match.file && match.file.endsWith('.png' || '.jpg')) // Ensure the file ends with .png
      .map(match => {
        // Extract just the filename from the URL path
        const filename = match.file.split('/').pop(); // Assuming match.file is a string with the file path
        return filename;
      });

    return pngFiles.length > 0 ? pngFiles : [];
  }

  async function getFilesInDirectory() {
    try {
      const response = await axios.get(import.meta.env.VITE_API + '/api/detectedSingleFace/files');
      // console.log(response.data)
      return response.data; // Returns an array of file names
    } catch (error) {
      console.error("Error fetching the list of files", error);
      return [];
    }
  }

  const loadLabeledImage = (labelsInfo) => {
    return Promise.all(
      labelsInfo.map(async labelInfo => {
        const { label } = labelInfo;
        const res = await axios.get(import.meta.env.VITE_API + `/getFilePic/${label}`);
        const fileNames = res.data;
  
        const descriptions = [];
        for (const fileName of fileNames) {
          const img = await faceapi.fetchImage(import.meta.env.VITE_API + `/getImageFolder/${encodeURIComponent(label)}/${fileName}`);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          if (detections) {
            descriptions.push(detections.descriptor);
          } else {
            // Handle the case where a face is not detected in the image
            console.warn(`No face detected in image ${fileName}`);
          }
        }
        // Only return LabeledFaceDescriptors with at least one descriptor
        if (descriptions.length > 0) {
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        } else {
          console.warn(`No descriptors created for label ${label}`);
          return null;
        }
      })
    ).then(labeledDescriptors => labeledDescriptors.filter(ld => ld)); // Filter out any nulls
  };

  // const loadLabeledImagess = (labelsInfo) => {
  //   return Promise.all(
  //     labelsInfo.map(async labelInfo => {
  //       const { label, imageCount } = labelInfo;
  //       // console.log(label)
  //       const res = await axios.get(import.meta.env.VITE_API + `/getFilePic/${label}`);
  //       // console.log(res)
  //       const descriptions = [];
  //       for (let i = 1; i <= imageCount; i++) {
  //         const img = await faceapi.fetchImage(import.meta.env.VITE_API + `/getImageFolder/${encodeURIComponent(label)}/${i}.png`);
  //         // console.log(img)
  //         // console.log(import.meta.env.VITE_API + `/images/${encodeURIComponent(label)}/${i}.png`)
  //         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  //         descriptions.push(detections.descriptor);
  //         console.log(descriptions)
  //       }
  //       return new faceapi.LabeledFaceDescriptors(label, descriptions);
  //     })

  //   );
  // };


  // const loadLabeledImages = (labelsInfo) => {
  //   return Promise.all(
  //     labelsInfo.map(async labelInfo => {
  //       const { label, imageCount } = labelInfo;
  //       // console.log(label)
  //       const res = await axios.get(import.meta.env.VITE_API + `/getFilePic/${label}`);
  //       const fileNames = res.data;

  //       // console.log(res)
  //       const descriptions = [];
  //       for (const fileName of fileNames) {
          
  //         const img = await faceapi.fetchImage(import.meta.env.VITE_API + `/getImageFolder/${encodeURIComponent(label)}/${fileName}`);
  //         // console.log(img)
  //         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  //         descriptions.push(detections.descriptor);
  //         console.log(descriptions)

  //       }
  //       return new faceapi.LabeledFaceDescriptors(label, descriptions);
  //     })

  //   );
  // };

  const handleImageUpload = async event => {
    if (event.target.files && event.target.files.length > 0 && faceMatcher) {
      setNameFile(null)
      setData([])
      setpicPNG(null)
      const imgFile = event.target.files[0];
      const img = await faceapi.bufferToImage(imgFile);
      const canvas = canvasRef.current;
      const desiredWidth = 700;  // เปลี่ยนค่านี้เป็นขนาดที่คุณต้องการ
      const desiredHeight = 527; // เปลี่ยนค่านี้เป็นขนาดที่คุณต้องการ
      const aspectRatio = img.width / img.height;
      if (img.width > img.height) {
        canvas.width = desiredWidth;
        canvas.height = desiredWidth / aspectRatio;
      } else {
        canvas.width = desiredHeight * aspectRatio;
        canvas.height = desiredHeight;
      }
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const detections = await faceapi.detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors();
      if(detections.length===0){
        window.alert('No face detected in the image. Please upload an image with a face.');
        return;
      }
      if (detections.length > 0) {
        setNoFace(true)
        const resizedDetections = faceapi.resizeResults(detections, {
          width: canvas.width,
          height: canvas.height,
        });
        const value = []
        resizedDetections.forEach(async detection => {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          if (bestMatch.distance > 0.59) {
            const imageFromDetected = await searchInDetectedSingleFace(detection.descriptor);
            // console.log(detection.descriptor)
            if (imageFromDetected) {
              console.log('Unknown Matched Image:', imageFromDetected);
              setpicPNG(imageFromDetected)
              saveMatchedName(imageFromDetected);
            } else {
              console.log('not found')
            }

          } else {
            console.log('Known Face Matched:', bestMatch.toString());
            setNameFile(bestMatch)
            saveMatchedName([bestMatch]);
          }
          const box = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() });
          drawBox.draw(canvas);
        });
      }
    }


  };
  const saveMatchedName = (matches) => {
    const getDetect = async () => {
      try {
        let fetchPromises = [];
        for (const match of matches) {
          const name = match.toString().split(' ')[0];
          fetchPromises.push(axios.get(import.meta.env.VITE_API + `/getEmpDetect/${name}`));
        }
        const results = await Promise.all(fetchPromises);
        const newCombinedData = results.reduce((acc, res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            return acc.concat(res.data);
          }
          return acc;
        }, []);

        // Combine new data with existing state data
        setData(prevData => [...prevData, ...newCombinedData]);
        console.log('Data set in state:', newCombinedData);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getDetect();
  };


  return (
    <>
      <NavBar />
      <Container>
        <div className="testSearchPicContainer">
          <div className="fileInputContainer">
            <h2 className="testSearchPicTitle">ระบบจดจำใบหน้า</h2>
            {loading ? (
              <p className="testSearchPicLoading">Loading models...</p>
            ) : (
              <input
                type="file"
                ref={imageUploadRef}
                onChange={handleImageUpload}
                className="testSearchPicInput"
              />
            )}</div>
        </div>
        <div className="contentContainer">
          <canvas ref={canvasRef} className="testSearchPicCanvas" />
          {namefile || picpng ? (
            <div className="tableContainer">
              <Table style={{ marginTop: '3rem' }} hover>
                <thead >
                  <tr>
                    <th></th>
                    {/* <th>Name</th>  */}
                    <th>Name</th>
                    <th>Expression</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, key) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.expression}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td><img width={100} height={100} style={{ borderRadius: '0.5rem' }} src={getImagePath(item.name, item.path)} alt="" /></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <h2>Not Found</h2>
          )}

        </div>
      </Container>
    </>
  );

}
