import './globals.css'

export const metadata = {
  title: 'Purple Tiers',
  description: 'Official SMP Tier List',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}