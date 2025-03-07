import { UploadImage } from "@/components/common/settings/molecules/upload-image";
import { Slot } from "../atoms/slot";
import { organizationLogoAtom } from "../core/settings.recoil";
import { useRecoilState } from "recoil";
import { useContext, useEffect, useState } from "react";
import {
  selectedOrganizationAtom,
  userDetailsAtom,
} from "@/components/authentication/utils/authentication.recoil";
import useAxios from "@/lib/axios/useAxios";
import { UpdateOrganizationLogo } from "../core/settings.service";
import { Button } from "@/components/ui/button";
import { LanguageContext } from "@/i18n/language-context";
import { Loader } from "@/components/common/loader";

export const SettingsOrganizationLogo = () => {
  const [selectedOrganization] = useRecoilState(selectedOrganizationAtom);
  const [file, setFile] = useState<File | null>(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const { dictionary } = useContext(LanguageContext);

  const {
    data: logoUpdateDate,
    loadData: logoUpdate,
    error: logoUpdateError,
    dataCode: logoUpdateDataCode,
    isLoading: logoUpdateIsLoading,
  } = useAxios({
    fetchFn: UpdateOrganizationLogo,
    paramsOfFetch: {
      organizationId: selectedOrganization?.id,
      body: {
        organizationLogo: file,
      },
    },
  });

  const handleUpdate = async () => {
    await logoUpdate();
  };

  const resetForm = () => {
    setFile(null);
    setIsReadonly(true);
  };

  useEffect(() => {
    if (selectedOrganization) {
      setFile(selectedOrganization.logo);
    }
  }, []);

  return (
    <Slot>
      <p className="font-semibold text-lg">{dictionary.OrganizationLogo}</p>
      <div className="col-span-4 bg-background p-4 mt-4 rounded-md w-full h-full">
        <UploadImage isReadonly={isReadonly} file={file} setFile={setFile} />

        <div className="flex gap-4 justify-end mt-6">
          {isReadonly ? (
            <>
              <Button
                onClick={() => setIsReadonly(false)}
                variant={"outline"}
                disabled={logoUpdateIsLoading}
              >
                {dictionary.Edit}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={resetForm}
                variant={"outline"}
                disabled={logoUpdateIsLoading}
              >
                {dictionary.Cancel}
              </Button>
              <Button onClick={handleUpdate} disabled={logoUpdateIsLoading}>
                {logoUpdateIsLoading ? <Loader /> : dictionary.Save}
              </Button>
            </>
          )}
        </div>
      </div>
    </Slot>
  );
};
