import os
import glob
import re

def slugify(filename):
    name, ext = os.path.splitext(filename)
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9\-]', '-', name)
    name = re.sub(r'\-+', '-', name).strip('-')
    return name + ext.lower()

def replace_images_paths(match):
    full_path = match.group(1) # e.g. images/Logo/Relief logo_A.png
    parts = full_path.split('/')
    new_parts = [slugify(p.replace('%20', ' ')) if i > 0 else p for i, p in enumerate(parts)]
    # Apply custom renames
    for i, p in enumerate(new_parts):
        if p == "diksha-j-kanani-potos": new_parts[i] = "dr-diksha-kanani"
        elif p == "dr-sagar-r-bhimani-photos": new_parts[i] = "dr-sagar-bhimani"
    
    return 'src="' + '/'.join(new_parts) + '"'

def replace_url_paths(match):
    full_path = match.group(1) # e.g. ../IMAGES/facial-treatment.png
    # Replace IMAGES with images
    full_path = full_path.replace('IMAGES', 'images')
    parts = full_path.split('/')
    
    new_parts = []
    for p in parts:
        if p in ['..', '.', 'images']:
            new_parts.append(p)
        else:
            p_slug = slugify(p.replace('%20', ' '))
            if p_slug == "diksha-j-kanani-potos": p_slug = "dr-diksha-kanani"
            elif p_slug == "dr-sagar-r-bhimani-photos": p_slug = "dr-sagar-bhimani"
            new_parts.append(p_slug)
            
    return 'url(\'' + '/'.join(new_parts) + '\')'

files_to_process = []
files_to_process.extend(glob.glob('*.html'))
files_to_process.extend(glob.glob('css/*.css'))
files_to_process.extend(glob.glob('js/*.js'))

for filepath in files_to_process:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Also handle some edge cases
    content = content.replace('IMAGES/', 'images/')
    content = content.replace('CSS/', 'css/')
    content = content.replace('JS/', 'js/')
    
    # src="images/..."
    content = re.sub(r'src="(images/[^"]+)"', replace_images_paths, content, flags=re.IGNORECASE)
    
    # url('../images/...') or url('images/...')
    content = re.sub(r'url\([\'"]?([^)]*images/[^)\'"]+)[\'"]?\)', replace_url_paths, content, flags=re.IGNORECASE)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated paths in: {filepath}")

print("Path updates complete.")
