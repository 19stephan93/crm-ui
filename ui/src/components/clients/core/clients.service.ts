import { CLIENTS_URL, MAIL_URL, REPORTS_URL } from "@/lib/axios/consts";
import { DefaultErrorResult, handleError } from "@/lib/axios/helpers";
import axios, { AxiosResponse } from "axios";
import * as SibApiV3Sdk from "@sendinblue/client";

export const AddClient = async ({
  organizationId,
  body,
}: {
  organizationId: string;
  body: any;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.post(
      `${CLIENTS_URL}`,
      {
        organizationId,
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

export const DeleteClient = async ({
  clientId,
}: {
  clientId: string;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.delete(`${CLIENTS_URL}/${clientId}`, {
      headers: {
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

export const GetClient = async ({
  clientId,
}: {
  clientId: string;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.get(`${CLIENTS_URL}/${clientId}`, {
      headers: {
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

export const UpdateClient = async ({
  clientId,
  body,
}: {
  clientId: string;
  body: any;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.put(
      `${CLIENTS_URL}/${clientId}`,
      {
        clientId,
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

export const ArchiveClient = async ({
  clientId,
}: {
  clientId: string;
  body: any;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.put(
      `${CLIENTS_URL}/${clientId}`,
      {
        clientId,
        active: false,
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

export const GetClientReport = async ({
  clientId,
  month,
  year,
}: {
  clientId: string;
  month: number;
  year: number;
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  try {
    const response: any = await axios.get(
      `${REPORTS_URL}/client/${clientId}/monthly?month=${month}&year=${year}`,
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

export const PostEmail = async ({
  body,
}: {
  body: {
    to: string;
    subject: string;
    message: string;
    clientName: string;
    files: File[];
  };
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  const files = body.files;
  const formData = new FormData();
  formData.append("senderId", "2");
  formData.append("recipient", body.to);
  formData.append("subject", body.subject);
  formData.append("title", "");
  formData.append("client", body.clientName);
  formData.append("templateId", "2");
  formData.append("body", body.message);
  files.forEach((file) => {
    formData.append("files", file);
  });
  try {
    const response: any = await axios.post(`${MAIL_URL}`, formData, {
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

export const GetEmailEvents = async ({
  limit = 2500,
  offset = 0,
  email,
  templateId = 2,
  sort = "desc",
}: {
  limit: number;
  offset: number;
  email: string;
  templateId: number;
  sort: "asc" | "desc";
}): Promise<any | DefaultErrorResult | AxiosResponse<any, any>> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    email: email.toString(),
    templateId: templateId.toString(),
    sort: sort.toString(),
  });

  try {
    const response: any = await axios.get(
      `https://api.brevo.com/v3/smtp/statistics/events?${params}`,
      {
        headers: {
          "api-key": import.meta.env.VITE_BREVO_API_KEY,
        },
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};
