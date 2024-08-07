
import { jml } from './jml.mjs';
import { localPathFromFile } from './loadData.mjs';

export function messageFilesUI(ARCHIVE_DATA, message) { 
    if (!message.files) return;

    console.log('Message files:', message.files);

    const result = [];

    for (const file of message.files) {
        if (!file.permalink) {
            console.error('File missing permalink ' + file);
            continue;
        }
        
        if (!file.mimetype) {
            console.log('Generic file handling ' + file);
            continue;
        }

        if (file.mimetype.startsWith('image/')) {
            result.push(imageUI(ARCHIVE_DATA, file) )
            continue;
        }
    }

    return result;
}

function imageUI(ARCHIVE_DATA, imageFile) {
    let source = imageFile.url_private;
    // let source = localPathFromFile(ARCHIVE_DATA, imageFile); 
    return jml('img', { src: source });
}