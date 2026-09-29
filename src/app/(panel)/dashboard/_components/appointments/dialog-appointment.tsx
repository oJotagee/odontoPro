import { format } from "date-fns"

import { AppointmentWithService } from "./appointments-list";
import { convertCentsToReal } from "@/utils/convertCurrency";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface DialogAppointmentProps {
  appointment: AppointmentWithService | null
}

export function DialogAppointment({ appointment }: DialogAppointmentProps) {
  return (
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Detalhes do agendamento</DialogTitle>
					<DialogDescription>
						Veja todos os detalhes do agendamento.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					{appointment && (
						<article>
							<p>
								<span className="font-semibold">Horario agendamento:</span>{" "}
								{appointment.time}
							</p>
							<p className="mb-2">
								<span className="font-semibold">Data do agendamento:</span>{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(new Date(appointment.appointmentDate))}
							</p>
							<p>
								<span className="font-semibold">Nome:</span> {appointment.name}
							</p>
							<p>
								<span className="font-semibold">Telefone:</span>{" "}
								{appointment.phone}
							</p>
							<p>
								<span className="font-semibold">E-mail:</span>{" "}
								{appointment.email}
							</p>

							<section className="bg-gray-100 mt-4 p-2 rounded-md">
								<p>
									<span className="font-semibold">Servico:</span>{" "}
									{appointment.service.name}
								</p>
								<p>
									<span className="font-semibold">Servico:</span>{" "}
									{convertCentsToReal(appointment.service.price)}
								</p>
							</section>
						</article>
					)}
				</div>
			</DialogContent>
		);
}
