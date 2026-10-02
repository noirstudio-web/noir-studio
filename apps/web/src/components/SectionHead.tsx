export function SectionHead({ id, eyebrow, title, lead, className = '' }: {
  id: string; eyebrow: string; title: React.ReactNode; lead: string; className?: string;
}) {
  return (
    <header className={`section__head reveal ${className}`}>
      <p className="eyebrow"><span aria-hidden="true">✦</span> {eyebrow}</p>
      <h2 className="section__title" id={id}>{title}</h2>
      <p className="section__lead">{lead}</p>
    </header>
  );
}
