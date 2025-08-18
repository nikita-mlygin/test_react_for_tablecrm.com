import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type {
  CategoryNode,
  Contragent,
  LoyaltyCard,
  Organization,
  Paybox,
  PriceType,
  SalePayload,
  Warehouse,
} from "./tmptypes";
import type { Product } from "../product/product";

// константа с токеном
const TOKEN =
  "af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77";

export const useContragents = (params?: {
  name?: string;
  phone?: string;
  limit?: number;
  offset?: number;
}) =>
  useQuery({
    queryKey: ["contragents", params],
    queryFn: async () => {
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/contragents/",
        {
          params: { token: TOKEN, limit: 35, offset: 0, ...params },
        }
      );
      return res.data.result as Contragent[];
    },
  });

export const useWarehouses = (params?: {
  name?: string;
  limit?: number;
  offset?: number;
}) =>
  useQuery<Warehouse[], Error>({
    queryKey: ["warehouses", params],
    queryFn: async () => {
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/warehouses/",
        {
          params: { token: TOKEN, limit: 50, offset: 0, ...params },
        }
      );
      return res.data.result as Warehouse[];
    },
  });

export const useOrganizations = (params?: {
  name?: string;
  limit?: number;
  offset?: number;
}) =>
  useQuery({
    queryKey: ["organizations", params],
    queryFn: async () => {
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/organizations/",
        {
          params: { token: TOKEN, limit: 50, offset: 0, ...params },
        }
      );
      return (res.data.result ?? []) as Organization[];
    },
  });

export const usePriceTypes = () =>
  useQuery<PriceType[]>({
    queryKey: ["priceTypes"],
    queryFn: async () => {
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/price_types/",
        {
          params: { token: TOKEN },
        }
      );
      return res.data.result;
    },
  });

export const useCreateSale = () =>
  useMutation({
    mutationFn: async (payload: SalePayload) => {
      const res = await axios.post(
        "https://app.tablecrm.com/api/v1/docs_sales/",
        payload,
        {
          params: { token: TOKEN },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("sale created", data);
    },
    onError: (err: any) => {
      console.error("creation failed", err);
    },
  });

export const useNomenclatureByCategory = (categoryKey?: number) =>
  useQuery<Product[], Error>({
    queryKey: ["nomenclatureByCategory", categoryKey],
    queryFn: async () => {
      if (!categoryKey) return [];
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/nomenclature/",
        {
          params: {
            token: TOKEN,
            category: categoryKey,
            with_prices: true,
            with_balance: true,
            in_warehouse: 0,
            limit: 100000,
          },
        }
      );
      return res.data.result.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.prices?.[0]?.price || 0,
      })) as Product[];
    },
    enabled: !!categoryKey,
  });

export const useLoyaltyCard = (clientId?: number) =>
  useQuery<LoyaltyCard | null>({
    queryKey: ["loyaltyCard", clientId],
    enabled: !!clientId, // запрос выполняется только если есть clientId
    queryFn: async () => {
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/loyality_cards/",
        {
          params: { token: TOKEN, limit: 1, offset: 0, client_id: clientId },
        }
      );
      return res.data.result[0] ?? null;
    },
  });

export const useNomenclatureSearch = (name?: string) =>
  useQuery<Product[]>({
    queryKey: ["nomenclatureSearch", name],
    enabled: !!name,
    queryFn: async () => {
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/nomenclature/",
        {
          params: {
            token: TOKEN,
            name,
            limit: 50,
            offset: 0,
            with_prices: true,
            with_balance: true,
          },
        }
      );
      return res.data.result.map((p: any) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        unit_name: p.unit_name,
        prices: p.prices?.map((pr: any) => ({
          price_type: pr.price_type,
          price: pr.price,
        })),
        balances: p.balances?.map((b: any) => ({
          warehouse_name: b.warehouse_name,
          current_amount: b.current_amount,
        })),
        category: p.category,
        description_short: p.description_short,
      }));
    },
  });

export const useNomenclatureById = (id?: number) =>
  useQuery<Product | null>({
    queryKey: ["nomenclatureById", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(
        `https://app.tablecrm.com/api/v1/nomenclature/${id}/`,
        { params: { token: TOKEN, with_prices: true, with_balance: true } }
      );
      const p = res.data;
      return {
        id: p.id,
        name: p.name,
        code: p.code,
        unit_name: p.unit_name,
        category: p.category,
        description_short: p.description_short,
        prices:
          p.prices?.map((pr: any) => ({
            price_type: pr.price_type,
            price: pr.price,
          })) ?? [],
        balances:
          p.balances?.map((b: any) => ({
            warehouse_name: b.warehouse_name,
            current_amount: b.current_amount,
          })) ?? [],
      };
    },
  });

export const fetchProductById = async (queryClient: any, id: number) => {
  // пробуем взять из кэша
  const cached = queryClient.getQueryData(["nomenclatureById", id]);
  if (cached) return cached;

  // если нет в кэше — делаем запрос
  return queryClient.fetchQuery({
    queryKey: ["nomenclatureById", id],
    queryFn: async () => {
      const res = await axios.get(
        `https://app.tablecrm.com/api/v1/nomenclature/${id}/`,
        {
          params: {
            token: TOKEN,
            with_prices: true,
            with_balance: true,
            in_warehouse: 0,
            with_attributes: true,
          },
        }
      );
      const p = res.data;
      return {
        id: p.id,
        name: p.name,
        code: p.code,
        unit_name: p.unit_name,
        category: p.category,
        description_short: p.description_short,
        prices:
          p.prices?.map((pr: any) => ({
            price_type: pr.price_type,
            price: pr.price,
          })) ?? [],
        balances:
          p.balances?.map((b: any) => ({
            warehouse_name: b.warehouse_name,
            current_amount: b.current_amount,
          })) ?? [],
      };
    },
  });
};

export const usePayboxes = (name?: string) =>
  useQuery<Paybox[]>({
    queryKey: ["payboxes", name],
    enabled: name !== undefined,
    queryFn: async () => {
      const res = await axios.get("https://app.tablecrm.com/api/v1/payboxes/", {
        params: {
          token: TOKEN,
          name: name ?? "",
        },
        headers: {
          accept: "*/*",
        },
      });
      return res.data.result as Paybox[];
    },
  });

export const useCategoriesTree = () =>
  useQuery<CategoryNode[]>({
    queryKey: ["categoriesTree"],
    queryFn: async () => {
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/categories_tree/",
        { params: { token: TOKEN } }
      );
      return res.data.result as CategoryNode[];
    },
  });
