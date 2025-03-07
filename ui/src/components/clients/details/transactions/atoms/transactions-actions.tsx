import {
  DeleteTransaction,
  GetTransactionFile,
  UpdateTransaction,
} from "@/components/clients/core/transactions.service";
import { shouldRefetchAtom } from "@/components/clients/list/utils/clients.recoil";
import { Modal } from "@/components/common/modal";
import { toast } from "@/components/ui/use-toast";
import { LanguageContext } from "@/i18n/language-context";
import { AxiosStatusCode } from "@/lib/axios/helpers";
import useAxios from "@/lib/axios/useAxios";
import { Pencil, Trash, Download } from "lucide-react";
import { useContext, useEffect } from "react";
import { useRecoilState } from "recoil";
import { TransactionForm } from "../molecules/transaction-form";
import { Button } from "@/components/ui/button";
import { useForm, useFormFields } from "@formiz/core";
import {
  transactionChangedAtom,
  transactionTypeSelectAtom,
} from "@/components/clients/details/transactions/utils/transactions.recoil";
import { Loader } from "@/components/common/loader";
import { TransactionObject } from "../utils/types";

interface TransactionsActionsProps {
  transaction: TransactionObject;
}

export const TransactionsActions = ({
  transaction,
}: TransactionsActionsProps) => {
  const [transactionType, setTransactionType] = useRecoilState(
    transactionTypeSelectAtom
  );

  const { dictionary } = useContext(LanguageContext);

  const [, setShouldRefetch] = useRecoilState(shouldRefetchAtom);
  const [, setTransactionChanged] = useRecoilState(transactionChangedAtom);

  const updateTransactionForm = useForm();

  const values = useFormFields({
    connect: updateTransactionForm,
    selector: (field) => field.value,
  });

  const { error, dataCode, loadData, isLoading } = useAxios({
    fetchFn: DeleteTransaction,
    paramsOfFetch: {
      transactionId: transaction.id,
    },
  });

  const {
    data: transactionFileData,
    error: transactionFileError,
    dataCode: transactionFileDataCode,
    isLoading: transactionFileIsLoading,
    loadData: loadTransactionFile,
  } = useAxios({
    fetchFn: GetTransactionFile,
    paramsOfFetch: {
      transactionId: transaction.id,
    },
  });

  const {
    error: updateError,
    loadData: updateTransaction,
    dataCode: updateDataCode,
    isLoading: updateIsLoading,
  } = useAxios({
    fetchFn: UpdateTransaction,
    paramsOfFetch: {
      transactionId: transaction.id,
      body: {
        ...values,
        transactionType: transactionType,
      },
    },
  });

  const handleDelete = async () => {
    await loadData();
  };

  const handleDownload = async () => {
    await loadTransactionFile();
  };

  const handleEdit = async () => {
    if (!updateTransactionForm.isValid || !transactionType) return;
    await updateTransaction();
  };

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.target = "_blank";
    link.download =
      transaction.fileNames.split(",").length > 0
        ? `${transaction.fileNames.split(",").length} files.zip`
        : transaction.fileNames;
    const URL = window.URL || window.webkitURL;
    link.href = URL.createObjectURL(transactionFileData);
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    if (updateDataCode === AxiosStatusCode.CODE_200_OK) {
      toast({
        variant: "default",
        title: dictionary.TransactionUpdatedSuccesfully,
        duration: 500,
      });
      setTransactionChanged(true);
      setShouldRefetch(true);
      setTransactionType(null);
    } else if (updateError) {
      toast({ variant: "destructive", title: dictionary.GenericError });
    }
  }, [updateDataCode, updateError]);

  useEffect(() => {
    if (transactionFileDataCode === AxiosStatusCode.CODE_200_OK) {
      toast({
        variant: "default",
        title: dictionary.StartingFileDownload,
        duration: 500,
      });
      handleDownloadFile();
    } else if (transactionFileError) {
      toast({ variant: "destructive", title: dictionary.GenericError });
    }
  }, [transactionFileDataCode, transactionFileError]);

  useEffect(() => {
    if (dataCode === AxiosStatusCode.CODE_204_NO_CONTENT) {
      toast({
        variant: "success",
        title: dictionary.TransactionDeletedSuccesfully,
      });
      setTransactionChanged(true);
      setShouldRefetch(true);
    } else if (error) {
      toast({ variant: "destructive", title: dictionary.GenericError });
    }
  }, [dataCode, error]);

  return (
    <div className="flex justify-end items-center gap-2">
      <Modal
        trigger={
          <Button className="text-center" size={"xs"} variant="ghost">
            <Trash className="h-[1.2rem] w-[1.2rem] text-destructive" />
          </Button>
        }
        title={dictionary.DeleteClient}
        description={dictionary.DeleteClientConfirmation}
        confirmTxt={dictionary.Delete}
        cancelTxt={dictionary.Cancel}
        onConfirm={handleDelete}
        isLoading={isLoading}
        isDelete
      />
      <Modal
        trigger={
          <Button size={"xs"} variant="ghost">
            <Pencil className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        }
        title={dictionary.EditTransaction}
        description={dictionary.EditTransactionDescription}
        component={
          <TransactionForm
            form={updateTransactionForm}
            data={transaction}
            isEdit={true}
          />
        }
        confirmTxt={dictionary.Save}
        cancelTxt={dictionary.Cancel}
        onConfirm={handleEdit}
        isDisabled={!updateTransactionForm.isValid || !transactionType}
        isLoading={updateIsLoading}
      />
      <Button size={"xs"} variant="ghost" onClick={handleDownload}>
        {transactionFileIsLoading ? (
          <Loader className={"h-[1.2rem] w-[1.2rem]"} />
        ) : (
          <Download className="h-[1.2rem] w-[1.2rem]" />
        )}
      </Button>
    </div>
  );
};
