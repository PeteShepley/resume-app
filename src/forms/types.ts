export interface EntityFormProps<TValues> {
  defaultValues?: Partial<TValues>
  onSubmit: (values: TValues) => void | Promise<void>
  onCancel: () => void
  submitting: boolean
}
