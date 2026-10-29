import {
  AirVent,
  Building2,
  CircuitBoard,
  ShieldPlus,
  Wrench,
} from "lucide-react";
export const services = [
  {
    id: "instalacao",
    image: "/hero-climatizacao.webp",
    name: "Instalação",
    subtitle: "Residencial e comercial",
    summary: "O conforto começa com uma instalação bem planejada.",
    icon: AirVent,
    title: "Instalação de ar-condicionado para o seu ambiente",
    text: "A escolha do local e a instalação adequada fazem diferença no conforto e no funcionamento do equipamento. Seja em casa ou em um espaço comercial, vale avaliar as condições do ambiente e as necessidades de uso antes de instalar.",
    support:
      "Conte qual é o aparelho, onde será instalado e se já existe infraestrutura preparada. Assim, a conversa começa com as informações certas.",
    cta: "Conversar sobre instalação",
    message:
      "Olá! Vim pelo site da CM Ar-Condicionado e gostaria de solicitar informações sobre instalação de ar-condicionado. Meu ambiente é [residencial/comercial] e preciso de orientação.",
  },
  {
    id: "preventiva",
    image: "/servico-manutencao.webp",
    name: "Manutenção preventiva",
    subtitle: "Preventiva",
    summary: "Limpeza, inspeção e cuidados para a rotina do equipamento.",
    icon: Wrench,
    title: "Cuidados periódicos para o seu sistema de climatização",
    text: "A manutenção preventiva ajuda a identificar necessidades de limpeza, inspeção e ajustes antes que pequenos sinais se tornem problemas maiores. A frequência e os procedimentos dependem do equipamento e de suas condições de uso.",
    support:
      "Informe o tipo de aparelho e quando foi feita a última manutenção.",
    cta: "Consultar manutenção preventiva",
    message:
      "Olá! Vim pelo site da CM Ar-Condicionado e gostaria de informações sobre manutenção preventiva do meu ar-condicionado.",
  },
  {
    id: "corretiva",
    image: "/v2-corretiva.webp",
    name: "Manutenção corretiva",
    subtitle: "Avaliação do sistema",
    summary: "Identificar a causa. Planejar o cuidado que o sistema precisa.",
    icon: Wrench,
    title: "Quando o sistema precisa voltar à rotina",
    text: "Uma queda de desempenho ou uma parada pode ter diferentes causas. A manutenção corretiva começa pela avaliação do funcionamento e das condições do sistema, para entender quais intervenções são necessárias. Compartilhe o histórico do equipamento e os sinais observados para orientar essa primeira conversa.",
    support:
      "Informe há quanto tempo o problema acontece, se o aparelho apresenta algum código de erro e quais manutenções já foram realizadas.",
    cta: "Conversar sobre manutenção corretiva",
    message:
      "Olá! Vim pelo site da CM Ar-Condicionado e gostaria de consultar manutenção corretiva para meu sistema de ar-condicionado. Posso informar o histórico e as falhas observadas.",
  },
  {
    id: "conserto",
    image: "/servico-conserto.webp",
    name: "Conserto",
    subtitle: "Diagnóstico e reparo",
    summary: "Entenda os sinais e converse sobre a avaliação do sistema.",
    icon: CircuitBoard,
    title: "Seu ar-condicionado apresentou algum problema?",
    text: "Falhas de funcionamento, ruídos incomuns, baixo desempenho ou interrupções de operação exigem avaliação para identificar a causa. Descreva os sintomas e o modelo do equipamento para iniciar o atendimento.",
    support:
      "Se possível, envie foto da etiqueta do aparelho e explique o que está acontecendo.",
    cta: "Solicitar avaliação de conserto",
    message:
      "Olá! Vim pelo site da CM Ar-Condicionado e preciso de orientação sobre um ar-condicionado com problema. Posso informar o modelo e os sintomas.",
  },
  {
    id: "chiller",
    image: "/servico-chiller.webp",
    name: "Chiller industrial",
    subtitle: "Climatização industrial",
    summary: "Uma conversa técnica para as necessidades de maior porte.",
    icon: Building2,
    title: "Atendimento para sistemas de climatização industrial",
    text: "Sistemas de maior porte exigem compreensão das condições de operação e das características do equipamento. Para demandas envolvendo chiller industrial, o primeiro passo é reunir as informações técnicas do sistema e a necessidade identificada.",
    support:
      "Informe aplicação, fabricante/modelo e a demanda de manutenção ou avaliação.",
    cta: "Consultar atendimento para chiller",
    message:
      "Olá! Vim pelo site da CM Ar-Condicionado e gostaria de consultar atendimento para um sistema de chiller industrial.",
  },
  {
    id: "hospitalar",
    image: "/servico-hospitalar.webp",
    name: "Climatização hospitalar",
    subtitle: "Sala limpa e UTI",
    summary: "Atenção às particularidades de cada ambiente e aplicação.",
    icon: ShieldPlus,
    title: "Climatização em ambientes de requisitos específicos",
    text: "Ambientes como áreas hospitalares, salas limpas e UTIs possuem exigências próprias de operação e controle ambiental. Uma solicitação desse tipo deve começar pela identificação do ambiente, do sistema instalado e do escopo necessário.",
    support:
      "Descreva o ambiente e a necessidade para verificar a possibilidade de atendimento.",
    cta: "Consultar solução especializada",
    message:
      "Olá! Vim pelo site da CM Ar-Condicionado e gostaria de consultar atendimento relacionado à climatização de ambiente hospitalar, sala limpa ou UTI.",
  },
];
