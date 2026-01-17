function init() {
    const container = document.getElementById('tree-container');
    if (typeof projectData !== 'undefined') {
        container.innerHTML = ""; // Clear loader
        renderTree(projectData, container, "");
    } else {
        container.innerText = "Error: data.js not found. Run the Python script.";
    }
}

function renderTree(node, container, indent) {
    const line = document.createElement('div');
    line.className = 'node';
    
    const isDir = node.type === 'directory';
    const icon = isDir ? "📁" : "📄";
    const className = isDir ? "folder-name" : "file-name";
    
    line.innerHTML = `${indent}${icon} <span class="${className}">${node.name}</span>`;
    
    if (isDir) {
        line.onclick = (e) => {
            e.stopPropagation();
            displayFolderContents(node);
        };
    }

    container.appendChild(line);

    if (isDir && node.children) {
        node.children.forEach((child, index) => {
            const isLast = index === node.children.length - 1;
            const branch = isLast ? "└── " : "├── ";
            const nextIndent = indent + (isLast ? "    " : "│   ");
            renderTree(child, container, indent + branch);
        });
    }
}

function displayFolderContents(folder) {
    document.getElementById('view-title').innerText = `Contents of: ${folder.name}`;
    const listing = document.getElementById('folder-listing');
    listing.innerHTML = "";
    
    // Filter to show only files in the concrete div
    const files = folder.children.filter(c => c.type === 'file');
    
    if (files.length === 0) {
        listing.innerHTML = "<li>No files in this folder.</li>";
    } else {
        files.forEach(f => {
            const li = document.createElement('li');
            li.className = 'content-item';
            li.innerText = `📄 ${f.name}`;
            listing.appendChild(li);
        });
    }
}

init();
