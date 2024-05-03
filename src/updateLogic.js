// updateLogic.js

import axios from 'axios'; // Importa axios para hacer solicitudes HTTP

// URL de tu repositorio en GitHub
const repoUrl = 'https://api.github.com/repos/Tjhonnark/tauri.git';

// Función para verificar si hay actualizaciones disponibles
export const checkForUpdates = async () => {
  try {
    // Obtiene la información sobre los lanzamientos de GitHub
    const response = await axios.get(`${repoUrl}/releases/latest`);
    const latestRelease = response.data;

    // Obtiene la versión del último lanzamiento
    const latestVersion = latestRelease.tag_name;

    // Compara la versión del último lanzamiento con la versión actual de la aplicación
    const currentVersion = '0.0.1'; // Aquí deberías obtener la versión actual de tu aplicación
    if (latestVersion !== currentVersion) {
      // Hay una actualización disponible, notificar al usuario o iniciar la descarga automáticamente
      console.log('¡Hay una actualización disponible!');
      await downloadAndApplyUpdate(latestRelease); // Aquí se llama la función downloadAndApplyUpdate
      return latestRelease;
    } else {
      // No hay actualizaciones disponibles
      console.log('No hay actualizaciones disponibles.');
      return null;
    }
  } catch (error) {
    // Error al obtener la información sobre los lanzamientos
    console.error('Error al verificar actualizaciones:', error);
    return null;
  }
};

// Función para descargar y aplicar automáticamente la actualización
export const downloadAndApplyUpdate = async (latestRelease) => {
  try {
    // Obtiene el enlace de descarga de la última versión
    const downloadUrl = latestRelease.assets[0].browser_download_url;

    // Descarga la actualización
    const downloadResponse = await axios.get(downloadUrl, { responseType: 'blob' });
    const updateBlob = new Blob([downloadResponse.data]);

    // Crea un objeto URL para el blob de la actualización
    const updateUrl = URL.createObjectURL(updateBlob);

    // Aplica la actualización
    await window.__TAURI__.update.apply(updateUrl);

    // La actualización se aplicó correctamente
    console.log('¡Actualización aplicada correctamente!');
  } catch (error) {
    // Error al descargar o aplicar la actualización
    console.error('Error al descargar o aplicar la actualización:', error);
  }
};
