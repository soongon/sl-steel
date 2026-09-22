/** Format a phone edit while preserving the cursor and separator deletion behavior. */
export function formatPhoneEdit(
  raw: string,
  caret: number,
  previous = "",
  inputType?: string,
) {
  const deleting =
    inputType?.startsWith("delete") ?? raw.length < previous.length;
  let digits = raw.replace(/\D/g, "");
  let digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, "").length;

  // Backspace over an automatic separator also removes the preceding digit.
  if (deleting && digits === previous.replace(/\D/g, "")) {
    const forward = inputType === "deleteContentForward";
    const index = forward ? digitsBeforeCaret : digitsBeforeCaret - 1;
    if (index >= 0) {
      digits = digits.slice(0, index) + digits.slice(index + 1);
      if (!forward) digitsBeforeCaret--;
    }
  }
  digits = digits.slice(0, 11);
  let formatted = digits.slice(0, 3);
  if (digits.length > 3 || (digits.length === 3 && !deleting)) formatted += "-";
  formatted += digits.slice(3, 7);
  if (digits.length > 7 || (digits.length === 7 && !deleting)) formatted += "-";
  formatted += digits.slice(7);
  let position = 0;
  let seen = 0;
  while (position < formatted.length && seen < digitsBeforeCaret) {
    if (/\d/.test(formatted[position])) seen++;
    position++;
  }
  if (!deleting && formatted[position] === "-") position++;
  return { value: formatted, caret: position };
}
