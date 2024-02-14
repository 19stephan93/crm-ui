import InputWithLabel from "@/components/common/forms/input-with-label";
import { TransactionObject } from "@/components/clients/utils/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageContext } from "@/i18n/language-context";
import { Form, Formiz, useFormFields } from "@formiz/core";
import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  fileAtom,
  transactionTypeSelectAtom,
} from "@/components/clients/utils/transactions.recoil";
import {
  TransactionType,
  selectTransactionsTypeOptions,
  valueToLabelTransactionType,
} from "@/components/clients/utils/consts";
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

interface TransactionFormProps {
  form: Form;
  data?: TransactionObject;
}

export const TransactionForm = ({ form, data }: TransactionFormProps) => {
  const [, setFile] = useRecoilState(fileAtom);
  const [, setTransactionType] = useRecoilState(transactionTypeSelectAtom);

  const { dictionary } = useContext(LanguageContext);

  useEffect(() => {
    if (data) {
      setTransactionType(data.transactionType);
    } else {
      setTransactionType(TransactionType.INCOME);
    }
  }, [data]);

  useEffect(() => {
    form.setValues({
      ...data,
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

      {/* TODO Add validation to this filed */}
      {!data && (
        <div className="col-span-4 w-full">
          <Label>{dictionary.UploadFile}</Label>
          <Input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
      )}
    </Formiz>
  );
};
