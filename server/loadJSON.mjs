export async function loadJSON(filename) {
    try {
        let response = await fetch(`./${filename}`);
        let data = await response.json();
        return data;
    } catch (err) {
        console.error("Failed to load JSON", err);
    }
}
