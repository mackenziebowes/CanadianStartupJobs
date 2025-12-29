interface DescriptionProps {
  description: string;
}

export default function Description({ description }: DescriptionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-neutral-900 mb-3">Description</h2>
      <div className="prose prose-sm max-w-none text-neutral-700">
        <p className="whitespace-pre-wrap">{description}</p>
      </div>
    </section>
  );
}
