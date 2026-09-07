import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; to?: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 px-6 text-center">
      <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center mb-4 text-xl">∅</div>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
      {action && (
        <Button className="mt-4" variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-violet-600 mr-2" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-4 flex items-start justify-between gap-4">
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
