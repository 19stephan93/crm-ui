import {
  selectedOrganizationAtom,
  userDetailsAtom,
} from "@/components/authentication/utils/authentication.recoil";
import { roleToLabel } from "@/components/settings/utils/consts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { LanguageContext } from "@/i18n/language-context";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";
import { useContext, useMemo } from "react";
import { useRecoilState } from "recoil";

export const HeaderAvatar = () => {
  const [userDetails] = useRecoilState(userDetailsAtom);
  const [selectedOrganization] = useRecoilState(selectedOrganizationAtom);
  const { dictionary } = useContext(LanguageContext);
  const userRole = useMemo(
    () =>
      userDetails?.roles.find(
        (role: any) => role.organizationId === selectedOrganization?.id
      )?.name,
    [selectedOrganization, userDetails]
  );
  const windowDimensions = useWindowDimensions();

  return windowDimensions.width > 500 ? (
    <div className="flex items-center gap-2 p-2 rounded-md bg-background ">
      <Avatar>
        <AvatarFallback className="text-sm md:text-lg !bg-secondary">
          <p className="text-md">
            {userDetails?.name.slice(0, 1)}
            {userDetails?.name.split(" ")[1]
              ? userDetails?.name.split(" ")[1].slice(0, 1)
              : null}
          </p>
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center">
        <div>
          <p className="text-xs text-muted-foreground">
            {roleToLabel(userRole, dictionary)}
          </p>
          <p>{userDetails?.name}</p>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
