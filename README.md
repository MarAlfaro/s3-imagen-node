# Proyecto de Cliente y Servidor

Este proyecto consta de dos partes: un cliente y un servidor. El cliente está construido con React.js y el servidor con Node.js. El propósito principal del proyecto es permitir a los usuarios cargar imágenes en un bucket de Amazon S3.

## Instalación - Cliente

1. Navega al directorio `client` utilizando la terminal.

2. Ejecuta el siguiente comando para instalar las dependencias del cliente:

```bash
npm install
```
3. Una vez completada la instalación, puedes iniciar el cliente con el siguiente comando:

```bash
npm start
```


## Instalación - Servidor
1. Navega al directorio `server` utilizando la terminal.

2. Crea un archivo .env y añade las siguientes variables de entorno con sus respectivos valores:

```
AWS_BUCKET_REGION= Tu región de AWS
AWS_ACCESS_KEY= Tu clave de acceso de AWS
AWS_SECRET_KEY= Tu clave secreta de AWS
AWS_BUCKET_NAME= El nombre de tu bucket en S3
```
3. Después de configurar el archivo .env, puedes iniciar el servidor con el siguiente comando:
```bash
node index.js
```
Una vez que tanto el cliente como el servidor están en funcionamiento, podrás acceder al cliente desde tu navegador web en la dirección http://localhost:3000.