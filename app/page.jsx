'use client';

import { useState, useRef } from 'react';
import FontSelector from './components/FontSelector';
import Image from 'next/image';
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function performOCRwithGemini(base64Image) {
  // IMPORTANT: Canvas automatically injects the API key into the __api_key global variable.
  // We explicitly use it here to ensure it's passed correctly.
  const apiKey = typeof __api_key !== 'undefined' ? __api_key : 'AIzaSyCvOI_ixBQSAgQr2gspKlPgPdq6ehyPkew'; // Access the API key provided by Canvas
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;
  
  // Detect image type for correct mimeType
  const matches = base64Image.match(/^data:image\/(png|jpeg|jpg);base64,/);
  const mimeType = matches ? `image/${matches[1] === 'jpg' ? 'jpeg' : matches[1]}` : 'image/png';
  const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  console.log("Attempting OCR with Gemini Vision API...");
  console.log("MIME Type:", mimeType);
  console.log("Base64 Data Snippet (first 100 chars):", base64Data.substring(0, 100) + '...');
  console.log("Using API Key (first 5 chars):", apiKey.substring(0, 5) + '...'); // Log a snippet of the key for confirmation (don't log full key)


  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: "Extract all readable text from this image. Only return the text, nothing else.",
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("Gemini API Full Response:", data); // Log the full response for debugging

    if (!response.ok) {
      // If the response status is not OK, throw an error with more details
      const errorMessage = data.error?.message || `API error: ${response.status} ${response.statusText}`;
      throw new Error(`Failed to perform OCR: ${errorMessage}`);
    }

    // Gemini's response format: data.candidates[0].content.parts[0].text
    const extractedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!extractedText || extractedText.trim() === '') {
        // If Gemini returns no text or empty text, indicate that no text was detected
        return ''; // Return empty string, let the calling function handle the "no text detected" error
    }

    window.alert(`OCR completed successfully! Extracted text having: ${extractedText.length} characters.`);

    return extractedText;

  } catch (error) {
    console.error('Error during Gemini OCR API call:', error);
    throw new Error(`OCR API communication error: ${error.message || 'An unknown error occurred.'}`);
  }
}

function FilePicker({ onTextExtracted, setError, setIsLoading }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG and PNG images are supported.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const base64 = await readFileAsDataURL(file);
      const text = await performOCRwithGemini(base64);
      if (!text.trim()) {
        throw new Error('No readable text detected in the image. Please try a different image.');
      }
      onTextExtracted(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text from image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
      <label
        htmlFor="imageUpload"
        className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
        style={{ color: '#EAEAEA' }}
      >
        Or upload an image (JPG/PNG):
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0F3460] file:text-[#EAEAEA] hover:file:bg-[#00ADB5] transition-all"
      />
    </div>
  );
}
export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Patrick Hand');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          font: selectedFont
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert text');
      }
      
      setOutputText(data.result);
      
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  return (
    <main 
      className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 max-w-full mx-auto"
      style={{ backgroundColor: '#1A1A2E' }}
    >
      <h1 
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8 text-center"
        style={{ color: '#EAEAEA' }}
      >
        Handwriting Text Converter
      </h1>

      <FilePicker 
        onTextExtracted={setInputText}
        setError={setError}
        setIsLoading={setIsLoading}
      />
      
      <form onSubmit={handleSubmit} className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
        <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
          <label 
            htmlFor="inputText" 
            className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
            style={{ color: '#EAEAEA' }}
          >
            Enter your text:
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-md h-28 sm:h-32 md:h-40"
            style={{ 
              backgroundColor: '#16213E', 
              color: '#EAEAEA',
              borderColor: '#0F3460'
            }}
            placeholder="Type or paste text here to convert to handwriting style..."
            required
          />
        </div>
        
        <FontSelector 
          selectedFont={selectedFont} 
          onFontChange={setSelectedFont} 
        />
        
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
          <button
            type="submit"
            disabled={isLoading || !inputText}
            className="px-3 py-2 sm:px-4 sm:py-2 text-white rounded-md text-sm sm:text-base font-medium transition-all"
            style={{ 
              background: 'linear-gradient(45deg, #00ADB5, #FF6F61)',
              boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)',
              opacity: isLoading || !inputText ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting...
              </span>
            ) : 'Convert to Handwriting'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-all"
            style={{ 
              backgroundColor: '#0F3460',
              color: '#EAEAEA',
              boxShadow: '0 4px 10px rgba(0, 173, 181, 0.3)'
            }}
          >
            Reset
          </button>
        </div>
      </form>
      
      {error && (
        <div 
          className="p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-5 rounded-md text-xs sm:text-sm md:text-base"
          style={{ 
            backgroundColor: '#FF6F61', 
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {error}
        </div>
      )}
      
      {outputText && (
        <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8" ref={resultRef}>
          <h2 
            className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4"
            style={{ color: '#EAEAEA' }}
          >
            Handwriting Result:
          </h2>
          <div 
            className="p-3 sm:p-4 md:p-5 lg:p-6 border rounded-md shadow-md overflow-x-auto"
            style={{ 
              backgroundColor: '#16213E',
              borderColor: '#00ADB5'
            }}
            dangerouslySetInnerHTML={{ __html: outputText }}
          />
          <div 
            className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm"
            style={{ color: '#00ADB5' }}
          >
            Using font: <span className="font-medium">{selectedFont}</span>
          </div>
        </div>
      )}
    </main>
  );
}
