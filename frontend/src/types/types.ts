import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type CustomError = FetchBaseQueryError & {
  data?: {
    message?: string;
    type?: string;
    cardId: string | number;
    cliientId?: string;
  };
};

export type V_card_data = {
  name: string;
  bio: string;
  job: string;
  about: string;
  image: string | null;
  phone: string;
  address: string;
  facebook_link: string;
  instgram_link: string;
  linkedin_link: string;
  mainBackground: string;
  buttonBackground: string;
};

export type SoldService = {
  id: number;
  type: "vCard" | "menu" | "file" | "url";
  client_id: number;
  card_id: number;
  service_id: number;
  createdAt: string;
  vCardUi?: string;
  fileUpdatableContent?: any | null;
  menuUpdatableContent?: any[];
  urlUpdatableContent?: any | null;
  vCardupdatableContent?: {
    bio: string;
    job: string;
    name: string;
    about: string;
    image: string;
  } | null;
};

export type ChangeBgColorProps = {
  tempMainBackground: string;
  formData: any;
  tempButtonBackground: string;
  setIsColorOpen: (value: boolean) => void;
  setTempMainBackground: (value: string) => void;
  setTempButtonBackground: (value: string) => void;
  ui: string;
  setFormData: (value: any) => void;
};

export type Client = {
  id?: any;
  first_name?: string;
  last_name?: string;
  email?: string | undefined;
  password?: string;
  phone?: string | undefined;
  city?: string;
  role?: string;
  job?: string;
  birthday?: Date;
  createdAt?: Date;
};

export type Card = {
  id?: number;
  unique_code?: any;
  nfc_shap?: string;
  nfc_type?: string;
  client_id?: number;
  activated?: boolean;
  createdAt?: Date;
  client?: Client;
};
