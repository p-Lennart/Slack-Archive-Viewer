
import { jml } from './jml.mjs';
import { localPathFromFile } from './loadData.mjs';

export function messageFilesUI(ARCHIVE_DATA, message) { 
    if (!message.files) return;

    console.log('Message files:', message.files);

    const result = [];

    for (const file of message.files) {
        if (!file.mimetype) {
            file.mimetype = 'NONE/NONE';
        }

        if (!file.permalink) {
            console.error('File missing permalink ' + file);
            continue;
        }

        if (file.mimetype.startsWith('image/')) {
            result.push(imageUI(ARCHIVE_DATA, file) )
            continue;
        }

        if (file.mimetype.startsWith('image/')) {
            result.push(imageUI(ARCHIVE_DATA, file) )
            continue;
        }

        if (file.mimetype.startsWith('video/')) {
            result.push(videoUI(ARCHIVE_DATA, file) )
            continue;
        }

        console.log('Generic file handling ' + file);
            
    }

    return result;
}

function imageUI(ARCHIVE_DATA, imageFile) {
    let source = imageFile.url_private;
    // let source = localPathFromFile(ARCHIVE_DATA, imageFile); 
    return jml('img', { src: source });
}

function videoUI(ARCHIVE_DATA, imageFile) {
    let source = imageFile.mp4;
    // let source = localPathFromFile(ARCHIVE_DATA, imageFile); 
    return jml('video', { controls: true }, [
        jml('source', { src: source, type: 'video/mp4'}),
    ]);
}