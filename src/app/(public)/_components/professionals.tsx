import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"

import fotoImage from "../../../../public/foto1.png"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Professionals() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-center font-bold mb-12">
          Profissionais
        </h2>

        <section 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="p-0 overflow-hidden">
            <CardContent className="p-0">
              <div>
                <div className="relative w-full h-48">
                  <Image 
                    src={fotoImage} 
                    alt="Foto do Profissional" 
                    fill
                    className="object-cover" 
                    quality={100}
                    priority
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Clinica Centro</h3>
                    <p className="text-sm text-gray-500">Rua x, Centro, Itapetininga - SP</p>
                  </div>
                  
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                
                <Link 
                  href="/clinica/123"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base"
                >
                  Agendar Horario
                  <ArrowRight className="ml-2" />
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-0 overflow-hidden">
            <CardContent className="p-0">
              <div>
                <div className="relative w-full h-48">
                  <Image 
                    src={fotoImage} 
                    alt="Foto do Profissional" 
                    fill
                    className="object-cover" 
                    quality={100}
                    priority
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Clinica Centro</h3>
                    <p className="text-sm text-gray-500">Rua x, Centro, Itapetininga - SP</p>
                  </div>
                  
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                
                <Link 
                  href="/clinica/123"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base"
                >
                  Agendar Horario
                  <ArrowRight className="ml-2" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0 overflow-hidden">
            <CardContent className="p-0">
              <div>
                <div className="relative w-full h-48">
                  <Image 
                    src={fotoImage} 
                    alt="Foto do Profissional" 
                    fill
                    className="object-cover" 
                    quality={100}
                    priority
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Clinica Centro</h3>
                    <p className="text-sm text-gray-500">Rua x, Centro, Itapetininga - SP</p>
                  </div>
                  
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                
                <Link 
                  href="/clinica/123"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base"
                >
                  Agendar Horario
                  <ArrowRight className="ml-2" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </section>
  )
}