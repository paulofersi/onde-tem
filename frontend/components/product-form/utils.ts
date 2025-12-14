import { Supermarket } from "@/types/supermarket";
import { FormData, FormErrors } from "./types";

export const formatCurrency = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, "");
  if (!numbers) return "";

  const cents = numbers.padStart(3, "0");
  const reais = cents.slice(0, -2);
  const centavos = cents.slice(-2);

  return `${parseInt(reais)}.${centavos}`;
};

export const parsePrice = (value: string): number => {
  return parseFloat(value.replace(/[^\d.]/g, "")) || 0;
};

export const calculateDiscountPercentage = (
  original: number,
  discount: number
): number => {
  if (original <= 0) return 0;
  return Math.round(((original - discount) / original) * 100);
};

export const validateForm = (
  data: FormData,
  supermarkets: Supermarket[]
): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Nome do produto é obrigatório";
  }

  const original = parsePrice(data.originalPrice);
  if (!data.originalPrice || original <= 0) {
    errors.originalPrice = "Preço original deve ser maior que zero";
  }

  const discount = parsePrice(data.discountPrice);
  if (!data.discountPrice || discount <= 0) {
    errors.discountPrice = "Preço com desconto deve ser maior que zero";
  }

  if (original > 0 && discount >= original) {
    errors.discountPrice = "Preço com desconto deve ser menor que o original";
  }

  if (!data.supermarketId && supermarkets.length > 0) {
    errors.supermarketId = "Selecione um supermercado";
  }

  return errors;
};

