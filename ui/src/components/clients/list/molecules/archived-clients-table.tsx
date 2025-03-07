import { GetClients } from "@/components/dashboard/core/dashboard.service";
import useAxios from "@/lib/axios/useAxios";
import { ClientTable } from "../cells/client-table";
import { useRecoilState } from "recoil";
import {
  currentPageAtom,
  filterTableByAtom,
  searchValueAtom,
  shouldRefetchAtom,
  totalPagesAtom,
} from "../utils/clients.recoil";
import { useEffect, useState } from "react";
import { selectedOrganizationAtom } from "@/components/authentication/utils/authentication.recoil";

export const ArchivedClientsTable = () => {
  const [filterBy] = useRecoilState(filterTableByAtom);
  const [searchValue] = useRecoilState(searchValueAtom);
  const [shouldRefetch, setShouldRefetch] = useRecoilState(shouldRefetchAtom);
  const [selectedOrganization] = useRecoilState(selectedOrganizationAtom);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data, error, isLoading, loadData } = useAxios({
    fetchFn: GetClients,
    paramsOfFetch: {
      organizationId: selectedOrganization?.id,
      page: currentPage,
      size: 15,
      active: false,
      clientType: filterBy,
      nameSearchText: searchValue,
    },
  });

  useEffect(() => {
    setCurrentPage(0);
    setShouldRefetch(true);
  }, [filterBy]);

  useEffect(() => {
    setCurrentPage(0);
    setShouldRefetch(true);
  }, [searchValue]);

  useEffect(() => {
    if (shouldRefetch) {
      loadData();
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  return (
    <ClientTable
      data={data}
      error={error}
      isLoading={isLoading}
      isArchived={true}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};
