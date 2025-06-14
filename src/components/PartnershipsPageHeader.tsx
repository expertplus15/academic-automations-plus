interface PartnershipsPageHeaderProps {
  title: string;
  subtitle: string;
}

export function PartnershipsPageHeader({ title, subtitle }: PartnershipsPageHeaderProps) {
  return (
    <header className="bg-card border-b border-border/20 px-8 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </header>
  );
}