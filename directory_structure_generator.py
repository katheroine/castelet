import os
import json

def get_directory_dict(path):
    d = {'name': os.path.basename(os.path.abspath(path)), 'type': 'directory'}
    try:
        children = []
        # Sort: Folders first, then files
        for entry in sorted(os.scandir(path), key=lambda e: (not e.is_dir(), e.name.lower())):
            if entry.name.startswith('.') or entry.name in ["__pycache__", "directory_structure_generator.py", "data.js", "script.js", "index.html", "README.md"]:
                continue
            if entry.is_dir():
                children.append(get_directory_dict(entry.path))
            else:
                children.append({'name': entry.name, 'type': 'file'})
        d['children'] = children
    except PermissionError:
        pass
    return d

if __name__ == "__main__":
    structure = get_directory_dict('.')
    # Write as a JS variable instead of pure JSON
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write("const projectData = ")
        json.dump(structure, f, indent=2)
        f.write(";")
    print("✅ data.js generated successfully!")
