import { ORGANIZATION_PREFIX } from "./../../../lib/axios/consts";
import { ORGANIZATION_URL, REPORTS_URL } from "@/lib/axios/consts";
import { DefaultErrorResult, handleError } from "@/lib/axios/helpers";
import axios, { AxiosResponse } from "axios";
import { MonthlyReportResponse } from "../utils/types";

export const GetClients = async ({
  organizationId,
  page = 0,
  size = 10,
  active,
  clientType,
  nameSearchText = "",
}: {
  organizationId: string;
  page: number;
  size: number;
  active: boolean;
  clientType?: string;
  nameSearchText?: string;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (nameSearchText) {
    params.append("nameSearchText", nameSearchText);
  }

  if (active !== null && active !== undefined) {
    params.append("active", active.toString());
  }

  if (clientType) {
    params.append("clientType", clientType);
  }

  try {
    const response: any = await axios.get(
      `${ORGANIZATION_URL}/${organizationId}/clients?${params.toString()}`,
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

export const GetOrganizationLastTransactions = async ({
  organizationId,
  transactions = 5,
}: {
  organizationId: string;
  transactions: number;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.get(
      `${REPORTS_URL}${ORGANIZATION_PREFIX}/${organizationId}?numberOfTransactions=${transactions}`,
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

export const GetOrganizationReportMonthly = async ({
  organizationId,
  month,
  year,
}: {
  organizationId: string;
  month: number;
  year: number;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: MonthlyReportResponse = await axios.get(
      `${REPORTS_URL}${ORGANIZATION_PREFIX}/${organizationId}/monthly?month=${month}&year=${year}`,
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

export const GetOrganizationReportYearly = async ({
  organizationId,
  year,
}: {
  organizationId: string;
  year: number;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.get(
      `${REPORTS_URL}${ORGANIZATION_PREFIX}/${organizationId}/yearly?&year=${year}`,
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
