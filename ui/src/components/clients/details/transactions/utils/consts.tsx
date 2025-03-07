import { Icons } from "@/components/ui/icons";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { FileExtensions, TransactionType } from "./types";
import { CellWithHelper } from "@/components/clients/list/atoms/cell-with-helper";

export const transactionHeaders = (
  dictionary: any,
  component?: any,
  hasAmount: boolean = true
) => {
  return [
    { id: "icon", label: dictionary.FileType, size: 10 },
    { id: "name", label: dictionary.Name, size: 20 },
    hasAmount ? { id: "amount", label: dictionary.Amount, size: 10 } : {},
    { id: "transactionType", component: component, size: 10 },
    { id: "expiryDate", label: dictionary.ExpiringDate, size: 20 },
    { id: "fileName", label: dictionary.FileName, size: 10 },
    { id: "actions", label: dictionary.Actions, alignRight: true, size: 20 },
  ];
};

export const documentsHeader = (dictionary: any) => {
  return [
    { id: "icon", label: dictionary.FileType, size: 10 },
    { id: "name", label: dictionary.Name, size: 30 },
    {
      id: "createdBy",
      component: (
        <CellWithHelper
          label={dictionary.CreatedBy}
          helper={dictionary.CreatedOn}
        />
      ),
      size: 25,
    },
    {
      id: "editedBy",
      component: (
        <CellWithHelper
          label={dictionary.EditedBy}
          helper={dictionary.EditedOn}
        />
      ),
      size: 25,
    },
    { id: "actions", label: dictionary.Actions, alignRight: true, size: 10 },
  ];
};

export const emailEventsHeasder = (dictionary: any) => {
  return [
    { id: "subject", label: dictionary.Subject, size: 40 },
    { id: "date", label: dictionary.Date, size: 40 },
    { id: "status", label: dictionary.Status, size: 20 },
  ];
};

export const selectTransactionsTypeOptions = [
  TransactionType.INCOME,
  TransactionType.EXPENSE,
  TransactionType.RECURRING_EXPENSE,
];

export const valueToLabelTransactionType = (
  option: string,
  dictionary: any
) => {
  switch (option) {
    case TransactionType.INCOME:
      return dictionary.Income;
    case TransactionType.EXPENSE:
      return dictionary.Expense;
    case TransactionType.RECURRING_EXPENSE:
      return dictionary.RecurringExpense;
    default:
      return option;
  }
};

export const valueToLabelTabelTransactionType = (
  option: string,
  dictionary: any
) => {
  switch (option) {
    case TransactionType.INCOME:
      return (
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="h-[1.2rem] w-[1.2rem] text-green-500" />
          {dictionary.Income}
        </div>
      );
    case TransactionType.EXPENSE:
      return (
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="h-[1.2rem] w-[1.2rem] text-destructive" />
          {dictionary.Expense}
        </div>
      );
    case TransactionType.RECURRING_EXPENSE:
      return (
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="h-[1.2rem] w-[1.2rem] text-destructive" />
          {dictionary.RecurringExpense}
        </div>
      );
    default:
      return option;
  }
};

export const getFileExtension = (fileName: string) => {
  const splitArr = fileName.split(".");
  return splitArr[splitArr.length - 1];
};

export const getIcon = (fileName: string) => {
  const extension = getFileExtension(fileName);
  switch (extension) {
    case FileExtensions.PDF:
      return <Icons.filePDF />;
    case FileExtensions.DOC:
      return <Icons.fileWord />;
    case FileExtensions.DOCX:
      return <Icons.fileWord />;
    case FileExtensions.XLS:
      return <Icons.fileExcel />;
    case FileExtensions.XLSX:
      return <Icons.fileExcel />;
    case FileExtensions.JPG:
      return <Icons.fileImage />;
    case FileExtensions.JPEG:
      return <Icons.fileImage />;
    case FileExtensions.PNG:
      return <Icons.fileImage />;
    default:
      return <Icons.file />;
  }
};
