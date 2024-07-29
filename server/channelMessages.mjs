import { jml } from './jml.mjs';
import { prettyNameFromId, mentionJmlFromId } from './users.mjs';
import { formatSlackTimeFromTs } from './timestamps.mjs';

export function channelMessagesJml(ARCHIVE_DATA, messages) {
    let messageNodes = [];

    for (var ind = 0; ind < messages.length; ind++) {
        let renderedMessage = renderMessage(ARCHIVE_DATA.USERS_ARR, ind, messages);
        messageNodes.push(renderedMessage);
    }

    console.log(messageNodes);

    return messageNodes;
}

export function renderMessage(USERS_ARR, ind, messages) {
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
        user = USERS_ARR.find(m => m.profile && m.profile['api_app_id'] && m.profile['api_app_id'] === message['app_id']);
    } else if (USERS_ARR.find(m => m.id === message.user)) {
        user = USERS_ARR.find(m => m.id === message.user);
    }

    const messageBodyNodes = [];

    if (user && !isSequel) {
        let nametag = prettyNameFromId(USERS_ARR, user.id);
        messageBodyNodes.push(jml('span', { class: 'message_user' }, nametag));
        messageBodyNodes.push(jml('br'));
    }

    messageBodyNodes.push(renderMessageText(USERS_ARR, message));
    
    if (message.files) {
        messageBodyNodes.push(jml('figure', { class: 'message_files' }, renderMessageFiles(message)));
    }
    if (message.edited) {
        messageBodyNodes.push(jml('span', { class: 'message_editTag' }, '(edited)'));
    }

    
    return jml('tr', { id: message.ts, class: className }, [
        jml('td', { class: 'message_ts' }, formatSlackTimeFromTs(message.ts)),
        // jml('td', { class: 'message_user' }, nametag),
        jml('td', { class: 'message_body' }, messageBodyNodes),
    ])
}

function renderMessageText(USERS_ARR, message) {
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
                        let content = contentFromSubElement(USERS_ARR, subElement);
                        subElements.push(jml('span', { class: `block_subelement type_${subElement.type}` }, content));
                    }
                    elements.push(jml('span', { class: `block_element type_${element.type}` }, subElements));
                }
                blocks.push(jml('span', { class: 'message_block' }, elements))
            }

            return jml('span', { class: 'message_content'}, blocks);

        } catch(err) {
            console.error(err);
            console.log(message);
        }
    }

    return jml('span', { class: 'message_content' }, message.text);
}

function contentFromSubElement(USERS_ARR, subElement) {
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
            break;
        case 'user':
            content = mentionJmlFromId(USERS_ARR, subElement.user_id);
            break;
        default:
            console.log("DONT KNOW WHAT TO DO", subElement);
    }

    return content;
}

function renderMessageFiles(message) { 
    if (!message.files) return;

    console.log('Message files:', message.files);
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