"use client"

import { useState } from "react";

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogServiceFormData, useDialogServiceForm } from "./dialog-service-form";
import { convertRealToCents } from "@/utils/convertCurrency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

import { CreateNewService } from "../_actions/create-service";
import { UpdateService } from "../_actions/update-service";
import { toast } from "sonner";

interface DialogServiceProps {
  closeModal: () => void;
  serviceId?: string;
  initialValue?: {
    name: string;
    price: string;
    hours: string;
    minutes: string;
  };
}

export function DialogService({ closeModal, serviceId, initialValue }: DialogServiceProps) {
  const form = useDialogServiceForm({ initialValues: initialValue });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(value: DialogServiceFormData) {
    setLoading(true);

    const princeInCents = convertRealToCents(value.price);
    const hours = parseInt(value.hours, 10) || 0
    const minutes = parseInt(value.minutes, 10) || 0;
    const durationInMinutes = (hours * 60) + minutes;

    if(serviceId) {
      await editServiceById({
        serviceId,
        name: value.name,
        princeInCents,
        duration: durationInMinutes
      });
      
      setLoading(false);

      return;
    }

    const response = await CreateNewService({
      name: value.name,
      price: princeInCents,
      duration: durationInMinutes
    });

    setLoading(false);

    if(response.error) {
      toast.error(response.error);
      return;
    } 

    toast.success("Serviço cadastrado com sucesso!");
    handleClose();
    router.refresh();
  }

  async function editServiceById({ 
    serviceId, 
    name, 
    princeInCents, 
    duration 
  }: {
    serviceId: string; 
    name: string; 
    princeInCents: number; 
    duration: number}) {
    const response = await UpdateService({
      serviceId,
      name,
      price: princeInCents,
      duration
    });

    if(response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data);
    handleClose();
    router.refresh();
  }

  function handleClose() {
    closeModal();
  }

  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value;
    value = value.replace(/\D/g, "");

    if (value) {
      value = (parseInt(value, 10) / 100).toFixed(2);

      value = value.replace(".", ","); // Substitui o ponto pelo vírgula, padrao do brasil
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona o separador de milhar no padrão brasileiro
    }

    event.target.value = value;
    form.setValue("price", value);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{serviceId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
        <DialogDescription>{serviceId ? "Edite o serviço existente." : "Adicione um novo serviço."}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form 
          className="space-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Digite o nome do serviço.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Preço</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={changeCurrency}
                    />
                  </FormControl>
                  <FormDescription>Digite o preço do serviço.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p className="font-semibold">Tempo de duração do serviço</p>
          <div className="grid grid-cols-2 gap-3 my-4">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Horas</FormLabel>
                  <FormControl>
                    <Input 
                      min={0}
                      type="number"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Digite a quantidade de horas do serviço.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Minutos</FormLabel>
                  <FormControl>
                    <Input 
                      min={0}
                      type="number"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Digite a quantidade de minutos do serviço.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Carregando... " : serviceId ? "Atualizar Serviço" : "Cadastrar Serviço"}
          </Button>
        </form>
      </Form>
    </>
  );
}