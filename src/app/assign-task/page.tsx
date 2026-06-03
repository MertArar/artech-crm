import AssignTaskPageContent from "@/components/assign-task/AssignTaskPageContent";
import { users } from "@/data/users";

export default function AssignTaskPage() {
  return <AssignTaskPageContent users={users} />;
}