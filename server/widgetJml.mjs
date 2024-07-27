export function applyWidgetJml(destQuery, widgetJmlFn, archiveData, auxIn) {
    let nodes = widgetJmlFn(archiveData, auxIn);
    for (const node of nodes) {
        document.querySelector(destQuery).appendChild(node);
    }    
}