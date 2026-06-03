import ProfileCard from "@/components/profile/ProfileCard";
import TaskCalendar from "@/components/profile/TaskCalendar";
import TodoList from "@/components/profile/TodoList";
import { todos, userProfile } from "@/data/profile";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Profil
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
          Kullanıcı Profili
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Kullanıcı bilgileri, görev durumu ve takvim görünümü.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ProfileCard user={userProfile} />

        <TodoList todos={todos} />
      </div>

      <TaskCalendar todos={todos} />
    </div>
  );
}