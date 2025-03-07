import SearchBar from "@/components/common/search-bar";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import { ClientForm } from "../cells/client-form";
import { LanguageContext } from "@/i18n/language-context";
import { useContext } from "react";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";

export const ClientSearch = () => {
  const { dictionary } = useContext(LanguageContext);
  const windowDimensions = useWindowDimensions();
  return windowDimensions.width > 500 ? (
    <div className="flex gap-4 mx-4 justify-between items-center">
      <div className="w-[95%]">
        <SearchBar />
      </div>
      <div>
        <ClientForm
          initialValues={{}}
          sheetProps={{
            trigger: (
              <Button size={"sm"} variant={"default"} className="flex text-xs">
                <UserRoundPlus className="h-[1.2rem] w-[1.2rem] mr-2" />
                {dictionary.AddClient}
              </Button>
            ),
            title: `${dictionary.AddNewClientTitle}`,
            description: `${dictionary.AddNewClientDescription}`,
            submitTxt: `${dictionary.AddClient}`,
          }}
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-4 mx-4 justify-between items-end">
      <div className="w-full">
        <SearchBar />
      </div>

      <ClientForm
        initialValues={{}}
        sheetProps={{
          trigger: (
            <Button size={"sm"} variant={"default"} className="flex text-xs">
              <UserRoundPlus className="h-[1.2rem] w-[1.2rem] mr-2" />
              {dictionary.AddClient}
            </Button>
          ),
          title: `${dictionary.AddNewClientTitle}`,
          description: `${dictionary.AddNewClientDescription}`,
          submitTxt: `${dictionary.AddClient}`,
        }}
      />
    </div>
  );
};
