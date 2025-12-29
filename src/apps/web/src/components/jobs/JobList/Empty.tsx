import {
  Empty as EmptyContainer,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export default function Empty() {
  return (
    <EmptyContainer className="bg-copper-100 shadow-inner">
      <EmptyHeader className="text-muted-foreground/80">
        <EmptyTitle className="font-semibold">No Jobs Found</EmptyTitle>
        <EmptyDescription className="text-muted-foreground/80">No jobs are currently viewable.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Clear Filters</Button>
          <Button variant="secondary">Refresh</Button>
        </div>
      </EmptyContent>
  </EmptyContainer>
  );
}
