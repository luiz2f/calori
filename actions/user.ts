"use server";

import prisma from "@/prisma";
import { getSessionId } from "./session";

export async function userWeight() {
  const userId = await getSessionId();

  const bodyInfo = await prisma.bodyInfo.findUnique({
    where: { userId }, // Verifica se já existe BodyInfo para o userId
    select: { weight: true },
  });
  const weight = bodyInfo?.weight || 0;

  return weight;
}

export async function updateWeight(weight: number) {
  const userId = await getSessionId();

  const bodyInfo = await prisma.bodyInfo.upsert({
    where: { userId }, // Verifica se já existe BodyInfo para o userId
    update: { weight }, // Atualiza o peso, se o registro já existir
    create: {
      userId,
      weight,
      height: 0, // Insira valores padrão ou obtenha valores existentes
      bodyfat: 0, // Insira valores padrão ou obtenha valores existentes
    },
  });

  return bodyInfo.weight;
}
