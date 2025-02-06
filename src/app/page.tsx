'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypewriterText } from '@/components/TypewriterText';
import { AuthorBadges, type Author } from '@/components/AuthorBadges';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [biography, setBiography] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author>("Ernest Hemingway");

  const generateBiography = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBiography('');

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, author: selectedAuthor }),
    });

    if (!response.ok) {
      const error = await response.json();
      setError(error.message || 'Failed to generate biography');
      setLoading(false);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      setError('Stream not available');
      setLoading(false);
      return;
    }

    let accumulatedText = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const text = new TextDecoder().decode(value);
      const data = JSON.parse(text);
      accumulatedText = data.content;
      setBiography(accumulatedText);
    }
    
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>The Beautiful Beautiful Game</CardTitle>
          <ThemeToggle />
        </CardHeader>
        <CardContent>
          <form onSubmit={generateBiography} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="playerName" className="text-sm font-medium text-muted-foreground">
                Search Footballer
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter footballer's name..."
                className="w-full p-2 border rounded bg-background text-foreground"
                required
              />
            </div>
            <AuthorBadges 
              selectedAuthor={selectedAuthor}
              onAuthorSelect={setSelectedAuthor}
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Generating...' : 'Generate Biography'}
            </Button>
          </form>

          {biography && (
            <div className="prose prose-lg mt-6">
              <TypewriterText text={biography} speed={15} />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
