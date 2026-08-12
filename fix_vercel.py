import os
import glob
import re

# --- 1. RENAME DIRECTORIES AND FILES ---

def slugify(filename):
    """Converts a filename like 'Relief logo_A.png' to 'relief-logo-a.png'"""
    name, ext = os.path.splitext(filename)
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9\-]', '-', name)
    name = re.sub(r'\-+', '-', name).strip('-')
    return name + ext.lower()

replacement_map = {}
replacement_map['IMAGES/'] = 'images/'
replacement_map['CSS/'] = 'css/'
replacement_map['JS/'] = 'js/'

images_dir = 'images'
if os.path.exists(images_dir):
    for root, dirs, files in os.walk(images_dir, topdown=False):
        for name in files:
            old_path = os.path.join(root, name)
            new_name = slugify(name)
            if new_name != name:
                new_path = os.path.join(root, new_name)
                os.rename(old_path, new_path)
                replacement_map[name] = new_name
                replacement_map[name.replace(' ', '%20')] = new_name

        for name in dirs:
            old_path = os.path.join(root, name)
            new_name = slugify(name)
            
            if name == "Diksha J. Kanani-potos": new_name = "dr-diksha-kanani"
            elif name == "Dr. Sagar R. Bhimani-photos": new_name = "dr-sagar-bhimani"
            
            if new_name != name:
                new_path = os.path.join(root, new_name)
                os.rename(old_path, new_path)
                replacement_map[name + '/'] = new_name + '/'
                replacement_map[name.replace(' ', '%20') + '/'] = new_name + '/'

print("File & Directory renaming complete.")

# --- 2. UPDATE REFERENCES IN HTML, CSS, JS ---

files_to_process = []
files_to_process.extend(glob.glob('*.html'))
files_to_process.extend(glob.glob('css/*.css'))
files_to_process.extend(glob.glob('js/*.js'))

for filepath in files_to_process:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    content = content.replace('IMAGES/', 'images/')
    content = content.replace('CSS/', 'css/')
    content = content.replace('JS/', 'js/')
    
    for old_str, new_str in sorted(replacement_map.items(), key=lambda x: len(x[0]), reverse=True):
        if old_str in content:
            content = content.replace(old_str, new_str)
            
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated references in: {filepath}")

print("Reference updates complete.")
