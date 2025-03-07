import { atom } from "recoil";

export const fileAtom = atom({
  key: "file",
  default: null as File[] | null,
});

export const transactionExpiryDateAtom = atom({
  key: "transactionExpiryDate",
  default: undefined as Date | undefined,
});

export const transactionTypeSelectAtom = atom({
  key: "transactionTypeSelect",
  default: null as string | null,
});

export const filterTransactionTableByAtom = atom({
  key: "filterTransactionTableBy",
  default: null as unknown as any | null,
});

export const transactionChangedAtom = atom({
  key: "transactionChanged",
  default: null as unknown as any | null,
});

export const searchValueTransactionsAtom = atom({
  key: "searchValueTransactions",
  default: null as string | null,
});

export const totalTransactionsAtom = atom({
  key: "totalTransactions",
  default: null as number | any | null,
});
