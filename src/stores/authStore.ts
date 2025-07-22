import {create} from "zustand";

type AuthFormData = {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
};

type AuthStore = {
    formData: AuthFormData;
    setFormData: (data: Partial<AuthFormData>) => void;
    resetFormData: () => void;
}

export const useAuthStore = create<AuthStore>((set) =>({
    formData: {},
    setFormData: (data) =>
        set((state) => ({
            formData: {
                ...state.formData,
                ...data,
            },
        })),
    resetFormData: () => set({formData: {}}),
}));

