// Types and Interfaces for LENDING
import { LoanData } from "store/actions/Loan";
import { PriviData } from "store/actions/PriviLending";

export type Order = "asc" | "desc";

export interface PriviHeadCell {
  disablePadding: boolean;
  id: keyof PriviData;
  label: string;
  numeric: boolean;
}

export interface LoanHeadCell {
  disablePadding: boolean;
  id: keyof LoanData;
  label: string;
  numeric: boolean;
}

export interface EnhancedPriviTableProps {
  classes: any; // ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof PriviData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export interface EnhancedLoanTableProps {
  classes: any; // ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof LoanData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
