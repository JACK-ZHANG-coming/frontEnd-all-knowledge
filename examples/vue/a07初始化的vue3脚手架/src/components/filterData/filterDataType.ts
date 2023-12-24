export interface filterDataType {
  /**表格唯一标识(必填) */
  id: string
  /**表格每列配置 */
  columns: {
    /**每列宽度 */
    width?: number
    /**每列绑定数据 */
    field: string
    /**每列标题 */
    title: string
    /**过滤规则 */
    filters?: {
      label: string | number
      value: string | number
    }[]
    slots?: {
      /**表头显示 */
      header?: ([key]?: any) => JSX.Element[]
      /**展示内(容需要在 p, span, h 等文字标签中) */
      default?: ([key]?: any) => JSX.Element[]
      /**过滤去部分 */
      filter?: ([key]?: any) => JSX.Element[]
      /**表尾显示 */
      footer?: ([key]?: any) => JSX.Element[]
    }
  }[]
  /**表格展示数据 */
  tableData: {}[]
  /**定义选中数据展示哪一个字段 */
  displayField: string
  /**是否为单选(默认多选) */
  isRadio?: boolean
  translation?: {
    /**需要转译的字段 */
    field: string
    /**转译的值及其转译后内容 */
    options: {
      value: string | number
      label: string | number
    }[]
  }[]
  /**定义默认选中(需要有id) */
  defaultSelected?: {}[]
}
