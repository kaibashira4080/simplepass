import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "パスワード生成 | SimplePass",
    description: "お好みのパスワードを生成（自動作成）することができるツールです。文字数は2～40文字まで、個数は最大1,000個まで生成できます。",
    keywords: ["パスワード生成", "パスワード作成", "ランダム", "セキュリティ"],
    openGraph: {
        title: "パスワード生成 | SimplePass",
        description: "お好みのパスワードを生成（自動作成）することができるツールです。",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
