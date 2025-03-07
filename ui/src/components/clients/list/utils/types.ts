export type ExpiringDoc = {
  name: string;
  expiryDate: Date;
};
export interface Client {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  type: string;
  actions: any;
  expiringDocs?: ExpiringDoc;
}

export interface InfoCardType {
  id: number;
  label: string;
  amount: number;
  pastAmount: number;
}

export interface InputWithLabelProps {
  label: string;
  isLoading?: boolean;
  type: string;
  name: string;
  validations?: any;
  placeholder?: string;
  options?: string[];
  isDisabled?: boolean;
  defaultValue?: string | number;
  required?: boolean | string;
}

export interface TextareaWithLabelProps {
  label: string;
  isLoading?: boolean;
  name: string;
  placeholder?: string;
  isDisabled?: boolean;
  defaultValue?: string | number;
}

export interface ClientFormProps {
  fields?: string[];
  initialValues: {};
  sheetProps: SheetProps;
}

export interface SheetProps {
  trigger: string | React.FC | any;
  title: string;
  description: string;
  submitTxt: string;
}
