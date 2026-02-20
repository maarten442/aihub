import Link from 'next/link';
import { Lightbulb, Plus, Star, ListOrdered, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UseCase } from '@/types';

async function getUseCases(): Promise<UseCase[]> {
  const { data } = await supabase
    .from('use_cases')
    .select('*, user:users(*)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  return (data ?? []) as UseCase[];
}

const complexityBadge: Record<string, { label: string; variant: 'success' | 'info' | 'warning' }> = {
  beginner: { label: 'Beginner', variant: 'success' },
  intermediate: { label: 'Intermediate', variant: 'info' },
  advanced: { label: 'Advanced', variant: 'warning' },
};

export default async function UseCasesPage() {
  const useCases = await getUseCases();
  const featured = useCases.find((uc) => uc.is_featured);
  const categories = [...new Set(useCases.map((uc) => uc.category))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Use Case Library</h1>
          <p className="text-muted-foreground">
            Discover how your colleagues are using AI tools to work smarter. Share your own use case!
          </p>
        </div>
        <Link href="/use-cases/submit">
          <Button>
            <Plus className="h-4 w-4" />
            Share Use Case
          </Button>
        </Link>
      </div>

      {/* Featured Use Case */}
      {featured && (
        <Card className="border-2 border-accent-400 bg-accent-50/50">
          <CardContent>
            <div className="mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-accent-600" />
              <span className="text-sm font-semibold text-accent-600">Featured Use Case</span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">{featured.title}</h2>
            <p className="mb-4 text-muted-foreground">{featured.description}</p>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {(() => {
                const badge = complexityBadge[featured.complexity];
                return badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null;
              })()}
              {featured.tools.map((tool) => (
                <Badge key={tool} variant="purple">
                  <Wrench className="mr-1 h-3 w-3" />
                  {tool}
                </Badge>
              ))}
            </div>
            {featured.steps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Workflow Steps</h3>
                <ol className="space-y-1">
                  {featured.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-medium text-foreground">{step.title}</span>
                        <span className="text-muted-foreground"> — {step.description}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {featured.user && (
              <p className="mt-4 text-xs text-muted-foreground">
                Shared by {featured.user.name}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge key={cat} variant="purple" className="cursor-default">
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {/* Use Cases Grid */}
      {useCases.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => {
            const badge = complexityBadge[useCase.complexity];
            return (
              <Card key={useCase.id} hover className="flex flex-col">
                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
                    {useCase.is_featured && (
                      <Star className="h-4 w-4 text-accent-500" />
                    )}
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{useCase.title}</h3>
                  <p className="mb-3 flex-1 text-sm text-muted-foreground line-clamp-3">
                    {useCase.description}
                  </p>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {useCase.tools.map((tool) => (
                      <Badge key={tool} variant="purple" className="text-[10px]">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ListOrdered className="h-3 w-3" />
                      {useCase.steps.length} step{useCase.steps.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {useCase.user?.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Lightbulb className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p className="mb-4 text-lg font-medium">No use cases yet</p>
            <p className="mb-6">Be the first to share how you&apos;re using AI at work.</p>
            <Link href="/use-cases/submit">
              <Button>
                <Plus className="h-4 w-4" /> Share Use Case
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
