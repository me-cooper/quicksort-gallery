const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const INDEX_FILE = 'currentIndex';

const sharp = require('sharp');

let currentIndex = 900;
let imageList = [];

let imageRootPath = './images';


app.use(bodyParser.json());
app.use(express.static('public'));


async function saveIndex() {
    await fs.writeFile(INDEX_FILE, currentIndex.toString());
}


async function loadIndex() {
    if (await fs.stat(INDEX_FILE).catch(() => { currentIndex = -1 })) {
        currentIndex = parseInt(await fs.readFile(INDEX_FILE, 'utf8'), 10);
    }
}


async function collectImagePaths(dir, fileList = []) {

    const list = await fs.readdir(dir);

    for (const file of list) {

        const filePath = path.join(dir, file);

        if ((await fs.stat(filePath)).isDirectory()) {

            await collectImagePaths(filePath, fileList);

        } else if (isImageFile(filePath)) {

            fileList.push(filePath);

        }

    }

    return fileList;

}


function isImageFile(file) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp'];
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
}



// getImage-Endpunkt
app.get('/getImage/:direction', async (req, res) => {

    const direction = req.params.direction;

    if (imageList.length === 0) {
        return res.status(404).send('Keine Bilder gefunden.');
    }

  
    if (direction === "next") {
        currentIndex = (currentIndex + 1) % imageList.length;
    } else if (direction === "prev") {
        currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    }

    let imagePath           = imageList[currentIndex];
    const imageBuffer       = await sharp(imagePath).resize(450, null).toFormat('jpeg').jpeg({ quality: 90, force: true}).toBuffer();
    
    let imageBase64         = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    await saveIndex();

    return res.json({
        path: imagePath,
        current: currentIndex + 1,
        total: imageList.length,
        imgData: imageBase64
    });


});


// deleteImage-Endpunkt
app.post('/deleteImage', async (req, res) => {

    const imagePath = req.body.imagePath;
    const imageAbsolutePath = path.resolve(imagePath);

    const deletedImagePath = path.join(`${imageRootPath}_deleted`, imagePath);

    await fs.mkdir(path.dirname(deletedImagePath), { recursive: true });

    const index = imageList.indexOf(imagePath);


    if (index > -1) {
        imageList.splice(index, 1);
    }

    // Index eins zurücknehmen
    currentIndex = currentIndex - 1;

    // Bild verschieben
    await fs.rename(imageAbsolutePath, deletedImagePath);

    return res.json({
        message: "Photo deleted"
    });

});


// favorizeImage-Endpunkt
app.post('/favorizeImage', async (req, res) => {

    const imagePath = req.body.imagePath;
    const imageAbsolutePath = path.resolve(imagePath);

    const favorizedImagePath = path.join(`${imageRootPath}_favorites`, path.basename(imagePath));


    await fs.mkdir(path.dirname(favorizedImagePath), { recursive: true });

    await fs.copyFile(imageAbsolutePath, favorizedImagePath);

    return res.json({
        message: "Photo added to favorites"
    });

});



app.post('/rotateImage', async (req, res) => {
    const { imagePath, angle } = req.body;

    const imageAbsolutePath = path.resolve(imagePath);

    console.log(`Bild ${imagePath} soll um ${angle} Grad gedreht werden.`);

    const rotatedImage = await sharp(imagePath).rotate(angle).toBuffer();
    await fs.writeFile(imageAbsolutePath, rotatedImage);


    return res.json({
        message: "Photo was rotated"
    });
});




app.listen(port, async () => {

    imageList = await collectImagePaths(imageRootPath);

    await loadIndex();

    console.log(`Server running  at http://localhost:${port}`);

});

