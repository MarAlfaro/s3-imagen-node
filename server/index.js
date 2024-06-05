const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configura el almacenamiento de multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

const bucketName = process.env.AWS_BUCKET_NAME;

app.use(cors());
app.use(express.json());

app.post('/api/s3', upload.single('image'), async (req, res) => {
    try {
        const image = req.file;
        const random = new Date().getTime();

        if (image) {
            const params = {
                Bucket: bucketName,
                Key: `${random}-${image.originalname}`,
                Body: image.buffer,
                ContentType: image.mimetype,
            };

            const command = new PutObjectCommand(params);
            await client.send(command);

            const getObjectParams = {
                Bucket: bucketName,
                Key: `${random}-${image.originalname}`,
                ACL: 'private',
            };

            const getCommand = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(client, getCommand, { expiresIn: 3600 });

            return res.status(200).json({
                success: true,
                message: 'La imagen se subió correctamente!',
                data: { url },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No se pudo subir la imagen',
                data: null,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ocurrió un error al subir la imagen',
            error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
