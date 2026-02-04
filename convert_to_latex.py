import re

def convert_to_latex():
    with open('book_content.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove page markers
    content = re.sub(r'--- Sayfa \d+ ---\s*', '', content)
    
    # Escape LaTeX special characters
    def escape_latex(text):
        chars = {
            '&': r'\&',
            '%': r'\%',
            '$': r'\$',
            '#': r'\#',
            '_': r'\_',
            '{': r'\{',
            '}': r'\}',
            '~': r'\textasciitilde{}',
            '^': r'\textasciicircum{}',
        }
        # Don't escape backslashes that are part of LaTeX commands
        for char, replacement in chars.items():
            text = text.replace(char, replacement)
        return text
    
    # LaTeX preamble
    latex = r'''\documentclass[11pt,a4paper]{book}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[turkish]{babel}
\usepackage{geometry}
\usepackage{graphicx}
\usepackage{hyperref}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{tcolorbox}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{array}
\usepackage{fancyhdr}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{amsmath}
\usepackage{amssymb}

\geometry{margin=2.5cm}

\lstset{
    basicstyle=\ttfamily\small,
    breaklines=true,
    frame=single,
    numbers=none,
    backgroundcolor=\color{gray!10},
    keywordstyle=\color{blue},
    commentstyle=\color{green!50!black},
    stringstyle=\color{red!70!black},
    showstringspaces=false,
    tabsize=2,
    literate={ı}{{\i}}1 {İ}{{\.I}}1 {ğ}{{\u{g}}}1 {Ğ}{{\u{G}}}1 {ü}{{\"u}}1 {Ü}{{\"U}}1 {ş}{{\c{s}}}1 {Ş}{{\c{S}}}1 {ö}{{\"o}}1 {Ö}{{\"O}}1 {ç}{{\c{c}}}1 {Ç}{{\c{C}}}1
}

\newtcolorbox{ipucu}{colback=blue!5,colframe=blue!75!black,title=\.Ipucu}
\newtcolorbox{dikkat}{colback=red!5,colframe=red!75!black,title=Dikkat}
\newtcolorbox{ornekolay}{colback=green!5,colframe=green!50!black,title=\"Ornek Olay}

\title{\textbf{Yaz{\i}l{\i}m Mimarisi 3.0}\\
\large Koddan Buluta, Buluttan Otonom Ajanlara}
\author{Yazar: Fatih \c{C}a\u{g}r{\i} B\.ILGEHAN\\
Edit\"or: Dr.\"O\u{g}r.\"Uyesi \"Ozkan ASLAN}
\date{2026}

\begin{document}

\maketitle
\tableofcontents

'''
    
    # Process content by parts
    lines = content.split('\n')
    
    in_listing = False
    listing_content = []
    
    for line in lines:
        line = line.strip()
        if not line:
            if not in_listing:
                latex += '\n'
            continue
        
        # Skip TOC pages and roman numerals (ii, iii, iv, etc.)
        if re.match(r'^[ivxlc]+$', line.lower()) or line.isdigit():
            continue
        
        # Parts
        if line.startswith('Kısım ') or line.startswith('Kisim '):
            part_match = re.match(r'K[ıi]s[ıi]m\s+([IVX]+)', line)
            if part_match:
                latex += f'\n\\part{{{line}}}\n'
                continue
        
        # Chapters
        if line.startswith('Bölüm ') or line.startswith('Bolum '):
            chap_match = re.match(r'B[öo]l[üu]m\s+(\d+)', line)
            if chap_match:
                latex += f'\n\\chapter{{{line}}}\n'
                continue
        
        # Sections
        if re.match(r'^\d+\.\d+\s+', line):
            latex += f'\n\\section{{{line}}}\n'
            continue
        
        # Subsections
        if re.match(r'^\d+\.\d+\.\d+\s+', line):
            latex += f'\n\\subsection{{{line}}}\n'
            continue
        
        # Appendices
        if line.startswith('Mimari Anti-Patterns') or line.startswith('Araç ve Teknoloji'):
            latex += f'\n\\chapter*{{{line}}}\n\\addcontentsline{{toc}}{{chapter}}{{{line}}}\n'
            continue
        
        # Listing markers
        if line.startswith('Listing '):
            if listing_content:
                latex += '\\begin{lstlisting}\n'
                latex += '\n'.join(listing_content)
                latex += '\n\\end{lstlisting}\n'
                listing_content = []
                in_listing = False
            latex += f'\\textit{{{line}}}\n\n'
            continue
        
        # Code blocks detection
        if any(kw in line for kw in ['CLASS ', 'FUNCTION ', 'INTERFACE ', 'def ', 'class ', 
                                      '// ', 'apiVersion:', 'kind:', 'spec:', 'FROM ', 'RUN ',
                                      'CREATE TABLE', 'SELECT ', 'INSERT ', 'UPDATE ',
                                      'GOAL:', 'STEP ', '// PHASE', 'AGENTS =', 'ROUTES:',
                                      'BEGIN TRANSACTION', 'COMMIT', 'prompt =', 'response =']):
            if not in_listing:
                in_listing = True
                listing_content = [line]
            else:
                listing_content.append(line)
            continue
        
        if in_listing:
            if line and not line[0].isupper() or any(c in line for c in ['=', '{', '}', '(', ')', '->', '//']):
                listing_content.append(line)
                continue
            else:
                latex += '\\begin{lstlisting}\n'
                latex += '\n'.join(listing_content)
                latex += '\n\\end{lstlisting}\n'
                listing_content = []
                in_listing = False
        
        # Special boxes
        if 'İpucu' in line or 'Ipucu' in line:
            latex += '\\begin{ipucu}\n'
            continue
        if 'Dikkat' in line:
            latex += '\\begin{dikkat}\n'
            continue
        if 'Örnek Olay' in line or 'Ornek Olay' in line:
            latex += '\\begin{ornekolay}\n'
            continue
        
        # Tables
        if '|' in line and line.count('|') >= 2:
            cols = [c.strip() for c in line.split('|') if c.strip()]
            if all(c == '-' * len(c) for c in cols):
                continue  # Skip separator
            latex += ' & '.join(cols) + ' \\\\\n'
            continue
        
        # Quotes (italics)
        if line.startswith('"') or line.startswith('"') or line.startswith("'"):
            latex += f'\\textit{{{line}}}\n\n'
            continue
        
        # Author quotes
        if line.startswith('—') or line.startswith('- '):
            latex += f'\\hfill {line}\n\n'
            continue
        
        # Bullet points
        if line.startswith('•') or line.startswith('- '):
            latex += f'\\item {line[2:]}\n'
            continue
        
        # Regular paragraph
        latex += line + '\n\n'
    
    # Close any open listing
    if listing_content:
        latex += '\\begin{lstlisting}\n'
        latex += '\n'.join(listing_content)
        latex += '\n\\end{lstlisting}\n'
    
    latex += '\n\\end{document}\n'
    
    # Write output
    with open('book.tex', 'w', encoding='utf-8') as f:
        f.write(latex)
    
    print("LaTeX dosyası oluşturuldu: book.tex")

if __name__ == '__main__':
    convert_to_latex()
