import { formatDate } from "date-fns";
import {
  CLIENTS_URL,
  TRANSACTIONS_PREFIX,
  TRANSACTIONS_URL,
} from "@/lib/axios/consts";
import { DefaultErrorResult, handleError } from "@/lib/axios/helpers";
import axios, { AxiosResponse } from "axios";

export const GetTransactions = async ({
  clientId,
  page = 0,
  size = 10,
  transactionType,
  day,
  month,
  year,
  nameSearchText,
}: {
  clientId: string;
  page: number;
  size: number;
  transactionType?: string;
  day: number;
  month: number;
  year: number;
  nameSearchText: string;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    day: day.toString(),
    month: month.toString(),
    year: year.toString(),
  });

  if (nameSearchText) {
    params.append("nameSearchText", nameSearchText);
  }

  if (transactionType) {
    params.append("transactionType", transactionType);
  }
  try {
    const response: any = await axios.get(
      `${CLIENTS_URL}/${clientId}${TRANSACTIONS_PREFIX}?${params.toString()}`,
      {
        headers: {
          Authorization:
            //@ts-ignore
            "Bearer " + localStorage.getItem("idToken").replace(/['"]+/g, ""),
        },
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export const AddTransaction = async ({
  clientId,
  body,
  files,
}: {
  clientId: string;
  body: any;
  files: File[];
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  const payload = new FormData();
  payload.append("clientId", clientId);
  payload.append("name", body.name);
  payload.append("amount", body.amount);
  payload.append("transactionType", body.transactionType);
  if (body.expiryDate) {
    const splittedDate = body.expiryDate.toISOString().split("T")[0].split("-");
    const formattedDate = formatDate(
      new Date(
        parseInt(splittedDate[0]),
        parseInt(splittedDate[1]) - 1,
        parseInt(splittedDate[2])
      ),
      "yyyy-MM-dd HH:mm:ss.SSS"
    );
    payload.append("expiryDate", formattedDate);
  }
  files.forEach((file) => {
    payload.append("files", file);
  });

  try {
    const response: any = await axios.post(`${TRANSACTIONS_URL}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization:
          //@ts-ignore
          "Bearer " + localStorage.getItem("idToken").replace(/['"]+/g, ""),
      },
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export const DeleteTransaction = async ({
  transactionId,
}: {
  transactionId: string;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.delete(
      `${TRANSACTIONS_URL}/${transactionId}`,
      {
        headers: {
          Authorization:
            //@ts-ignore
            "Bearer " + localStorage.getItem("idToken").replace(/['"]+/g, ""),
        },
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export const GetTransactionFile = async ({
  transactionId,
}: {
  transactionId: string;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.get(
      `${TRANSACTIONS_URL}/${transactionId}/download`,
      {
        responseType: "blob",
        headers: {
          Authorization:
            //@ts-ignore
            "Bearer " + localStorage.getItem("idToken").replace(/['"]+/g, ""),
        },
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export const UpdateTransaction = async ({
  transactionId,
  body,
}: {
  transactionId: string;
  body: any;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.put(
      `${TRANSACTIONS_URL}/${transactionId}`,
      {
        ...body,
      },
      {
        headers: {
          Authorization:
            //@ts-ignore
            "Bearer " + localStorage.getItem("idToken").replace(/['"]+/g, ""),
        },
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};
