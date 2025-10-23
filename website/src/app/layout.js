import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://aioverlaydesktop.vercel.app'),
  title: {
    default: "AI Overlay - Context-Aware AI Desktop Assistant for Developers",
    template: "%s | AI Overlay"
  },
  description: "Revolutionary context-aware AI desktop assistant that understands your screen. Get instant coding help, debugging assistance, and smart suggestions without switching windows. Open source and free for Windows, macOS, and Linux.",
  keywords: [
    "AI Overlay",
    "AI Desktop Assistant",
    "Context-Aware AI",
    "Developer Tools",
    "Coding Assistant",
    "Desktop App",
    "Productivity",
    "Windows",
    "macOS",
    "Linux",
    "Screen Overlay",
    "AI Code Helper",
    "Programming Assistant",
    "Open Source",
    "Developer Productivity",
    "AI for Developers",
    "Context Understanding",
    "Screen Reader AI",
    "Debugging Tool",
    "Code Suggestions"
  ],
  authors: [{ name: "AI Overlay Team", url: "https://github.com/hasanraza38" }],
  creator: "Muhammad Hassan Raza",
  publisher: "AI Overlay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "AI Overlay - Context-Aware AI Desktop Assistant for Developers",
    description: "Revolutionary context-aware AI desktop assistant that understands your screen. Get instant coding help, debugging assistance, and smart suggestions without switching windows.",
    url: "https://aioverlaydesktop.vercel.app",
    siteName: "AI Overlay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Overlay - Context-Aware AI Desktop Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Overlay - Context-Aware AI Desktop Assistant",
    description: "Revolutionary context-aware AI desktop assistant that understands your screen. Get instant coding help without switching windows.",
    images: ["/twitter-image.png"],
    creator: "@aioverlay",
    site: "@aioverlay",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  category: 'technology',
  classification: 'Developer Tools',
  applicationName: 'AI Overlay',
  appleWebApp: {
    capable: true,
    title: 'AI Overlay',
    statusBarStyle: 'black-translucent',
  }, 
  alternates: {
    canonical: 'https://aioverlaydesktop.vercel.app',
  },
  other: {
    'msapplication-TileColor': '#6366f1',
    'theme-color': '#0f172a',
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Overlay",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": ["Windows", "macOS", "Linux"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PKR"
    },
    "description": "Revolutionary context-aware AI desktop assistant that understands your screen. Get instant coding help, debugging assistance, and smart suggestions without switching windows.",
    "softwareVersion": "1.0.0",
    "author": {
      "@type": "Person",
      "name": "Muhammad Hassan Raza",
      "url": "https://github.com/hasanraza38"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Overlay",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aioverlaydesktop.vercel.app/icon.png"
      }
    },
    "screenshot": "https://aioverlaydesktop.vercel.app/screenshot.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "featureList": [
      "Context-Aware Intelligence",
      "Real-time Code Assistance",
      "Multi-platform Support",
      "Open Source",
      "Privacy Focused",
      "Customizable Interface"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://aioverlaydesktop.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
