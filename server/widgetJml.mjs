export function applyWidgetJml(destQuery, widgetJmlFn, ARCHIVE_DATA, auxIn) {
    let nodes = widgetJmlFn(ARCHIVE_DATA, auxIn);
    for (const node of nodes) {
        document.querySelector(destQuery).appendChild(node);
    }    
}