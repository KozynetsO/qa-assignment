import { z } from "zod";

const ERROR_MESSAGES = {
    NAME: {
        REQUIRED: "Name is required",
        TYPE: "Name should be a string",
        EMPTY: "Name should not be empty"
    },
    AGE: {
        REQUIRED: "Age is required",
        TYPE: "Age should be a number",
        MIN: "Age should be a positive number"
  }
};

export const UserCreateSchema = z.object({
  name: z
    .string({
      required_error: ERROR_MESSAGES.NAME.REQUIRED,
      invalid_type_error: ERROR_MESSAGES.NAME.TYPE
    })
    .nonempty(ERROR_MESSAGES.NAME.EMPTY),
  age: z
    .number({
      required_error: ERROR_MESSAGES.AGE.REQUIRED,
      invalid_type_error: ERROR_MESSAGES.AGE.TYPE
    })
    .min(1, ERROR_MESSAGES.AGE.MIN)
});