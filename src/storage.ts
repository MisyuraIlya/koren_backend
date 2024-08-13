import { diskStorage } from "multer";

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
    const name = generateId()
    const subfolder = determineSubfolder(fileExtName);
    callback(null, `${subfolder}/${name}.${fileExtName}`);
}

let destinationPath = '../media';


export const fileStorage = diskStorage({
    destination: destinationPath,
    filename: normalizeFileName
});
