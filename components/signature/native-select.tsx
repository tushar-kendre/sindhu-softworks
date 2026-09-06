"use client"

import { Column, Text } from "@once-ui-system/core"
import s from "./native-select.module.scss"

type Option = { label: string; value: string }
type Props = {
  id: string
  label: string
  options: Option[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
}

/** A native select on Once UI tokens. Used instead of the library Select, which emits ARIA that fails audits. */
export function NativeSelect({ id, label, options, value, onChange, placeholder, error }: Props) {
  return (
    <Column gap="4" fillWidth>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <select id={id} className={s.select} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}>
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <Text as="p" id={`${id}-error`} variant="body-default-xs" onBackground="danger-medium">
          {error}
        </Text>
      ) : null}
    </Column>
  )
}
