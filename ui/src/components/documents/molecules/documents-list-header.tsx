import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { LanguageContext } from "@/i18n/language-context";
import { useContext, useEffect, useState } from "react";
import { Modal } from "@/components/common/modal";
import useAxios from "@/lib/axios/useAxios";
import { AxiosStatusCode } from "@/lib/axios/helpers";
import { toast } from "@/components/ui/use-toast";
import { useRecoilState } from "recoil";

import { shouldRefetchAtom } from "@/components/clients/list/utils/clients.recoil";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { selectedOrganizationAtom } from "@/components/authentication/utils/authentication.recoil";
import { UploadOrganizationsDocuments } from "../core/documents.service";

export const DocumentsListHeader = () => {
  const [, setShouldRefetch] = useRecoilState(shouldRefetchAtom);
  const [selectedOrganization] = useRecoilState(selectedOrganizationAtom);
  const [file, setFile] = useState<File | null>(null);

  const { dictionary } = useContext(LanguageContext);

  const { data, error, loadData, dataCode, isLoading } = useAxios({
    fetchFn: UploadOrganizationsDocuments,
    paramsOfFetch: {
      organizationId: selectedOrganization?.id,
      body: {
        file: file,
      },
    },
  });

  const handleSubmit = async () => {
    if (!file) return;
    await loadData();
  };

  useEffect(() => {
    if (data && dataCode === AxiosStatusCode.CODE_201_CREATED) {
      toast({
        title: dictionary.DocumentAddedSuccesfully,
        variant: "success",
      });
      setShouldRefetch(true);
      setFile(null);
    } else if (error) {
      toast({ title: dictionary.GenericError, variant: "destructive" });
    }
  }, [dataCode, error]);

  return (
    <div className="flex gap-4 justify-between items-end">
      <div className="w-[100%]">
        <p className="font-medium text-md sm:text-lg">{dictionary.Documents}</p>
      </div>
      <div>
        <Modal
          trigger={
            <Button
              size={"sm"}
              className="text-xs flex items-center"
              variant={"default"}
            >
              <FilePlus2 className="h-[1.2rem] w-[1.2rem] mr-2" />
              {dictionary.AddDocuments}
            </Button>
          }
          title={dictionary.AddDocuments}
          description={dictionary.AddDocumentsDescription}
          component={
            <div className="col-span-4 w-full">
              <Label>{dictionary.UploadFile}</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
          }
          confirmTxt={dictionary.AddDocuments}
          cancelTxt={dictionary.Cancel}
          onConfirm={handleSubmit}
          isDisabled={!file}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
