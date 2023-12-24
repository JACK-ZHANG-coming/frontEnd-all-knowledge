export interface DynamicFormType {
  /**输入框标题宽度 */
  labelWidth?: string
  /**新增按钮配置 */
  addButton: {
    text: string
    top?: string
    left?: string
    bottom?: string
    right?: string
    zIndex: number
  }
  /**输入框间距 */
  gutter?: number
  /**输入框宽度 */
  span?: number
  /**静态表单部分配置 */
  staticItemsList?: {
    /**输入框标题宽度 */
    labelWidth?: string
    /**输入框标题 */
    label: string
    /**输入框类型 */
    type: 'input' | 'inputNumber' | 'select' | 'datePicker' | 'radio' | 'switch' | 'checkbox'
    /**绑定字段 */
    VModel: string
    /**输入框提示 */
    placeholder?: string
    /**输入框宽度 */
    span?: number
    /**type类型为select时配置每一项 */
    options?: {
      label: string | number
      value: string | number
      /**是否禁用 */
      disabled?: boolean
    }[]
    /**type类型为radio时配置每一项 */
    radios?: {
      label: string | number
      value: string | number
      /**是否禁用 */
      disabled?: boolean
    }[]
    /**type类型为checkbox时配置每一项 */
    checkboxs?: {
      label: string | number
      value: string | number
      /**是否禁用 */
      disabled?: boolean
    }[]
    /**type类型为radio时是否多选 */
    multiple?: boolean
    /**输入框的进一步类型选择 */
    itemType?: 'textarea' | 'datetime' | 'daterange' | 'datetimerange'
    /**itemType类型为textarea时设置文本域初始最大最小高度 */
    minRows?: number
    maxRows?: number
    /**是否禁用 */
    disabled?: boolean
    /**itemType类型为daterange或者datetimerange是配置 */
    rangeSeparator?: string | number
    startPlaceholder?: string | number
    endPlaceholder?: string | number
    /**是否必填 */
    required?: boolean
    /**未填提示信息 */
    message?: string | number
  }[]
  /*动态表单部分配置 */
  dynamicItemsList: {
    /**输入框标题宽度 */
    labelWidth?: string
    /**输入框标题 */
    label: string
    /**输入框类型 */
    type: 'input' | 'inputNumber' | 'select' | 'datePicker' | 'radio' | 'switch' | 'checkbox'
    /**绑定字段 */
    VModel: string
    /**输入框提示 */
    placeholder?: string
    /**输入框宽度 */
    span?: number
    /**type类型为select时配置每一项 */
    options?: {
      label: string | number
      value: string | number
      /**是否禁用 */
      disabled?: boolean
    }[]
    /**type类型为radio时配置每一项 */
    radios?: {
      label: string | number
      value: string | number
      /**是否禁用 */
      disabled?: boolean
    }[]
    /**type类型为checkbox时配置每一项 */
    checkboxs?: {
      label: string | number
      value: string | number
      /**是否禁用 */
      disabled?: boolean
    }[]
    /**type类型为select时是否多选 */
    multiple?: boolean
    /**输入框的进一步类型选择 */
    itemType?: 'textarea' | 'datetime' | 'daterange' | 'datetimerange'
    /**itemType类型为textarea时设置文本域初始最大最小高度 */
    minRows?: number
    maxRows?: number
    /**是否禁用 */
    disabled?: boolean
    /**itemType类型为daterange或者datetimerange是配置 */
    rangeSeparator?: string | number
    startPlaceholder?: string | number
    endPlaceholder?: string | number
    /**是否必填 */
    required?: boolean
    /**未填提示信息 */
    message?: string | number
  }[]
}
