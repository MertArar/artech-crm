import ActivitySummary from "@/components/summary/ActivitySummary";
import { activityLogs } from "@/data/activityLogs";

export default function SummaryPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-3 py-5 sm:px-5 lg:px-6 2xl:px-8">
      <div className="mx-auto w-full max-w-[1800px]">
        <ActivitySummary items={activityLogs} />
      </div>
    </main>
  );
}