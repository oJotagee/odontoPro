import { getAllService } from "../_data_access/get-all-service";
import { ServicesList } from "./services-list";

interface ServiceContentProps {
  userId: string;
}

export async function ServiceContent({ userId }: ServiceContentProps) {
  const services = await getAllService({ userId });

  return (
    <ServicesList services={services.data || []} />
  )
}