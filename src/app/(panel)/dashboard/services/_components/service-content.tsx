import { LabelSubscription } from "@/components/ui/label-subscription";
import { canPermission } from "@/utils/permissions/can-permission";
import { getAllService } from "../_data_access/get-all-service";
import { ServicesList } from "./services-list";

interface ServiceContentProps {
  userId: string;
}

export async function ServiceContent({ userId }: ServiceContentProps) {
  const services = await getAllService({ userId });
  const permissions = await canPermission({ type: "service" });

  return (
    <>
      {!permissions.hasPermission && <LabelSubscription expired={permissions.expired} />}

      <ServicesList services={services.data || []} permissions={permissions} />
    </>
  )
}
