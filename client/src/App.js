import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MoonIcon from './images/oscuro.png';
import SunIcon from './images/claro.png';

function App() {
  // Estados del componente
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showImage, setShowImage] = useState(false);

  // Efecto para cargar el modo oscuro desde el almacenamiento local
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setDarkMode(darkModePreference);
    document.documentElement.setAttribute('data-theme', darkModePreference ? 'dark' : 'light');
  }, []);

  // Función para alternar entre el modo claro y oscuro
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  // Función para manejar la subida de la imagen
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
          setShowImage(true);

          // Oculta la imagen después de 60 segundos
          setTimeout(() => {
            setShowImage(false);
          }, 60000); 
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función para manejar el cambio de la imagen seleccionada
  const handleFileChange = (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (file) setSelectedImage(file);
  };

  // Renderiza el componente
  return (
    <div className="container">
      <div className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <img src={SunIcon} alt="Modo Claro" /> : <img src={MoonIcon} alt="Modo Oscuro" />}
      </div>
      <h1>Subir imagen a S3</h1>
      {showImage && image && <img alt="Uploaded" src={image} className="image" />}
      <form onSubmit={onSubmit} className="form">
        <label htmlFor="image">Selecciona tu imagen</label>
        <input id="image" type="file" onChange={handleFileChange} />
        <button type="submit">Subir imagen</button>
      </form>
    </div>
  );
}

export default App;
