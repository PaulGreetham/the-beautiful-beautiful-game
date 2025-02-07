'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypewriterText } from '@/components/TypewriterText';
import { AuthorBadges, type Author } from '@/components/AuthorBadges';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { FlickeringGridBackground } from "@/components/FlickeringGridBackground";
import { LoadingProgress } from "@/components/LoadingProgress";

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
    <>
      <FlickeringGridBackground />
      <div className="relative min-h-screen w-full bg-background/50">
        <main className="max-w-2xl mx-auto p-6">
          <Card className="border-secondary/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-secondary/20">
              <CardTitle className="text-accent font-bold">The Beautiful Beautiful Game</CardTitle>
              <ThemeToggle />
            </CardHeader>
            <CardContent className="mt-6">
              <form onSubmit={generateBiography} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="playerName" className="text-sm font-medium text-accent">
                    Search Footballer
                  </label>
                  <input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter footballer's name..."
                    className="w-full p-3 border-2 border-secondary/20 rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent transition-colors"
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
                  variant="secondary"
                  className="w-full font-medium"
                >
                  Generate Biography
                </Button>

                {loading && (
                  <div className="flex justify-center items-center mt-6">
                    <LoadingProgress />
                  </div>
                )}
              </form>

              {biography && (
                <div className="prose prose-lg mt-6 text-foreground">
                  <TypewriterText text={biography} speed={15} />
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
