'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypewriterText } from '@/components/TypewriterText';
import { AuthorBadges, type Author } from '@/components/AuthorBadges';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [biography, setBiography] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author>("Ernest Hemingway");

  const generateBiography = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBiography('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName, author: selectedAuthor }),
      });
      
      const data = await response.json();
      setBiography(data.content);
    } catch (error) {
      console.error('Failed to generate biography:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>The Beautiful Beautiful Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generateBiography} className="space-y-4">
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
              <TypewriterText text={biography} speed={30} />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
