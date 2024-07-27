export function applyWidgetJml(widgetJmlFn, data, destQuery) {
    let ui = widgetJmlFn(data);
    for (const node of ui) {
        document.querySelector(destQuery).appendChild(node);
    }    
}