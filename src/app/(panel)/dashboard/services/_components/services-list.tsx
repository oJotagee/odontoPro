"use client"

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Service } from "../../../../../../generated/prisma/client";
import { convertCentsToReal } from "@/utils/convertCurrency";
import { deleteService } from "../_actions/delete-service";
import { DialogService } from "./dialog-service";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  async function handleDeleteService(serviceId: string) {
    const response = await deleteService({ serviceId });

    if(response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data);
  }

  function handleEditService(service: Service) {
    setEditingService(service);
    setIsDialogOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setIsDialogOpen(open);

    if (!open) {
      setEditingService(null);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <section className="mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-x-0 pb-2">
            <CardTitle className="text-xl md:text-2xl font-bold">Lista de Servicos</CardTitle>
            <DialogTrigger
              render={<Button />}
            >
              <Plus className="w-4 h-4" />
            </DialogTrigger>

            <DialogContent>
              <DialogService 
                closeModal={() => {
                  setIsDialogOpen(false)
                  setEditingService(null);
                }}
                serviceId={editingService ? editingService.id : undefined}
                initialValue={editingService ? {
                  name: editingService.name,
                  price: (editingService.price / 100).toFixed(2).replace(".", ","),
                  hours: Math.floor(editingService.duration / 60).toString(),
                  minutes: (editingService.duration % 60).toString(),
                } : undefined}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className="space-y-4">
              {services.map(service => (
                <article 
                  key={service.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{service.name}</span>
                    <span className="text-gray-500">-</span>
                    <span className="font-medium text-gray-500">
                        {convertCentsToReal(service.price)}
                      </span>
                  </div>

                  <div>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => handleEditService(service)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  )
}