import UsersPageContent from "@/components/users/UsersPageContent";
import { users } from "@/data/users";

export default function UsersPage() {
  return <UsersPageContent users={users} />;
}