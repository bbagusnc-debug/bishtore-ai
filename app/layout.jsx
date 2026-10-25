export const metadata = {
  title: "Bishtore AI",
  description: "Asisten Cerdas & Analisis Visual",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
