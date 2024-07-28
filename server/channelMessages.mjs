import { jml } from './jml.mjs';
import { prettyNameFromId } from './users.mjs';
import { formatSlackTimeFromTs } from './timestamps.mjs';

export function channelMessagesJml(archiveData, messages) {
    let messageNodes = [];

    for (var ind = 0; ind < messages.length; ind++) {
        let renderedMessage = renderMessage(ind, messages, archiveData.usersArr);
        messageNodes.push(renderedMessage);
    }

    console.log(messageNodes);

    return messageNodes;
}

export function renderMessage(ind, messages, usersArr) {
    let message = messages[ind];
    
    if (!message.type === 'message') { 
        return;
    }

    var className = 'message_container';
    // Check if next message is by a different author, otherwise this classname signals to group the messages
    let isSequel = (messages[ind-1]
        && messages[ind-1].user === messages[ind].user);
                
    if (isSequel) { 
        className += ' is_sequel';
    }
    if (message.edited) { 
        className += ' is_edited';
    }

    var user = false
    if (message.subtype && message.subtype === "bot_message") {
        user = usersArr.find(m => m.profile && m.profile['api_app_id'] && m.profile['api_app_id'] === message['app_id']);
    } else if (usersArr.find(m => m.id === message.user)) {
        user = usersArr.find(m => m.id === message.user);
    }

    var contentNodes = renderMessageText(message);
    if (message.files) {
        contentNodes.push(jml('figure', { class: 'message_files' }, renderMessageFiles(message)));
    }
    if (message.edited) {
        contentNodes.push(jml('span', { class: 'message_editTag' }, '(edited)'));
    }

    var nametag = ''
    if (user && !isSequel) {
        nametag = prettyNameFromId(user.id, usersArr);
    }
    
    return jml('tr', { id: message.user, class: className }, [
        jml('td', { class: 'message_ts' }, formatSlackTimeFromTs(message.ts)),
        jml('td', { class: 'message_user' }, nametag),
        jml('td', { class: 'message_content' }, contentNodes),
    ])
}

export function renderMessageText(message) {
    if (message.blocks) {
        try {
            const blocks = [];
            for (const block of message.blocks) {
                const elements = [];
                if (!block.elements) {
                    console.log('Block has no elements', block);
                    return [];
                }
                for (const element of block.elements) {
                    const subElements = [];
                    for (const subElement of element.elements) {
                        let content = contentFromSubElement(subElement);
                        subElements.push(jml('span', { class: 'element_element ' + subElement.type }, content));
                    }
                    elements.push(jml('span', { class: 'block_element ' + element.type }, subElements));
                }
                blocks.push(jml('span', { class: 'message_block' }, elements))
            }

            return blocks;

        } catch(err) {
            console.error(err);
            console.log(message);
        }
    }

    return [ jml('span', {}, message.text) ];
}

function contentFromSubElement(subElement) {
    var content = '';
    switch (subElement.type) {
        case 'emoji':
            if (subElement.unicode) {
                for (const e of subElement.unicode.split('-')) {
                    content += String.fromCodePoint('0x' + e);
                }
            } else {
                content = subElement.name;
            }
            break;
        case 'text':
            content = subElement.text;
    }

    return content;
}

function renderMessageFiles(message) { 
    if (!message.files) return;

    console.log(message.files);
    // const result = [];

    // for (const file of message.files) {
    //     if (!file.permalink) {
    //         console.log('File missing permalink', file);
    //         continue;
    //     }

    //     // let filename = file.permalink.split('/').pop();
    //     // var path = `../archives/${params.type}/${params.id}/files/${file.id}/${filename}`;

    //     if (file.mimetype && file.mimetype.startsWith('image/')) {
    //         result.push(jml('img', { src: path }));
    //     }
    // }

    // return result;
}