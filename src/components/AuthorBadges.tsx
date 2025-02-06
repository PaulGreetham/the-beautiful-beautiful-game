'use client';

import { Badge } from "@/components/ui/badge";

const AUTHORS = [
  "Ernest Hemingway",
  "Franz Kafka",
  "Harper Lee",
  "Hunter S. Thompson",
  "Jack Kerouac",
  "Shakespeare",
  "Zadie Smith"
] as const;

type Author = typeof AUTHORS[number];

interface AuthorBadgesProps {
  selectedAuthor: Author;
  onAuthorSelect: (author: Author) => void;
}

export function AuthorBadges({ selectedAuthor, onAuthorSelect }: AuthorBadgesProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Pick Author
      </label>
      <div className="flex flex-wrap gap-3">
        {AUTHORS.map((author) => (
          <Badge
            key={author}
            variant={selectedAuthor === author ? "default" : "outline"}
            className="cursor-pointer text-sm py-2 px-4 hover:scale-105 transition-transform"
            onClick={() => onAuthorSelect(author)}
          >
            {author}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export type { Author }; 