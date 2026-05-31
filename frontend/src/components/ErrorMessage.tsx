type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
      {message}
    </div>
  );
}