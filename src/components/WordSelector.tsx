import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface WordSelectorProps {
  words: string[];
  onSelectWord: (word: string) => void;
  timeLeft: number;
}

export const WordSelector: React.FC<WordSelectorProps> = ({
  words,
  onSelectWord,
  timeLeft: initialTime
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-select first word if time runs out
      onSelectWord(words[0]);
    }
  }, [timeLeft, words, onSelectWord]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Scegli una parola da disegnare</h1>
          <div className="flex items-center justify-center text-orange-500 text-xl">
            <Clock className="w-6 h-6 mr-2" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {words.map((word, index) => (
            <button
              key={index}
              onClick={() => onSelectWord(word)}
              className="p-8 bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-500 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-2xl font-bold text-black">{word}</div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-gray-600">
          <p>Avrai <strong>60 secondi</strong> per disegnare la parola scelta</p>
          <p className="text-sm mt-2">Ricorda: non potrai vedere quello che stai disegnando!</p>
        </div>
      </div>
    </div>
  );
};