import { Moon, Sun, SunMoon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/common/theme-provider";
import { CustomTooltip } from "../../tooltip";
import { useContext } from "react";
import { LanguageContext } from "@/i18n/language-context";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { dictionary } = useContext(LanguageContext);

  return (
    <DropdownMenu>
      <CustomTooltip content={dictionary.Theme}>
        <DropdownMenuTrigger asChild>
          <Button variant="outlineSecondary" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
      </CustomTooltip>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        align="end"
      >
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] mr-2" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-[1.2rem] w-[1.2rem] mr-2" /> Dark
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("system")}
        >
          <SunMoon className="h-[1.2rem] w-[1.2rem] mr-2" /> System
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
