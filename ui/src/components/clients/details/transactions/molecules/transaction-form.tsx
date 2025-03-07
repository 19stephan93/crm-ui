import InputWithLabel from "@/components/common/forms/input-with-label";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageContext } from "@/i18n/language-context";
import { Form, Formiz } from "@formiz/core";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  fileAtom,
  transactionExpiryDateAtom,
  transactionTypeSelectAtom,
} from "@/components/clients/details/transactions/utils/transactions.recoil";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  isMinNumber,
  isNotEmptyString,
  isNumber,
  isRequired,
} from "@formiz/validations";
import {
  selectTransactionsTypeOptions,
  valueToLabelTransactionType,
} from "../utils/consts";
import { TransactionObject, TransactionType } from "../utils/types";
import { UploadFiles } from "@/components/common/settings/molecules/upload-image";
import { CheckboxWithText } from "@/components/common/forms/checkbox-with-text";
import { DatePicker } from "@/components/common/date-picker";

interface TransactionFormProps {
  form: Form;
  data?: TransactionObject;
  isEdit?: boolean;
}

export const TransactionForm = ({
  form,
  data,
  isEdit = false,
}: TransactionFormProps) => {
  const [files, setFiles] = useRecoilState(fileAtom);
  const [transactionExpiryDate, setTransactionExpiryDate] = useRecoilState(
    transactionExpiryDateAtom
  );
  const [, setTransactionType] = useRecoilState(transactionTypeSelectAtom);
  const [shouldDisplayDatePicker, setShouldDisplayDatePicker] = useState(
    data?.expiryDate ? true : false
  );

  const { dictionary } = useContext(LanguageContext);

  useEffect(() => {
    if (data) {
      setTransactionType(data.transactionType);
    } else {
      setTransactionType(TransactionType.INCOME);
    }
  }, [data]);

  useEffect(() => {
    setFiles(null);
    setTransactionExpiryDate(undefined);
  }, []);

  useEffect(() => {
    form.setValues({
      ...data,
      expiryDate: data?.expiryDate,
      transactionType: data?.transactionType,
    });
  }, [data]);

  return (
    <Formiz connect={form}>
      <div className="col-span-4 w-full">
        <InputWithLabel
          label={dictionary.Name}
          type={"text"}
          name={"name"}
          required={dictionary.FieldCannotBeEmpty}
          validations={[
            {
              handler: isRequired() && isNotEmptyString(),
              message: `${dictionary.InvalidName}`,
            },
          ]}
        />
      </div>
      <div className="col-span-4 w-full">
        <InputWithLabel
          label={dictionary.Amount}
          type={"number"}
          name={"amount"}
          required={dictionary.FieldCannotBeEmpty}
          validations={[
            {
              handler: isRequired() && isNumber() && isMinNumber(0),
              message: `${dictionary.InvalidAmount}`,
            },
          ]}
        />
      </div>
      <div className="col-span-4 w-full pb-4">
        <Select
          onValueChange={(e: any) => setTransactionType(e)}
          defaultValue={data?.transactionType}
        >
          <Label>{dictionary.TransactionType}</Label>
          <SelectTrigger>
            <SelectValue placeholder={dictionary.Income} />
          </SelectTrigger>
          <SelectContent>
            {selectTransactionsTypeOptions.map((option: string) => (
              <SelectItem key={option} value={option}>
                {valueToLabelTransactionType(option, dictionary)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!isEdit && (
        <>
          <div className="col-span-4 w-full">
            <CheckboxWithText
              checked={shouldDisplayDatePicker}
              onCheckedChange={setShouldDisplayDatePicker}
              label={dictionary.DisplayDatePicker}
            />
          </div>
          {shouldDisplayDatePicker && (
            <div className="col-span-4 w-full">
              <DatePicker
                date={transactionExpiryDate}
                setDate={setTransactionExpiryDate}
                dateFormat="dd MMM yyyy"
                full={true}
              />
            </div>
          )}
        </>
      )}

      {/* TODO Add validation to this filed */}
      {!data && (
        <UploadFiles
          setFiles={setFiles}
          files={files ?? []}
          isReadonly={false}
          accept={{}}
        />
      )}
    </Formiz>
  );
};
