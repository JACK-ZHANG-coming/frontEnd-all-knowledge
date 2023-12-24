export interface AsideType {
  /**菜单项的标题 */
  label: string
  /**菜单项的唯一标识 */
  index: string | number
  /**菜单项的小图标(可选) */
  icon?: string
  /**菜单项的子项(可选) */
  items?: AsideType[]
}
