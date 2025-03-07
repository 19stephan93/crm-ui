import { CustomTooltip } from "@/components/common/tooltip";
import { valueToLabelLanguageShort } from "@/components/initial-settings/utils/consts";
import { Button } from "@/components/ui/button";
import { LanguageContext } from "@/i18n/language-context";
import { useContext, useEffect, useState } from "react";

export default function LanguageSelector() {
  const { userLanguage, userLanguageChange, dictionary }: any =
    useContext(LanguageContext);
  const [currentLanguage, setCurrentLanguage] = useState<"ro" | "en">(
    userLanguage
  );

  const handleLanguageChange = () => {
    if (currentLanguage === "en") {
      setCurrentLanguage("ro");
    } else if (currentLanguage === "ro") {
      setCurrentLanguage("en");
    }
  };

  useEffect(() => {
    currentLanguage === "en"
      ? userLanguageChange("en")
      : userLanguageChange("ro");
  }, [currentLanguage]);

  return (
    <CustomTooltip content={dictionary.Language}>
      <Button
        onClick={handleLanguageChange}
        variant="outlineSecondary"
        size="icon"
      >
        {valueToLabelLanguageShort(currentLanguage)}
      </Button>
    </CustomTooltip>
  );
}
