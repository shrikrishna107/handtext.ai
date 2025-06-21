'use client';

import { useState, useRef } from 'react';
import FontSelector from './components/FontSelector';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Patrick Hand');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null); // Fixed: removed type annotation for JSX

  // Define the handleSubmit function inside the component
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
      
      // Scroll to result
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
    <main className="min-h-screen p-4 md:p-8 max-w-full md:max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">Handwriting Text Converter</h1>
      
      <form onSubmit={handleSubmit} className="mb-6 md:mb-8">
        <div className="mb-4 md:mb-6">
          <label htmlFor="inputText" className="block mb-2 font-medium">
            Enter your text:
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2 md:p-3 border rounded-md h-28 md:h-40"
            placeholder="Type or paste text here to convert to handwriting style..."
            required
          />
        </div>
        
        <FontSelector 
          selectedFont={selectedFont} 
          onFontChange={setSelectedFont} 
        />
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            disabled={isLoading || !inputText}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 w-full sm:w-auto"
          >
            {isLoading ? 'Converting...' : 'Convert to Handwriting'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-3 md:p-4 mb-4 md:mb-6 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm md:text-base">
          {error}
        </div>
      )}
      
      {outputText && (
        <div className="mt-6 md:mt-8" ref={resultRef}>
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Handwriting Result:</h2>
          <div 
            className="p-4 md:p-6 bg-black border rounded-md shadow-md overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: outputText }}
          />
          <div className="mt-2 md:mt-4 text-xs md:text-sm text-gray-500">
            Using font: <span className="font-medium">{selectedFont}</span>
          </div>
        </div>
      )}
    </main>
  );
}
