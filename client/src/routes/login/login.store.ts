import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "@/lib/api";
import { router } from "@/main.tsx";
import type { FormEvent } from "react";

export interface LoginState {
  data: {
    username: string;
    password: string;
  };
  isLoading: boolean;
  error: string | null;
  init: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | string[] | null) => void;
  setValue: (key: keyof LoginState["data"], value: string) => void;
  submit: (e?: FormEvent<HTMLFormElement>) => void;
}

const initData = {
  data: {
    username: "",
    password: "",
  },
  isLoading: false,
  error: null,
};

const useLoginStore = create<LoginState>()(
  devtools((set) => ({
    ...initData,
    init: () => set(initData),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | string[] | null) => {
      const errorMessage = Array.isArray(error) ? error.join("\n") : error;
      set({ error: errorMessage });
    },
    setValue: (key: keyof LoginState["data"], value: string) =>
      set((state) => ({ data: { ...state.data, [key]: value } })),
    submit: (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      set({ isLoading: true });
      try {
        const search = router.state.matches.at(-1)?.search;
        const data = useLoginStore.getState().data;

        api
          .post("/auth/login", data)
          .then(() => {
            if (search.redirect) {
              router.navigate({ to: search.redirect, replace: true });
            } else {
              router.navigate({ to: "/app", replace: true });
            }
          })
          .catch((error) => {
            const { setError } = useLoginStore.getState();
            set({ isLoading: false });

            if (error.response?.data?.error) {
              setError(error.response.data.error);
            } else if (error.response?.data?.errors) {
              setError(error.response.data.errors);
            } else {
              setError(error.message || "An unexpected error occurred");
            }
          });
      } catch (error) {
        return;
      }
    },
  })),
);

export default useLoginStore;
