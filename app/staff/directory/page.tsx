import { getStaffDirectory } from "@/lib/data";
import { DirectoryManager } from "@/components/staff/directory-manager";

export default async function StaffDirectoryPage() {
  const members = await getStaffDirectory();
  return <DirectoryManager initial={members} />;
}
