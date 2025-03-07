import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LanguageContext } from "@/i18n/language-context";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ClientTableActions } from "../atoms/client-table-actions";
import { Loader } from "@/components/common/loader";
import { valueToLabelClientType } from "../utils/consts";

import { FilterableTableHeader } from "../atoms/client-table-filterable-header";
import { useRecoilState } from "recoil";
import { totalClientsAtom } from "../utils/clients.recoil";
import { toast } from "@/components/ui/use-toast";
import { filterTransactionTableByAtom } from "../../details/transactions/utils/transactions.recoil";
import { CellWithHelper } from "../atoms/cell-with-helper";
import { useNavigate } from "react-router-dom";
import { CLIENTS_PREFIX } from "@/lib/axios/consts";
import { TablePagination } from "@/components/common/table/pagination";
import { ClientExpiringIcon } from "../atoms/client-expiring";

interface ClientTableProps {
  data: any;
  error: any;
  isLoading: boolean;
  isArchived?: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export const ClientTable = ({
  data,
  error,
  isLoading,
  isArchived,
  currentPage,
  setCurrentPage,
}: ClientTableProps) => {
  const [, setTotalClients] = useRecoilState(totalClientsAtom);
  const [, setTransactionFilterBy] = useRecoilState(
    filterTransactionTableByAtom
  );
  const navigate = useNavigate();

  const { dictionary } = useContext(LanguageContext);

  const ClientTableHeaders = [
    { id: "name", label: dictionary.Name, size: 20 },
    { id: "address", label: dictionary.Address, size: 20 },
    { id: "phone", label: dictionary.Phone, size: 10 },
    { id: "email", label: dictionary.Email, size: 10 },
    {
      id: "type",
      label: dictionary.Type,
      component: <FilterableTableHeader />,
      size: 10,
    },
    {
      id: "createdBy",
      component: (
        <CellWithHelper
          label={dictionary.CreatedBy}
          helper={dictionary.CreatedOn}
        />
      ),
      size: 15,
    },
    {
      id: "editedBy",
      component: (
        <CellWithHelper
          label={dictionary.EditedBy}
          helper={dictionary.EditedOn}
        />
      ),
      size: 15,
    },
    { id: "actions", label: dictionary.Actions, alignRight: true, size: 5 },
  ];

  useEffect(() => {
    if (error) {
      toast({ title: dictionary.GenericError, variant: "destructive" });
    }
  }, [error]);

  useEffect(() => {
    setTransactionFilterBy(null);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setTotalClients(0);
    }
    if (data) {
      setTotalClients(data.numberOfEntries);
    }
  }, [data, isLoading]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {ClientTableHeaders.map((header) => (
              <TableHead
                key={header.id}
                className={`${header.alignRight ? "text-right" : "text-left"}`}
                style={{
                  width: `${header.size}%`,
                }}
              >
                {header.component ? (
                  header.component
                ) : (
                  <p className="pointer-events-none">{header.label}</p>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {isLoading && (
            <TableRow className=" hover:!bg-transparent">
              <TableCell
                className="align-top text-center"
                colSpan={ClientTableHeaders.length}
              >
                <Loader />
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow className=" hover:!bg-transparent">
              <TableCell
                className="align-top text-center"
                colSpan={ClientTableHeaders.length}
              >
                <div className="text-center">{dictionary.GenericError}</div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && data?.entries.length === 0 && (
            <TableRow className=" hover:!bg-transparent">
              <TableCell
                className="align-top text-center"
                colSpan={ClientTableHeaders.length}
              >
                <div className="text-center">{dictionary.NoResultsFound}</div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            data?.entries.length > 0 &&
            data.entries.map((client: any) => (
              <TableRow
                key={client.id}
                onClick={() => navigate(`${CLIENTS_PREFIX}/${client.id}`)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <ClientExpiringIcon expiringDocs={client.expiringDocs} />
                    {client.name}
                  </div>
                </TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>{client.telephone}</TableCell>
                <TableCell>{client.email}</TableCell>

                <TableCell>
                  <div className="flex items-center">
                    {valueToLabelClientType(client.clientType, dictionary)}
                  </div>
                </TableCell>
                <TableCell>
                  <CellWithHelper
                    label={client.createdByName}
                    value={client.creationDate}
                  />
                </TableCell>
                <TableCell>
                  <CellWithHelper
                    label={client.lastUpdatedByName}
                    value={client.lastUpdatedDate}
                  />
                </TableCell>
                <TableCell>
                  <ClientTableActions
                    id={client.id}
                    isArchived={isArchived}
                    email={client.email}
                    clientName={client.name}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {!isLoading && data && (
        <TablePagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={data.numberOfPages}
        />
      )}
    </>
  );
};
