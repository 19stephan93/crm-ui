import { Formiz, useForm, useFormFields } from "@formiz/core";
import { ExportPDF } from "../core/documents.service";
import useAxios from "@/lib/axios/useAxios";
import { useRecoilState } from "recoil";
import { selectedOrganizationAtom } from "@/components/authentication/utils/authentication.recoil";
import InputWithLabel from "@/components/common/forms/input-with-label";
import {
  isMaxNumber,
  isMinNumber,
  isNotEmptyString,
  isNumber,
  isRequired,
} from "@formiz/validations";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "@/i18n/language-context";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { AxiosStatusCode } from "@/lib/axios/helpers";
import { toast } from "@/components/ui/use-toast";
import { CheckboxWithText } from "@/components/common/forms/checkbox-with-text";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DocumentCard } from "../atoms/document-card";

interface CheckboxProps {
  name: string;
  value: boolean;
  label: string;
}

export const DocumentsForm = () => {
  const [selectedOrganization] = useRecoilState(selectedOrganizationAtom);
  const { dictionary } = useContext(LanguageContext);
  const [open, setOpen] = useState<boolean>(false);
  const CHECKBOXES_DECLARATIE_UNICA = [
    { name: "check1", value: false, label: dictionary.DECLARATIE_UNICA_CHECK1 },
    { name: "check2", value: false, label: dictionary.DECLARATIE_UNICA_CHECK2 },
    { name: "check3", value: false, label: dictionary.DECLARATIE_UNICA_CHECK3 },
    { name: "check4", value: false, label: dictionary.DECLARATIE_UNICA_CHECK4 },
    { name: "check5", value: false, label: dictionary.DECLARATIE_UNICA_CHECK5 },
    { name: "check6", value: false, label: dictionary.DECLARATIE_UNICA_CHECK6 },
    { name: "check7", value: false, label: dictionary.DECLARATIE_UNICA_CHECK7 },
    { name: "check8", value: false, label: dictionary.DECLARATIE_UNICA_CHECK8 },
    { name: "check9", value: false, label: dictionary.DECLARATIE_UNICA_CHECK9 },
    {
      name: "check10",
      value: false,
      label: dictionary.DECLARATIE_UNICA_CHECK10,
    },
  ];

  const [checkboxes, setCheckboxes] = useState<CheckboxProps[]>(
    CHECKBOXES_DECLARATIE_UNICA
  );

  const pdfForm = useForm({
    initialValues: {},
  });

  const values = useFormFields({
    connect: pdfForm,
    selector: (field) => field.value,
  });

  // TODO: Refactor this
  const buildObject = (arr: CheckboxProps[]) => {
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      const { name, value } = arr[i];
      //@ts-ignore
      value ? (obj[name] = value) : null;
    }
    const payload = {
      ...obj,
      ...values,
      "pdf-type": "declaratie_raspundere.pdf",
    };
    return payload;
  };

  const { data, error, isLoading, loadData, dataCode } = useAxios({
    fetchFn: ExportPDF,
    paramsOfFetch: {
      organizationId: selectedOrganization?.id,
      body: buildObject(checkboxes),
    },
  });

  const handleSubmit = () => {
    loadData();
  };

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.target = "_blank";
    link.download = "declaratie_unica.pdf";
    const URL = window.URL || window.webkitURL;
    link.href = URL.createObjectURL(new Blob([data]));
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    pdfForm.reset();
  };

  const handleCheckedChange = (checkbox: CheckboxProps) => {
    const modifiedArr = checkboxes.map((chkbox) =>
      chkbox.name === checkbox.name
        ? { ...chkbox, value: !chkbox.value }
        : { ...chkbox }
    );
    setCheckboxes(modifiedArr);
  };

  useEffect(() => {
    if (dataCode === AxiosStatusCode.CODE_200_OK) {
      toast({ title: dictionary.ExportPDFSuccess, variant: "success" });
      handleDownloadFile();
    } else if (error) {
      toast({ title: dictionary.ExportPDFError, variant: "destructive" });
    }
  }, [dataCode, error]);

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DocumentCard
          title={dictionary.DECLARATIE_UNICA}
          description={dictionary.DECLARATIE_UNICA_DESCRIPTION}
          file_type=".pdf"
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[350px] md:max-w-[500px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{dictionary.GenerateDocument}</DialogTitle>
          <div className="flex flex-col w-full justify-between rounded-md bg-background">
            <div className="flex w-full pt-2 flex-col rounded-md gap-2">
              <Formiz connect={pdfForm}>
                <div className="flex w-full gap-2">
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.FirstName}
                      type={"text"}
                      name={"firstName"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler: isRequired() && isNotEmptyString(),
                          message: `${dictionary.InvalidFirstName}`,
                        },
                      ]}
                    />
                  </div>
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.LastName}
                      type={"text"}
                      name={"lastName"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler: isRequired() && isNotEmptyString(),
                          message: `${dictionary.InvalidLastName}`,
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex w-full gap-2">
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.Day}
                      type={"number"}
                      name={"day"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler:
                            isRequired() &&
                            isNumber() &&
                            isMaxNumber(31) &&
                            isMinNumber(1),
                          message: `${dictionary.InvalidDay}`,
                        },
                      ]}
                    />
                  </div>
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.Month}
                      type={"number"}
                      name={"month"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler:
                            isRequired() &&
                            isNumber() &&
                            isMaxNumber(12) &&
                            isMinNumber(1),
                          message: `${dictionary.InvalidDay}`,
                        },
                      ]}
                    />
                  </div>
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.Year}
                      type={"number"}
                      name={"year"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler: isRequired() && isNumber() && isMinNumber(1),
                          message: `${dictionary.InvalidYear}`,
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex w-full gap-2">
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.Address1}
                      type={"text"}
                      name={"address1"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler: isRequired() && isNotEmptyString(),
                          message: `${dictionary.InvalidAddress}`,
                        },
                      ]}
                    />
                  </div>
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.Address2}
                      type={"text"}
                      name={"address2"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler: isRequired() && isNotEmptyString(),
                          message: `${dictionary.InvalidAddress}`,
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex w-full gap-2">
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.Destination}
                      type={"text"}
                      name={"destination"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler: isRequired() && isNotEmptyString(),
                          message: `${dictionary.InvalidDestination}`,
                        },
                      ]}
                    />
                  </div>
                  <div className="col-span-4 w-full">
                    <InputWithLabel
                      label={dictionary.Date}
                      type={"date"}
                      name={"date"}
                      required={dictionary.FieldCannotBeEmpty}
                      validations={[
                        {
                          handler: isRequired() && isNotEmptyString(),
                          message: `${dictionary.InvalidDate}`,
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col justify-end gap-2 pt-4">
                  {checkboxes.map((checkbox, index) => (
                    <CheckboxWithText
                      key={`${checkbox.name}-${index}`}
                      name={checkbox.name}
                      label={checkbox.label}
                      checked={checkbox.value}
                      onCheckedChange={() => handleCheckedChange(checkbox)}
                    />
                  ))}
                </div>
              </Formiz>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              variant={"outline"}
              onClick={onCancel}
              type="button"
              className="text-xs flex items-center px-8"
            >
              {dictionary.Cancel}
            </Button>
          </DialogClose>
          <Button
            variant={"default"}
            onClick={handleSubmit}
            type="button"
            disabled={isLoading || !pdfForm.isValid}
            className="text-xs flex items-center px-8"
          >
            {isLoading ? <Loader /> : dictionary.GenerateDocument}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
