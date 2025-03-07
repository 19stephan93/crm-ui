import { Loader } from "@/components/common/loader";
import { Transaction } from "../atoms/transaction";
import { GetTransactions } from "@/components/clients/core/transactions.service";
import useAxios from "@/lib/axios/useAxios";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { shouldRefetchAtom } from "@/components/clients/list/utils/clients.recoil";
import { useRecoilState } from "recoil";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { LanguageContext } from "@/i18n/language-context";
import { FilterableTableHeader } from "../atoms/transaction-table-filterable-header";
import {
  filterTransactionTableByAtom,
  searchValueTransactionsAtom,
  totalTransactionsAtom,
} from "@/components/clients/details/transactions/utils/transactions.recoil";
import { transactionHeaders } from "../utils/consts";
import { TransactionObject } from "../utils/types";
import { TablePagination } from "@/components/common/table/pagination";

export const TransactionsTable = ({
  day,
  month,
  year,
}: {
  day: number;
  month: number;
  year: number;
}) => {
  const { dictionary } = useContext(LanguageContext);

  const [shouldRefetch, setShouldRefetch] = useRecoilState(shouldRefetchAtom);

  const [filterBy] = useRecoilState(filterTransactionTableByAtom);

  const [searchValueTransactions] = useRecoilState(searchValueTransactionsAtom);

  const [, setTotalTransactions] = useRecoilState(totalTransactionsAtom);

  const [currentPage, setCurrentPage] = useState(0);

  const { clientId } = useParams();

  const TransactionsTableHeaders = transactionHeaders(
    dictionary,
    <FilterableTableHeader />
  );

  const { data, error, isLoading, loadData } = useAxios({
    fetchFn: GetTransactions,
    paramsOfFetch: {
      clientId: clientId,
      transactionType: filterBy,
      page: currentPage,
      day: day,
      month: month,
      year: year,
      nameSearchText: searchValueTransactions,
    },
  });

  useEffect(() => {
    loadData();
  }, [day, month, year, searchValueTransactions]);

  useEffect(() => {
    setCurrentPage(0);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    setShouldRefetch(true);
  }, [filterBy]);

  useEffect(() => {
    if (shouldRefetch) {
      loadData();
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  useEffect(() => {
    if (isLoading) {
      setTotalTransactions(0);
    }
    if (data) {
      setTotalTransactions(data.numberOfEntries);
    }
  }, [data, isLoading]);

  return (
    <>
      <Table className="bg-background">
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
          {!isLoading && data && data.entries.length === 0 && (
            <TableRow className="hover:!bg-transparent">
              <TableCell colSpan={TransactionsTableHeaders.length}>
                <div className="text-center">{dictionary.NoResultsFound}</div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            data &&
            data.entries.length > 0 &&
            data.entries.map((transaction: TransactionObject) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))}
        </TableBody>
      </Table>
      {!isLoading && data && (
        <TablePagination
          currentPage={currentPage}
          totalPages={data.numberOfPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};
