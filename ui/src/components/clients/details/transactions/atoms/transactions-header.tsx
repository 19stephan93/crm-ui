import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { LanguageContext } from "@/i18n/language-context";
import { useContext, useEffect } from "react";
import { Modal } from "@/components/common/modal";
import { TransactionForm } from "../molecules/transaction-form";
import { AddTransaction } from "@/components/clients/core/transactions.service";
import useAxios from "@/lib/axios/useAxios";
import { useParams } from "react-router-dom";
import { useForm, useFormFields } from "@formiz/core";
import { AxiosStatusCode } from "@/lib/axios/helpers";
import { toast } from "@/components/ui/use-toast";
import { useRecoilState } from "recoil";
import {
  fileAtom,
  transactionChangedAtom,
  transactionExpiryDateAtom,
  transactionTypeSelectAtom,
} from "@/components/clients/details/transactions/utils/transactions.recoil";
import { shouldRefetchAtom } from "@/components/clients/list/utils/clients.recoil";
import SearchBarTransactions from "./search-bar-transactions";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";

export const TransactionsHeader = () => {
  const [transactionType, setTransactionType] = useRecoilState(
    transactionTypeSelectAtom
  );
  const [, setShouldRefetch] = useRecoilState(shouldRefetchAtom);
  const [file, setFile] = useRecoilState(fileAtom);
  const [transactionExpiryDate, setTransactionExpiryDate] = useRecoilState(
    transactionExpiryDateAtom
  );

  const { dictionary } = useContext(LanguageContext);

  const { clientId } = useParams();

  const addTransactionForm = useForm();

  const [, setTransactionChanged] = useRecoilState(transactionChangedAtom);

  const windowDimensions = useWindowDimensions();

  const values = useFormFields({
    connect: addTransactionForm,
    selector: (field) => field.value,
  });

  const { data, error, loadData, dataCode, isLoading } = useAxios({
    fetchFn: AddTransaction,
    paramsOfFetch: {
      clientId: clientId,
      body: {
        ...values,
        expiryDate: transactionExpiryDate,
        transactionType: transactionType,
      },
      files: file,
    },
  });

  const handleSubmit = async () => {
    if (!addTransactionForm.isValid || !transactionType || !file) return;
    await loadData();
  };

  useEffect(() => {
    if (data && dataCode === AxiosStatusCode.CODE_201_CREATED) {
      toast({
        title: dictionary.TransactionAddedSuccesfully,
        variant: "success",
      });
      setTransactionChanged(true);
      setShouldRefetch(true);
      setTransactionType(null);
      setFile(null);
      setTransactionExpiryDate(undefined);
    } else if (error) {
      toast({ title: dictionary.GenericError, variant: "destructive" });
    }
  }, [dataCode, error]);

  return (
    <div className="flex gap-2  flex-col">
      <p className="font-medium text-md">{dictionary.Transactions}</p>
      <div
        className={`flex gap-2 items-center w-full ${
          windowDimensions.width > 500 ? "flex-row" : "flex-col"
        }`}
      >
        <div className="w-full">
          <SearchBarTransactions />
        </div>
        <Modal
          trigger={
            <Button
              size={"sm"}
              className={`text-xs flex items-center ${
                windowDimensions.width > 500 ? "" : "w-full"
              }`}
              variant={"default"}
            >
              <FilePlus2 className="h-[1.2rem] w-[1.2rem] mr-2" />
              {dictionary.AddTransaction}
            </Button>
          }
          title={dictionary.AddTransaction}
          description={dictionary.AddTransactionDescription}
          component={<TransactionForm form={addTransactionForm} />}
          confirmTxt={dictionary.AddTransaction}
          cancelTxt={dictionary.Cancel}
          onConfirm={handleSubmit}
          isDisabled={!addTransactionForm.isValid || !transactionType || !file}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
