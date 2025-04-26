# 🧪 Issues Found During Assignment Execution

This document highlights the issues encountered during testing.

## 1-typescript-app-unit-tests

### Method: export const addUser = (req: Request, res: Response) 

#### Main Problems

- **Missing data validation**

There is no input type validation e.g. if a request is made with age: `"30"` (as a string instead of a number), it will still be processed successfully. 
Even if the type is correct (e.g., name is a string or age is a number), the actual value can still be invalid -  an empty name or a negative age -1.

- **Unclear error messages**

If one or more required parameters (e.g., name or age) are missing from the request, the validation error message is "Name and age required" and doesn't specify which exact field is missing.

### Method: export const updateUser = (req: Request, res: Response)

#### Main Problems

- **Invalid request type**

This method works like PATCH but defined as PUT. It partially updates resource which corresponds to PATCH behaviour.

- **Missing data validation**

The same as **addUser**


### Important Notes

While developing the tests, some changes were made to the applications code

- added schema to validate input values.
- an array of errors is returned when multiple parameters are invalid.
- unified error response to always return an array of errors.
- changed **updateUser** type to PATCH

## 2-cypress-ui-tests

#### Issue 1
1. Add any TODO e.g. *Buy milk*
2. Clear the field of created TODO
3. Blur the input field

**Actual result:** The input remains empty after losing focus, even though empty fields are not allowed.

**Expected result:** If the edited input is left empty and loses focus, it should revert to its previous non-empty value i.e. *Buy milk*.

#### Issue 2
1.  Add any TODO e.g. *Buy milk*
2. Refresh the page

**Actual result:** All previously added TODOs removed.

**Expected result:** TODOs should persist after page refresh.