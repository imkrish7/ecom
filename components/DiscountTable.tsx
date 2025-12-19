import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Discount } from "@/types/admin";

interface IProps {
  discounts: Discount[];
}

export const DiscountTable = ({ discounts }: IProps) => {
  console.log(discounts);
  return (
    <Table>
      <TableCaption>A list discounts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Code</TableHead>
          <TableHead>Discount Percentage</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discounts &&
          discounts.map((discount: Discount) => (
            <TableRow key={discount.code}>
              <TableCell className="font-medium">{discount.code}</TableCell>
              <TableCell>{discount.discount}%</TableCell>
              <TableCell className="text-right">
                {discount.discountAmount}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
