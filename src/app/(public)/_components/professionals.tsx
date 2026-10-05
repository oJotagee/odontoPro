import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Prisma } from "../../../../generated/prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import fotoImage from "../../../../public/foto1.png"
import { PremiumBadge } from "./premium-badge"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfessionalsProps {
	professionals: UserWithSubscription[];
}

export async function Professionals({ professionals }: ProfessionalsProps) {
  return (
			<section className="bg-gray-50 py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl text-center font-bold mb-12">
						Profissionais
					</h2>

					<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {professionals.map((clinic) => (
              <Card className="p-0 overflow-hidden hover:shadow-lg duration-300" key={clinic.id}>
                <CardContent className="p-0">
                  <div>
                    <div className="relative w-full h-48">
                      <Image
                        src={clinic.image ? clinic.image : fotoImage}
                        alt="Foto do Profissional"
                        fill
                        className="object-cover"
                        quality={100}
                        priority
                      />

                      {clinic.subscription && <PremiumBadge />}
                    </div>
                  </div>

                  <div className="p-4 space-y-4 min-w-[160px] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold line-clamp-1">{clinic.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{clinic.address ? clinic.address : "Endereço não informado"}</p>
                      </div>
                    </div>


                    <Link
                      href={`/clinica/${clinic.id}`}
                      target="_blank"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base"
                    >
                      Agendar Horario
                      <ArrowRight className="ml-2" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
						))}
					</section>
				</div>
			</section>
		);
}
