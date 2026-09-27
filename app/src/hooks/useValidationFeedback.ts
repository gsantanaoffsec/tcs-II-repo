import { useState } from "react";
import { z } from "zod";
import { errorsFrom } from "../lib/validation";
export function useValidationFeedback() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusField, setFocusField] = useState("");
  const [focusRequest, setFocusRequest] = useState(0);
  const showErrors = (error: z.ZodError) => {
    setErrors(errorsFrom(error));
    setFocusField(String(error.issues[0]?.path[0] ?? ""));
    setFocusRequest((n) => n + 1);
  };
  return { errors, setErrors, focusField, focusRequest, showErrors };
}
