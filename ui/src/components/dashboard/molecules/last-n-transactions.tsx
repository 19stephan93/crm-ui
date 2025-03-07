import { selectedOrganizationAtom } from "@/components/authentication/utils/authentication.recoil";
import useAxios from "@/lib/axios/useAxios";
import { useRecoilState } from "recoil";
import { GetOrganizationLastTransactions } from "../core/dashboard.service";
import { Transaction } from "@/components/clients/details/transactions/atoms/transaction";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { transactionHeaders } from "@/components/clients/details/transactions/utils/consts";
import { useContext, useEffect } from "react";
import { LanguageContext } from "@/i18n/language-context";
import { Loader } from "@/components/common/loader";
import { FilterableTableHeader } from "@/components/clients/details/transactions/atoms/transaction-table-filterable-header";
import { TransactionObject } from "@/components/clients/details/transactions/utils/types";
import { shouldRefetchAtom } from "@/components/clients/list/utils/clients.recoil";

export const LastNTransactions = () => {
  const { dictionary } = useContext(LanguageContext);
  const [selectedOrganization] = useRecoilState(selectedOrganizationAtom);
  const [shouldRefetch, setShouldRefetch] = useRecoilState(shouldRefetchAtom);

  const { data, loadData, error, dataCode, isLoading } = useAxios({
    fetchFn: GetOrganizationLastTransactions,
    paramsOfFetch: {
      organizationId: selectedOrganization?.id,
      transactions: 5,
    },
    loadOnMount: true,
  });

  useEffect(() => {
    if (shouldRefetch) {
      loadData();
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  const TransactionsTableHeaders = transactionHeaders(
    dictionary,
    <FilterableTableHeader />
  );

  return (
    <div className="flex flex-col w-full min-h-[355px] bg-secondary p-4 rounded-md">
      <p className="font-semibold pb-4 text-md sm:text-lg">
        {dictionary.Last5Transactions}
      </p>
      <Table className="bg-background h-full">
        <TableHeader>
          <TableRow>
            {TransactionsTableHeaders.map((header) => (
              <TableHead
                key={header.id}
                className={`${header.alignRight ? "text-right" : "text-left"}`}
                style={{
                  width: header.size + "%",
                }}
              >
                {header.component ? header.component : header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {isLoading && (
            <TableRow className="hover:!bg-transparent">
              <TableCell colSpan={TransactionsTableHeaders.length}>
                <Loader />
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow className="hover:!bg-transparent">
              <TableCell colSpan={TransactionsTableHeaders.length}>
                <div className="text-center">{dictionary.GenericError}</div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && data && data.length === 0 && (
            <TableRow className="hover:!bg-transparent">
              <TableCell colSpan={TransactionsTableHeaders.length}>
                <div className="text-center">{dictionary.NoResultsFound}</div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            data &&
            data.lastNTransactions.length > 0 &&
            data.lastNTransactions.map((transaction: TransactionObject) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
