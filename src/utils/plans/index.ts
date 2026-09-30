export type PlanDetailsProps = {
  maxServices: number;
}

export type PlansProps = {
  BASIC: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
}

export const PLANS: PlansProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 50,
  },
}

export const subscriptionPlans = [
	{
		id: "BASIC",
		name: "Basic",
		description: "Perfeito para clínicas pequenas",
		oldPrice: "R$ 97,90",
		newPrice: "R$ 27,90",
    features: [
      `Até ${PLANS["BASIC"].maxServices} serviços`,
      "Agendamento ilimitado",
      "Suporte",
      "Relatórios"
		],
	},
	{
		id: "PROFESSIONAL",
		name: "Professional",
		description: "Perfeito para clínicas grandes",
		oldPrice: "R$ 197,90",
		newPrice: "R$ 97,90",
    features: [
      `Até ${PLANS["PROFESSIONAL"].maxServices} serviços`,
      "Agendamento ilimitado",
      "Suporte prioritário",
      "Relatórios avançados"
		],
	},
];
