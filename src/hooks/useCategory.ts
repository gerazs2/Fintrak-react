import { useQuery } from "@tanstack/react-query";
import type { CategoryResponse } from "../types/CategoryTypes";
import type { AxiosError } from "axios";
import { getCategories } from "../api/categoryApi";

export const useCategories = () =>
    useQuery<CategoryResponse[], AxiosError>({
        queryKey: ['categorias'],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000, //Interval Ejecution
    });
