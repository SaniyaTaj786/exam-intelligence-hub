export const metadata = {
  title: 'Exam Hub',
  description: 'AI Exam Analytics Hub Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#ffffff', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
