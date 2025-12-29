import Remindering from "./reminder";
import { useAuth } from "../jsx/useAuth";

export default function ReminderPage() {
  const { user } = useAuth();

  return <Remindering role={user?.role} />;
}
