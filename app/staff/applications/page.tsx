import { getApplications } from "@/lib/data";
import { ApplicationsManager } from "@/components/staff/applications-manager";

export default async function StaffApplicationsPage() {
  const applications = await getApplications();
  return <ApplicationsManager initial={applications} />;
}
