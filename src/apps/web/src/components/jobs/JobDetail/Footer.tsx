interface FooterProps {
  createdAt: Date;
  updatedAt: Date;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Footer({ createdAt, updatedAt }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 pt-4 text-xs text-neutral-500">
      <p>
        Posted: {formatDate(createdAt)}
        {updatedAt && updatedAt !== createdAt && ` · Updated: ${formatDate(updatedAt)}`}
      </p>
    </footer>
  );
}
