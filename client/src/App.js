import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MoonIcon from './images/oscuro.png';
import SunIcon from './images/claro.png';

function App() {
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setDarkMode(darkModePreference);
    document.documentElement.setAttribute('data-theme', darkModePreference ? 'dark' : 'light');
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const headers = {
          "Content-Type": "multipart/form-data",
        };

        const { data } = await axios.post("http://localhost:3001/api/s3", formData, { headers });
        if (data.success) {
          setImage(data.data.url);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (file) setSelectedImage(file);
  };

  return (
    <div className="container">
      <div className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <img src={SunIcon} alt="Modo Claro" /> : <img src={MoonIcon} alt="Modo Oscuro" />}
      </div>
      <h1>Subir imagen a S3</h1>
      {image && <img alt="Uploaded" src={image} className="image" />}
      <form onSubmit={onSubmit} className="form">
        <label htmlFor="image">Selecciona tu imagen</label>
        <input id="image" type="file" onChange={handleFileChange} />
        <button type="submit">Subir imagen</button>
      </form>
    </div>
  );
}

export default App;

