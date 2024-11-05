const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name : 'dwmcxk95n',
    api_key : '844343133591925',
    api_secret : 'QcWT28dTPLI_bYT-ghpij7pnP_M'
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file, {
        resource_type : "auto",

    })

    return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };