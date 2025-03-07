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
import {
  selectClientTypeOptions,
  valueToLabelClientType,
} from "../utils/consts";
import { LanguageContext } from "@/i18n/language-context";
import { useContext } from "react";
import { useRecoilState } from "recoil";
import { filterTableByAtom } from "../utils/clients.recoil";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";

export const FilterableTableHeader = () => {
  const { dictionary } = useContext(LanguageContext);

  const [filterBy, setFilterBy] = useRecoilState(filterTableByAtom);

  const handleFilterChange = (option: string | null) => {
    setFilterBy(option);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span className="text-bold">{dictionary.Type}</span>
          <ListFilter className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{dictionary.FilterBy}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {selectClientTypeOptions.map((option: string, index: number) => (
          <DropdownMenuCheckboxItem
            key={`${option}-${index}`}
            checked={filterBy === option}
            onCheckedChange={() => handleFilterChange(option)}
          >
            {valueToLabelClientType(option, dictionary)}
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

export const FilterDropdown = () => {
  const { dictionary } = useContext(LanguageContext);
  const windowDimensions = useWindowDimensions();

  const [filterBy, setFilterBy] = useRecoilState(filterTableByAtom);

  const handleFilterChange = (option: string | null) => {
    setFilterBy(option);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="flex  data-[state=open]:bg-accent text-sm"
        >
          <ListFilter className="h-[1.2rem] w-[1.2rem] mr-2" />
          {dictionary.FilterBy}
          {filterBy ? `: ${valueToLabelClientType(filterBy, dictionary)}` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={windowDimensions.width < 500 ? "bottom" : "left"}
        align="start"
      >
        <DropdownMenuLabel>{dictionary.FilterBy}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {selectClientTypeOptions.map((option: string, index: number) => (
          <DropdownMenuCheckboxItem
            key={`${option}-${index}`}
            checked={filterBy === option}
            onCheckedChange={() => handleFilterChange(option)}
          >
            {valueToLabelClientType(option, dictionary)}
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
