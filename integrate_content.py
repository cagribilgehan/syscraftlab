import re

# Read original book.tex
with open('book.tex', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

# Read new foreword and chapter 1
with open('onsoz_ve_bolum1_yeni.tex', 'r', encoding='utf-8') as f:
    new_content = f.read()

# Keep preamble (lines 1-50) and content from Chapter 2 onwards (line 912+)
# Preamble ends at line 50 (\begin{document}, \maketitle, \tableofcontents)
preamble_end = 50  # Keep until line 50 (index 49)
chapter2_start = 911  # Line 912 (index 911)

# Build new file
new_lines = []

# Add preamble (lines 1-50)
new_lines.extend(lines[:preamble_end])

# Add new foreword and chapter 1 content
new_lines.append('')  # Empty line after tableofcontents
new_lines.append(new_content)

# Add chapter 2 onwards (from line 912)
new_lines.extend(lines[chapter2_start:])

# Write updated file
with open('book.tex', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("book.tex güncellendi!")
print(f"Toplam satır: {len(new_lines)}")
