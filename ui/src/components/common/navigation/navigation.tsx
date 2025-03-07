import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/common/navigation/atoms/mode-toggle";
import Logo from "./atoms/logo";
import { useRecoilState } from "recoil";
import {
  activeNavTabAtom,
  expandedNavBarAtom,
} from "@/components/common/navigation/utils/navigation.recoil";
import Logout from "@/components/common/navigation/atoms/logout";
import { useContext } from "react";
import { LanguageContext } from "@/i18n/language-context";
import { selectedOrganizationAtom } from "@/components/authentication/utils/authentication.recoil";
import { linksToLabel } from "./utils/consts";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import LanguageSelector from "@/components/settings/atoms/language-selector";
import { CustomTooltip } from "../tooltip";

const Navigation = () => {
  const { dictionary } = useContext(LanguageContext);
  const [expandedNavBar, setExpandedNavBar] =
    useRecoilState(expandedNavBarAtom);
  const [isActive] = useRecoilState(activeNavTabAtom);
  const [selectedOrganization] = useRecoilState(selectedOrganizationAtom);

  const toggleNavBar = () => {
    setExpandedNavBar(!expandedNavBar);
  };

  return (
    <div
      className={`flex h-screen ${
        expandedNavBar ? "w-[192px]" : "w-[60px]"
      } flex-col bg-secondary fixed z-10 top-0`}
    >
      <div
        className={`flex w-full h-[5vh] mb-4 pt-4 items-center ${
          !expandedNavBar ? "justify-center" : "justify-start px-2 "
        }`}
      >
        <Logo title={expandedNavBar ? selectedOrganization?.name : ""} />
      </div>
      <div className="flex flex-col h-[90vh] w-full justify-between">
        <div className="flex flex-col w-full">
          <NavigationMenu className="block max-w-full w-full justify-start">
            <NavigationMenuList className="flex flex-col w-full items-start gap-1.5 py-2 px-2">
              {linksToLabel(dictionary)?.map((link, index) => (
                <CustomTooltip content={link.tooltipContent} key={index}>
                  <NavigationMenuItem
                    className={
                      isActive === index
                        ? "bg-accent-links w-full !m-0 rounded"
                        : "!m-0 cursor-pointer ease-in-out w-full rounded hover:bg-accent-links"
                    }
                  >
                    <Link
                      key={`${link.id}-${link.name}`}
                      to={link.href}
                      className={`w-full flex ${
                        expandedNavBar ? "justify-start" : "justify-center"
                      } items-center px-2 py-2 h-[40px]`}
                    >
                      {link.icon}
                      <p className={`${expandedNavBar && "ml-2"}`}>
                        {link.name}
                      </p>
                    </Link>
                  </NavigationMenuItem>
                </CustomTooltip>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-col gap-2">
          {expandedNavBar ? (
            <div className="flex flex-row items-center justify-between gap-2 px-4">
              <LanguageSelector />
              <ModeToggle />
              <Logout />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-start gap-2 px-4">
              <LanguageSelector />
              <ModeToggle />
              <Logout />
            </div>
          )}
          <div
            className={`flex flex-row items-center justify-center gap-2 ${
              expandedNavBar && "px-4"
            }`}
          >
            <Button
              variant="outlineSecondary"
              className={expandedNavBar ? "w-full" : undefined}
              size="icon"
              onClick={toggleNavBar}
            >
              {expandedNavBar ? (
                dictionary.Collapse
              ) : (
                <CustomTooltip content={dictionary.Expand}>
                  <Maximize2 className="h-[1.2rem] w-[1.2rem]" />
                </CustomTooltip>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
