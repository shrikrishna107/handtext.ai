'use client';

import React from 'react';

const fonts = [
  // Original fonts
  { name: 'Patrick Hand', value: 'Patrick Hand' },
  { name: 'Comic Neue', value: 'Comic Neue' },
  { name: 'Homemade Apple', value: 'Homemade Apple' },
  { name: 'Indie Flower', value: 'Indie Flower' },
  { name: 'Dancing Script', value: 'Dancing Script' },
  { name: 'Caveat', value: 'Caveat' },
  { name: 'Shadows Into Light', value: 'Shadows Into Light' },
  { name: 'Gloria Hallelujah', value: 'Gloria Hallelujah' },
  { name: 'Allura', value: 'Allura' },
  { name: 'Great Vibes', value: 'Great Vibes' },
  { name: 'Pacifico', value: 'Pacifico' },
  { name: 'Alex Brush', value: 'Alex Brush' },
  
  // Additional fonts
  { name: 'La Belle Aurore', value: 'La Belle Aurore' },
  { name: 'Short Stack', value: 'Short Stack' },
  { name: 'Crafty Girls', value: 'Crafty Girls' },
  { name: 'Sue Ellen Francisco', value: 'Sue Ellen Francisco' },
  { name: 'Reenie Beanie', value: 'Reenie Beanie' },
  { name: 'Just Another Hand', value: 'Just Another Hand' },
  { name: 'Gochi Hand', value: 'Gochi Hand' },
  { name: 'Nanum Pen Script', value: 'Nanum Pen Script' },
  { name: 'Coming Soon', value: 'Coming Soon' },
  { name: 'Handlee', value: 'Handlee' },
];

const FontSelector = ({ selectedFont, onFontChange }) => {
  // Static sample text for all font previews
  const sampleText = "Select this font to preview it. This is a sample text that will be displayed in the selected font.";
  
  return (
    <div className="mb-6">
      <label htmlFor="fontSelector" className="block mb-2 font-medium">
        Choose a handwriting font:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
        {fonts.map((font) => (
          <div
            key={font.value}
            className={`p-2 md:p-4 border rounded-md cursor-pointer hover:bg-gray-700 transition-colors ${
              selectedFont === font.value ? 'border-blue-500 bg-black' : 'border-gray-300'
            }`}
            onClick={() => onFontChange(font.value)}
          >
            <p className="text-base md:text-lg mb-1 md:mb-2 font-medium truncate">{font.name}</p>
            <p 
              className="text-sm md:text-base overflow-hidden" 
              style={{ fontFamily: font.value }}
            >
              {sampleText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;
