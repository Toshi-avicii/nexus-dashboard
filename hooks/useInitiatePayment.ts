import { useMutation } from "@tanstack/react-query";
import { initiatePayment } from "../helpers/payments.helpers";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: initiatePayment,
  });
}
