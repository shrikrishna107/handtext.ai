import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Handwriting Text Converter',
  description: 'Convert regular text to handwriting style',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Comic+Neue&family=Homemade+Apple&family=Indie+Flower&family=Dancing+Script&family=Caveat&family=Shadows+Into+Light&family=Gloria+Hallelujah&family=Allura&family=Great+Vibes&family=Pacifico&family=Alex+Brush&family=La+Belle+Aurore&family=Short+Stack&family=Crafty+Girls&family=Sue+Ellen+Francisco&family=Reenie+Beanie&family=Just+Another+Hand&family=Gochi+Hand&family=Nanum+Pen+Script&family=Coming+Soon&family=Handlee&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
