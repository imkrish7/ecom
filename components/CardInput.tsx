import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel } from "./ui/field";
import { Controller, useForm } from "react-hook-form";
import { cardDetailsSchema } from "@/schema/order.schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";

interface IProps {
  handlePayment: (payment: z.infer<typeof cardDetailsSchema>) => void;
}

export function CardDetail({ handlePayment }: IProps) {
  const form = useForm({
    resolver: zodResolver(cardDetailsSchema),
    defaultValues: {
      cardNumber: "",
      cardExpiration: "",
      cvv: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof cardDetailsSchema>) => {
    handlePayment(data);
  };

  return (
    <div className="flex gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex gap-2 flex-col"
        >
          <div className="flex flex-col gap-2">
            <div className="col-span-2 sm:col-span-1">
              <Controller
                name="cardNumber"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.error}>
                      <FieldLabel htmlFor="card-number-input">
                        Card number*
                      </FieldLabel>
                      <input
                        type="text"
                        id="card-number-input"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder="xxxx-xxxx-xxxx-xxxx"
                        pattern="^4[0-9]{12}(?:[0-9]{3})?$"
                        required
                        {...field}
                      />
                    </Field>
                  );
                }}
              />
            </div>
            <div className="flex gap-2">
              <div>
                <Controller
                  name="cardExpiration"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.error}>
                        <FieldLabel htmlFor="card-expiration">
                          Card expiration*
                        </FieldLabel>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <input
                            datepicker-format="mm/yy"
                            id="card-expiration-input"
                            type="text"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            placeholder="12/23"
                            required
                            {...field}
                          />
                        </div>
                      </Field>
                    );
                  }}
                />
              </div>
              <div className="relative">
                <Controller
                  name="cvv"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.error}>
                        <FieldLabel htmlFor="cvv-input">CVV*</FieldLabel>
                        <input
                          type="number"
                          id="cvv-input"
                          aria-describedby="helper-text-explanation"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          placeholder="•••"
                          required
                          {...field}
                        />
                      </Field>
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <Button type="submit">Complete payment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
