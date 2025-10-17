import { Card } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="flex gap-6 px-8 py-4">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="min-h-[480px] w-[380px] flex-shrink-0 overflow-hidden"
        >
          <div className="h-full animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:1000px_100%]" />
        </Card>
      ))}
    </div>
  );
}
