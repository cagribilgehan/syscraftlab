import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'LabLudus | The Grand Library',
    description: 'Teknik kitapları interaktif maceralara dönüştüren platform. Kod yazarak öğren, hata yaparak ustalaş.',
    keywords: ['yazılım mimarisi', 'coding challenge', 'gamification', 'learn to code'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" className="dark">
            <body className="bg-dark-bg text-dark-text min-h-screen cyber-grid">
                {children}
            </body>
        </html>
    );
}
