import { TableRow, TableCell } from "@/components/ui/table";
import { TransactionsActions } from "./transactions-actions";
import { LanguageContext } from "@/i18n/language-context";
import { useContext } from "react";
import { getIcon, valueToLabelTabelTransactionType } from "../utils/consts";
import { TransactionProps } from "../utils/types";
import { formatDateCustom } from "@/components/clients/list/atoms/client-expiring";

export const Transaction = ({ transaction }: TransactionProps) => {
  const { dictionary } = useContext(LanguageContext);
  return (
    <TableRow key={transaction.id}>
      <TableCell>{getIcon(transaction.fileNames.split(",")[0])}</TableCell>
      <TableCell>{transaction.name}</TableCell>
      <TableCell>{transaction.amount}</TableCell>
      <TableCell>
        {valueToLabelTabelTransactionType(
          transaction.transactionType,
          dictionary
        )}
      </TableCell>
      <TableCell>
        {transaction.expiryDate
          ? formatDateCustom(transaction.expiryDate)
          : dictionary.NonExpiring}
      </TableCell>
      <TableCell className="text-xs italic">
        {transaction.fileNames.split(",").length > 0
          ? `${transaction.fileNames.split(",").length} files`
          : transaction.fileNames}
      </TableCell>
      <TableCell>
        <TransactionsActions transaction={transaction} />
      </TableCell>
    </TableRow>
  );
};
