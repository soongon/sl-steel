"use client";
import { useRef, type ComponentProps } from "react";
import { formatPhoneEdit } from "@/lib/phone";

/** Uncontrolled input: native form reset and FormData continue to work. */
export default function PhoneInput(
  props: Omit<ComponentProps<"input">, "onChange" | "value">,
) {
  const previous = useRef("");
  return (
    <input
      {...props}
      onChange={(event) => {
        const input = event.currentTarget;
        const edit = formatPhoneEdit(
          input.value,
          input.selectionStart ?? input.value.length,
          previous.current,
          (event.nativeEvent as InputEvent).inputType,
        );
        input.value = edit.value;
        previous.current = edit.value;
        input.setSelectionRange(edit.caret, edit.caret);
      }}
    />
  );
}
