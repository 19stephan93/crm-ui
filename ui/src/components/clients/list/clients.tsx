import { useContext, useEffect } from "react";
import { Header } from "../../common/header/header";
import { LanguageContext } from "@/i18n/language-context";
import { ClientSearch } from "./atoms/client-list-header";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArchivedClientsTable } from "./molecules/archived-clients-table";
import { ActiveClientsTable } from "./molecules/active-clients-table";
import { useRecoilState } from "recoil";
import {
  currentPageAtom,
  filterTableByAtom,
  searchValueAtom,
  totalPagesAtom,
} from "./utils/clients.recoil";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";

const Clients = () => {
  const [, setFilterBy] = useRecoilState(filterTableByAtom);
  const [, setSearchValue] = useRecoilState(searchValueAtom);
  const [, setCurrentPage] = useRecoilState(currentPageAtom);
  const [, setTotalPages] = useRecoilState(totalPagesAtom);
  const { dictionary } = useContext(LanguageContext);
  const windowDimensions = useWindowDimensions();

  const handleResetFilters = () => {
    setFilterBy(null);
  };

  const handleResetSearch = () => {
    setSearchValue("");
  };

  const handleResetPage = () => {
    setCurrentPage(0);
  };

  const handleResetsOnTabChange = () => {
    handleResetFilters();
    handleResetSearch();
    handleResetPage();
  };

  useEffect(() => {
    setTotalPages(0);
    setCurrentPage(0);
  }, []);

  return (
    <div className="px-4 md:px-8 pb-4">
      <Header title={dictionary.Clients} />
      <div className="flex min-h-[90vh] pt-4 mt-4 flex-col bg-secondary rounded-md">
        <ClientSearch />
        <div className="flex flex-col gap-4 h-full overflow-auto justify-between bg-background rounded-md m-4">
          <Tabs
            onValueChange={handleResetsOnTabChange}
            defaultValue="active"
            className="w-full flex flex-col mt-4"
          >
            <div
              className={`flex justify-between pr-4 pl-4 ${
                windowDimensions.width < 500
                  ? "flex-col"
                  : "flex-row items-center"
              } gap-2`}
            >
              <TabsList
                className={`justify-start ${
                  windowDimensions.width < 500 ? "w-full" : ""
                }`}
              >
                <TabsTrigger value="active" className="w-full">
                  {dictionary.ActiveClients}
                </TabsTrigger>
                <TabsTrigger value="archived" className="w-full">
                  {dictionary.ArchivedClients}
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="active" className="mx-4">
              <ActiveClientsTable />
            </TabsContent>
            <TabsContent value="archived" className="mx-4">
              <ArchivedClientsTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Clients;
