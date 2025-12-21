document.getElementById('download-btn').addEventListener('click', function() {
    exportElementAsPNG('slide-to-export', 'my-castelet-slide.png');
});

async function exportElementAsPNG(elementId, fileName) {
    const element = document.getElementById(elementId);
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Manually extract styles (only from local/internal stylesheets)
    let styleString = '';
    for (const sheet of document.styleSheets) {
        try {
            const rules = sheet.cssRules || sheet.rules;
            for (const rule of rules) {
                styleString += rule.cssText;
            }
        } catch (e) {
            // This skips external CSS (like Google Fonts) which cause the Taint
            console.warn("Skipping external stylesheet to prevent CORS error");
        }
    }

    // 2. Build the SVG string
    // We must use 'xmlns' explicitly for every container
    const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%; height:100%;">
                    <style>${styleString}</style>
                    ${element.outerHTML}
                </div>
            </foreignObject>
        </svg>
    `;

    // 3. Convert to a Data URL instead of a Blob
    // This is sometimes treated more leniently by local browsers
    const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
    const img = new Image();
    
    img.onload = function() {
        try {
            ctx.drawImage(img, 0, 0);
            
            // 4. Try to export
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (e) {
            console.error("Export failed:", e);
            alert("Security Error: Browsers block image export when running files locally (file://). \n\nPlease try one of the following:\n1. Use a local server (Live Server).\n2. Use Firefox (it is often more relaxed with local file security than Chrome).");
        }
    };

    img.src = "data:image/svg+xml;base64," + svgBase64;
}