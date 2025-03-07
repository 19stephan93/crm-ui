import useAxios from "@/lib/axios/useAxios";
import { GetClient, GetEmailEvents } from "../../core/clients.service";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "@/components/common/loader";
import { emailEventsHeasder } from "../transactions/utils/consts";
import { LanguageContext } from "@/i18n/language-context";
import { format } from "date-fns";
import { CustomTooltip } from "@/components/common/tooltip";
import { uuidv4 } from "@/lib/utils";
import { InfoIcon } from "lucide-react";

type EmailEvent = {
  date: Date;
  email: string;
  event:
    | "bounces"
    | "hardBounces"
    | "softBounces"
    | "delivered"
    | "spam"
    | "requests"
    | "opened"
    | "clicks"
    | "invalid"
    | "deferred"
    | "blocked"
    | "unsubscribed"
    | "error"
    | "loadedByProxy";
  from: string;
  ip: string;
  messageId: string;
  subject: string;
  tag: string;
  templateId: number;
};

export const eventToLabel = (evnt: EmailEvent["event"], dictionary: any) => {
  switch (evnt) {
    case "bounces":
      return dictionary.Bounces;
    case "hardBounces":
      return dictionary.HardBounces;
    case "softBounces":
      return dictionary.SoftBounces;
    case "delivered":
      return dictionary.Delivered;
    case "spam":
      return dictionary.Spam;
    case "requests":
      return dictionary.Requests;
    case "opened":
      return dictionary.Opened;
    case "clicks":
      return dictionary.Clicks;
    case "invalid":
      return dictionary.Invalid;
    case "deferred":
      return dictionary.Deferred;
    case "blocked":
      return dictionary.Blocked;
    case "unsubscribed":
      return dictionary.Unsubscribed;
    case "error":
      return dictionary.Error;
    case "loadedByProxy":
      return dictionary.LoadedByProxy;
    default:
      return dictionary.Unknown;
  }
};

export const eventToTooltip = (evnt: EmailEvent["event"], dictionary: any) => {
  switch (evnt) {
    case "bounces":
      return dictionary.BouncesTooltip;
    case "hardBounces":
      return dictionary.HardBouncesTooltip;
    case "softBounces":
      return dictionary.SoftBouncesTooltip;
    case "delivered":
      return dictionary.DeliveredTooltip;
    case "spam":
      return dictionary.SpamTooltip;
    case "requests":
      return dictionary.RequestsTooltip;
    case "opened":
      return dictionary.OpenedTooltip;
    case "clicks":
      return dictionary.ClicksTooltip;
    case "invalid":
      return dictionary.InvalidTooltip;
    case "deferred":
      return dictionary.DeferredTooltip;
    case "blocked":
      return dictionary.BlockedTooltip;
    case "unsubscribed":
      return dictionary.UnsubscribedTooltip;
    case "error":
      return dictionary.ErrorTooltip;
    case "loadedByProxy":
      return dictionary.LoadedByProxyTooltip;
    default:
      return "";
  }
};

export const EmailEvents = ({ clientData, clientIsLoading }: any) => {
  const { dictionary } = useContext(LanguageContext);

  const { data, error, isLoading, loadData } = useAxios({
    fetchFn: GetEmailEvents,
    paramsOfFetch: { email: clientData?.email },
  });

  useEffect(() => {
    if (clientData?.email) {
      loadData({ email: clientData.email });
    }
  }, [clientData]);

  const EmailEventsTableHeaders = emailEventsHeasder(dictionary);

  return (
    <div className="bg-secondary p-4 h-full flex flex-col gap-4 rounded-md">
      {clientIsLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-[100%]">
            <p className="font-medium text-md">{dictionary.Emails}</p>
          </div>
          <div className="flex flex-col w-full h-full p-4 rounded-md justify-between bg-background">
            <div className="flex flex-col gap-4">
              <Table className="bg-background">
                <TableHeader>
                  <TableRow>
                    {EmailEventsTableHeaders.map((header) => (
                      <TableHead
                        key={header.id}
                        className={`${"text-left"}`}
                        style={{
                          width: header.size + "%",
                        }}
                      >
                        {header.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full">
                  {isLoading && (
                    <TableRow className="hover:!bg-transparent">
                      <TableCell colSpan={EmailEventsTableHeaders.length}>
                        <Loader />
                      </TableCell>
                    </TableRow>
                  )}
                  {error && (
                    <TableRow className="hover:!bg-transparent">
                      <TableCell colSpan={EmailEventsTableHeaders.length}>
                        <div className="text-center">
                          {dictionary.GenericError}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading &&
                    data &&
                    (data.events?.length === 0 || !data.events) && (
                      <TableRow className="hover:!bg-transparent">
                        <TableCell colSpan={EmailEventsTableHeaders.length}>
                          <div className="text-center">
                            {dictionary.NoResultsFound}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  {!isLoading &&
                    data &&
                    data.events &&
                    data.events?.length > 0 &&
                    data.events.map((emailEvent: EmailEvent) => (
                      <EmailEvent
                        key={`${emailEvent.messageId}-${uuidv4()}`}
                        {...emailEvent}
                      />
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const EmailEvent = (props: EmailEvent) => {
  const { subject, date, event } = props;
  const { dictionary } = useContext(LanguageContext);
  const tooltip = useMemo(() => eventToTooltip(event, dictionary), [event]);
  const label = useMemo(() => eventToLabel(event, dictionary), [event]);

  return (
    <TableRow>
      <TableCell className="text-sm">{subject}</TableCell>
      <TableCell className="text-sm">
        {format(date, "KK:mm aa / dd MMM yyyy")}
      </TableCell>
      <TableCell className="text-xs font-bold">
        <div className="flex gap-2 items-center">
          <p className="pointer-events-none text-sm">{label}</p>
          <CustomTooltip content={tooltip}>
            <InfoIcon className="h-[1.2rem] w-[1.2rem]" />
          </CustomTooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};
