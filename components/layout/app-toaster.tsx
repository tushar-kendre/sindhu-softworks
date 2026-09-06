"use client"

import { Toaster, useToast } from "@once-ui-system/core"

export function AppToaster() {
  const { toasts, removeToast } = useToast()
  return <Toaster toasts={toasts} removeToast={removeToast} />
}
