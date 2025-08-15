import { useState, useCallback } from "react";
import type { FormState } from "../models";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Record<string, string>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    errors: {},
    touched: {},
  });

  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (formState.errors[name as string]) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [name as string]: "" },
        }));
      }
    },
    [formState.errors]
  );

  const handleBlur = useCallback((name: keyof T) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name as string]: true },
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return {};
    const errors = validate(values);
    setFormState((prev) => ({ ...prev, errors }));
    return errors;
  }, [validate, values]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormState((prev) => ({
          ...prev,
          touched: Object.keys(values).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          ),
        }));
        return;
      }

      try {
        setFormState((prev) => ({ ...prev, isSubmitting: true }));
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [validateForm, onSubmit, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setFormState({
      isSubmitting: false,
      errors: {},
      touched: {},
    });
  }, [initialValues]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field as string]: error },
    }));
  }, []);

  return {
    values,
    formState,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldError,
    setValues,
  };
}
