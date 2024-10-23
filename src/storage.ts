import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";

const generateId = () => 
    Array(18)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

const determineSubfolder = (fileExtName) => {
    if (fileExtName === 'pdf') {
        return 'pdf';
    } else if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtName)) {
        return 'image';
    } else {
        // Default
        return 'other';
    }
};

const normalizeFileName = (req, file, callback) => {
    const fileExtName = file.originalname.split('.').pop();
    const name = generateId();
    const subfolder = determineSubfolder(fileExtName);
    
    // Ensure directory exists
    const uploadPath = path.join(destinationPath, subfolder);
    fs.mkdirSync(uploadPath, { recursive: true }); 

    callback(null, `${subfolder}/${name}.${fileExtName}`);
};

let destinationPath = '../media';

export const fileStorage = diskStorage({
    destination: destinationPath,
    filename: normalizeFileName
});
