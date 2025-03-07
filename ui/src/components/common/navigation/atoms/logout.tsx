import { DoorOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { PagesURL } from "@/components/authentication/utils/consts";
import {
  idTokenAtom,
  userDetailsAtom,
} from "@/components/authentication/utils/authentication.recoil";
import { CustomTooltip } from "../../tooltip";
import { useContext } from "react";
import { LanguageContext } from "@/i18n/language-context";

const Logout = () => {
  const navigate = useNavigate();
  const [, setIdToken] = useRecoilState(idTokenAtom);
  const [, setUserDetails] = useRecoilState(userDetailsAtom);
  const logoutAndRedirect = () => {
    setIdToken(null);
    setUserDetails(null);
    localStorage.removeItem("idToken");
    navigate(PagesURL.AUTHENTICATION);
  };
  const { dictionary } = useContext(LanguageContext);
  return (
    <CustomTooltip content={dictionary.Logout}>
      <Button
        variant="outlineSecondary"
        size="icon"
        onClick={logoutAndRedirect}
      >
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Logout</span>
      </Button>
    </CustomTooltip>
  );
};

export default Logout;
