'use client';

import React from 'react';

const fonts = [
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
  const sampleText = "Select this font to preview it. This is a sample text that will be displayed in the selected font.";

  return (
    <div className="mb-6">
      <label
        htmlFor="fontSelector"
        className="block mb-2 font-medium text-base md:text-lg"
        style={{ color: '#EAEAEA' }}
      >
        Choose a handwriting font:
      </label>
      <div
        className="
          grid 
          grid-cols-1 
          xs:grid-cols-2 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-5 
          gap-2 
          md:gap-4
        "
      >
        {fonts.map((font) => {
          const isSelected = selectedFont === font.value;
          return (
            <div
              key={font.value}
              className={`
                p-2 sm:p-3 md:p-4 rounded-md cursor-pointer transition-all duration-200
                ${isSelected ? '' : 'border'}
              `}
              style={{
                backgroundColor: isSelected ? '#FF6F61' : '#0F3460',
                color: isSelected ? '#FFFFFF' : '#EAEAEA',
                border: isSelected ? `2px solid #FF6F61` : `2px solid #00ADB5`,
                boxShadow: isSelected
                  ? '0 0 10px rgba(255, 111, 97, 0.6)'
                  : '0 0 0 transparent',
                outline: isSelected ? '2px solid #FF6F61' : 'none',
                fontWeight: isSelected ? 700 : 500,
              }}
              onClick={() => onFontChange(font.value)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onFontChange(font.value);
              }}
              role="button"
              aria-pressed={isSelected}
            >
              <p className="text-sm sm:text-base md:text-lg mb-1 md:mb-2 font-medium truncate">
                {font.name}
              </p>
              <p
                className="text-xs sm:text-sm md:text-base overflow-hidden"
                style={{
                  fontFamily: font.value,
                  minHeight: '2.5em',
                  color: isSelected ? '#FFFFFF' : '#EAEAEA',
                }}
              >
                {sampleText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FontSelector;
