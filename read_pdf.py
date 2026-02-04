import pdfplumber

with pdfplumber.open('book.pdf') as pdf:
    with open('book_content.txt', 'w', encoding='utf-8') as out:
        for i, page in enumerate(pdf.pages):
            out.write(f'--- Sayfa {i+1} ---\n')
            text = page.extract_text()
            if text:
                out.write(text)
            out.write('\n\n')

print("İçerik book_content.txt dosyasına yazıldı.")
