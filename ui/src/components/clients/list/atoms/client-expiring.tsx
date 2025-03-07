import { AlertCircle } from "lucide-react";
import { ExpiringDoc } from "../utils/types";
import { CustomTooltip } from "@/components/common/tooltip";
import { useContext } from "react";
import { LanguageContext } from "@/i18n/language-context";

type ClientExpiringIconProps = {
  expiringDocs: ExpiringDoc[] | null;
};

export const formatDateCustom = (date: Date) => {
  const localDate = new Date(date);
  return `${
    localDate.getDate() >= 10 ? localDate.getDate() : `0${localDate.getDate()}`
  }/${
    localDate.getMonth() + 1 >= 10
      ? localDate.getMonth() + 1
      : `0${localDate.getMonth() + 1}`
  }/${localDate.getFullYear()}`;
};

const formatDateString = (date: Date, dictionary: any, name: string) => {
  const isExpired = new Date(date).valueOf() < new Date(Date.now()).valueOf();
  return (
    <li className="text-sm">
      {`${dictionary.Document} ${name} ${
        isExpired ? dictionary.hasExpiredOn : dictionary.willExpireOn
      } ${formatDateCustom(date)}`}
    </li>
  );
};

export const ClientExpiringIcon = (props: ClientExpiringIconProps) => {
  const { expiringDocs } = props;
  const { dictionary } = useContext(LanguageContext);
  const expiringDocuments =
    expiringDocs &&
    expiringDocs.length > 0 &&
    expiringDocs?.map((doc, index) => (
      <ul key={`${doc.name}-${index}`} className="list-disc pl-4">
        {formatDateString(doc.expiryDate, dictionary, doc.name)}
      </ul>
    ));

  const hasExpiredDocuments = expiringDocs?.some(
    (doc) => new Date(doc.expiryDate).valueOf() < new Date(Date.now()).valueOf()
  );

  return (
    expiringDocs &&
    expiringDocs.length > 0 && (
      <CustomTooltip
        side="right"
        content={
          <div>
            <p className="font-bold text-sm pb-1">
              {dictionary.ExpiringDocuments}:
            </p>
            {expiringDocuments}
          </div>
        }
      >
        <AlertCircle
          className={`cursor-help ${
            hasExpiredDocuments ? "text-red-600" : "text-yellow-500"
          }`}
        />
      </CustomTooltip>
    )
  );
};
