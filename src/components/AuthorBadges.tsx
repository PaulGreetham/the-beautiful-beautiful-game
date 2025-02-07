'use client';

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
      <label className="text-sm font-medium text-accent">
        Pick Author
      </label>
      <div className="flex flex-wrap gap-3">
        {AUTHORS.map((author) => (
          <Badge
            key={author}
            variant={selectedAuthor === author ? "default" : "outline"}
            className={cn(
              "cursor-pointer text-sm py-2 px-4 hover:scale-105 transition-all",
              selectedAuthor === author 
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                : "border-secondary/20 hover:border-secondary hover:bg-secondary/10"
            )}
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