import { useRecoilState } from "recoil";
import { selectedOrganizationAtom } from "../authentication/utils/authentication.recoil";
import { GetOrganizationLastTransactions } from "../dashboard/core/dashboard.service";
import useAxios from "@/lib/axios/useAxios";
import { useContext, useEffect, useMemo } from "react";
import { LanguageContext } from "@/i18n/language-context";
import { AlertCircle } from "lucide-react";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";

export const Alert = () => {
  const [selectedOrganization] = useRecoilState(selectedOrganizationAtom);
  const { dictionary } = useContext(LanguageContext);
  const windowDimensions = useWindowDimensions();

  const { data, loadData, error, dataCode, isLoading } = useAxios({
    fetchFn: GetOrganizationLastTransactions,
    paramsOfFetch: {
      organizationId: selectedOrganization?.id,
      transactions: 1,
    },
    loadOnMount: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const expireLabel = useMemo(() => {
    return (
      (data?.numberOfExpiredDocuments > 0 ||
        data?.numberOfExpiredTransactions > 0) &&
      `${dictionary.YouHaveClientsWith} ${
        data.numberOfExpiredDocuments <= 0
          ? ""
          : `${data?.numberOfExpiredDocuments}
     ${dictionary.documents}`
      } ${
        data?.numberOfExpiredDocuments > 0 &&
        data?.numberOfExpiredTransactions > 0
          ? dictionary.and
          : ""
      } ${
        data?.numberOfExpiredTransactions <= 0
          ? ""
          : `${data?.numberOfExpiredTransactions} ${dictionary.transactions}`
      } ${dictionary.whoAreExpired}.`
    );
  }, [dictionary, data]);

  const closeToExpireLabel = useMemo(() => {
    return (
      (data?.numberOfCloseToExpiredDocuments > 0 ||
        data?.numberOfCloseToExpiredTransactions > 0) &&
      `${dictionary.YouHaveClientsWith} ${
        data.numberOfExpiredDocuments <= 0
          ? ""
          : `${data?.numberOfExpiredDocuments}
         ${dictionary.documents}`
      } ${
        data?.numberOfCloseToExpiredDocuments > 0 &&
        data?.numberOfCloseToExpiredTransactions > 0
          ? dictionary.and
          : ""
      } ${
        data?.numberOfCloseToExpiredTransactions <= 0
          ? ""
          : `${data?.numberOfCloseToExpiredTransactions} ${dictionary.transactions}`
      } ${dictionary.whoAreCloseToExpiration}.`
    );
  }, [dictionary, data]);

  return (
    !isLoading &&
    data &&
    (data.numberOfExpiredDocuments > 0 ||
      data.numberOfExpiredTransactions > 0 ||
      data.numberOfCloseToExpiredDocuments > 0 ||
      data.numberOfCloseToExpiredTransactions > 0) && (
      <div className="flex bg-orange-600 p-4 mt-4 gap-3 rounded-md items-center pointer-events-none">
        {windowDimensions.width > 500 && <AlertCircle />}
        <div className="flex flex-col">
          <p className="text-xs md:text-sm font-semibold">{expireLabel}</p>
          <p className="text-xs md:text-sm font-semibold">
            {closeToExpireLabel}
          </p>
        </div>
      </div>
    )
  );
};
