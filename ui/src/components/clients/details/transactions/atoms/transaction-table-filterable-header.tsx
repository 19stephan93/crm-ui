import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import { LanguageContext } from "@/i18n/language-context";
import { useContext } from "react";
import { useRecoilState } from "recoil";

import { shouldRefetchAtom } from "@/components/clients/list/utils/clients.recoil";
import { filterTransactionTableByAtom } from "@/components/clients/details/transactions/utils/transactions.recoil";
import {
  selectTransactionsTypeOptions,
  valueToLabelTabelTransactionType,
} from "../utils/consts";

export const FilterableTableHeader = () => {
  const { dictionary } = useContext(LanguageContext);

  const [filterBy, setFilterBy] = useRecoilState(filterTransactionTableByAtom);
  const [, setShouldRefetch] = useRecoilState(shouldRefetchAtom);

  const handleFilterChange = (option: string | null) => {
    setFilterBy(option);
    setShouldRefetch(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span>{dictionary.TransactionType}</span>
          <ListFilter className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{dictionary.FilterBy}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {selectTransactionsTypeOptions.map((option: string, index: number) => (
          <DropdownMenuCheckboxItem
            key={`${option}-${index}`}
            checked={filterBy === option}
            onCheckedChange={() => handleFilterChange(option)}
          >
            {valueToLabelTabelTransactionType(option, dictionary)}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filterBy === null}
          onCheckedChange={() => handleFilterChange(null)}
        >
          {dictionary.NoFilters}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
