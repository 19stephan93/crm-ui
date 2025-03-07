import { Command, CommandInput } from "@/components/ui/command";
import { useRecoilState } from "recoil";
import { useContext, useState } from "react";
import { X } from "lucide-react";
import { LanguageContext } from "@/i18n/language-context";
import useDebounce from "@/lib/hooks/useDebounce";
import {
  searchValueTransactionsAtom,
  totalTransactionsAtom,
} from "../utils/transactions.recoil";
import { Button } from "@/components/ui/button";

const SearchBarTransactions = () => {
  const [searchValue, setSearchValue] = useRecoilState(
    searchValueTransactionsAtom
  );
  const [totalTransactions] = useRecoilState(totalTransactionsAtom);
  const [searchText, setSearchText] = useState<string | null>(null);
  const { dictionary } = useContext(LanguageContext);

  const resetSearchBar = () => {
    if ((searchValue !== null && searchValue !== "") || searchText !== "") {
      setSearchText(null);
      setSearchValue(null);
    }
  };

  useDebounce(
    () => {
      if (searchText === null) return;
      setSearchValue(searchText);
    },
    [searchText],
    800
  );

  return (
    <div className="flex items-center relative">
      <Command className="flex">
        <CommandInput
          value={searchText ?? ""}
          onValueChange={(e) => setSearchText(e)}
          placeholder={`${dictionary.SearchFromAList} ${totalTransactions} ${dictionary.TransactionsDots}`}
        />
      </Command>
      <Button
        className="absolute right-0 top-[50%] h-fit-content -translate-x-1/2 -translate-y-1/2"
        variant="ghost"
        size="xs"
        onClick={resetSearchBar}
      >
        <X />
      </Button>
    </div>
  );
};

export default SearchBarTransactions;
