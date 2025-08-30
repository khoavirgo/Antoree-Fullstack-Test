// lib/toast.ts
import { toast } from "sonner";

export function showToast(
  msg: string,
  type: "success" | "error" = "success",
  duration = 1000
) {
  if (type === "success") {
    toast.success(msg, { duration });
  } else {
    toast.error(msg, { duration });
  }
}
