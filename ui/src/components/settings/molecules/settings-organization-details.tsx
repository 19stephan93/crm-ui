import InputWithLabel from "@/components/common/forms/input-with-label";
import { Formiz, useForm, useFormFields } from "@formiz/core";
import { isRequired, isNotEmptyString } from "@formiz/validations";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageContext } from "@/i18n/language-context";
import { useContext, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

import { useRecoilState } from "recoil";
import {
  settingsCurrencyAtom,
  shouldRefetchOrganizationAtom,
} from "../core/settings.recoil";
import {
  SelectCurrencyOptions,
  selectCurrencyOptions,
  valueToLabelCurrency,
} from "@/components/initial-settings/utils/consts";
import { toast } from "@/components/ui/use-toast";
import { AxiosStatusCode } from "@/lib/axios/helpers";
import useAxios from "@/lib/axios/useAxios";
import { UpdateUserOrganization } from "../core/settings.service";
import { selectedOrganizationAtom } from "@/components/authentication/utils/authentication.recoil";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { Slot } from "../atoms/slot";

export const SettingsOrganizationDetails = () => {
  const settingsForm = useForm();

  // see this again
  const { dictionary } = useContext(LanguageContext);

  const [selectedOrganization, setSelectedOrganization] = useRecoilState(
    selectedOrganizationAtom
  );
  const [selectedCurrency, setSelectedCurrency] =
    useRecoilState(settingsCurrencyAtom);

  const [, setShouldRefetchOrganization] = useRecoilState(
    shouldRefetchOrganizationAtom
  );

  const values = useFormFields({
    connect: settingsForm,
    selector: (field) => field.value,
  });

  const [isReadonly, setIsReadonly] = useState(true);

  const {
    data: updatedOrganization,
    loadData: updateOrganization,
    error: updatedError,
    dataCode: updatedDataCode,
    isLoading: updatedIsLoading,
  } = useAxios({
    fetchFn: UpdateUserOrganization,
    paramsOfFetch: {
      body: {
        name: values.name,
        currency: selectedCurrency || selectedOrganization?.currency,
      },
      organizationId: selectedOrganization?.id,
    },
  });

  const handleUpdate = async () => {
    await updateOrganization();
  };

  const resetForm = async () => {
    settingsForm.setValues({
      name: selectedOrganization?.name,
    });
    setSelectedCurrency(
      selectedOrganization?.currency || SelectCurrencyOptions.USD
    );
    setIsReadonly(true);
  };

  useEffect(() => {
    if (updatedOrganization) {
      setSelectedOrganization(updatedOrganization);
    }
  }, [updatedOrganization]);

  useEffect(() => {
    if (updatedDataCode === AxiosStatusCode.CODE_200_OK) {
      toast({ title: dictionary.OrganizationUpdated, variant: "success" });
      setShouldRefetchOrganization(true);
    } else if (updatedError) {
      toast({
        title: dictionary.OrganizationUpdateError,
        variant: "destructive",
      });
      resetForm();
    }
  }, [updatedDataCode, updatedError]);

  useEffect(() => {
    if (selectedOrganization) {
      settingsForm.setValues({
        name: selectedOrganization.name,
      });
      setSelectedCurrency(selectedOrganization.currency);
    }
  }, []);

  return (
    <Slot className="w-full">
      <p className="font-semibold text-md sm:text-lg pointer-events-none">
        {dictionary.OrganizationSettings}
      </p>
      <Formiz connect={settingsForm}>
        <div className="flex bg-background flex-col p-4 mt-4 rounded-md w-full ">
          <div className="col-span-4 w-full h-full">
            <InputWithLabel
              label={dictionary.OrganizationName}
              type={"text"}
              name={"name"}
              required={dictionary.FieldCannotBeEmpty}
              validations={[
                {
                  handler: isRequired() && isNotEmptyString(),
                  message: `${dictionary.InvalidName}`,
                },
              ]}
              isDisabled={isReadonly}
            />
            <div className="col-span-4 w-full pb-5">
              <Select
                onValueChange={(e: any) => {
                  setSelectedCurrency(e);
                  settingsForm.setValues({ currency: e });
                }}
                value={selectedCurrency as SelectCurrencyOptions}
                disabled={isReadonly}
              >
                <Label>{dictionary.Currency}</Label>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={dictionary.Currency} />
                </SelectTrigger>
                <SelectContent>
                  {selectCurrencyOptions.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {valueToLabelCurrency(option, dictionary)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            {isReadonly ? (
              <>
                <Button
                  onClick={() => setIsReadonly(false)}
                  variant={"outline"}
                  disabled={updatedIsLoading}
                  className="text-xs"
                >
                  {dictionary.Edit}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={resetForm}
                  variant={"outline"}
                  disabled={updatedIsLoading}
                  className="text-xs"
                >
                  {dictionary.Cancel}
                </Button>
                <Button
                  className="text-xs"
                  onClick={() => handleUpdate()}
                  disabled={updatedIsLoading}
                >
                  {updatedIsLoading ? <Loader /> : dictionary.Save}
                </Button>
              </>
            )}
          </div>
        </div>
      </Formiz>
    </Slot>
  );
};
