interface columnsType {
  /**列标题 */
  title?: string
  /**列宽 */
  width?: string | number
  /**列固定 */
  fixed?: 'left' | 'right'
  /**是否需要排序按钮(默认false) */
  sortable?: boolean
  /**是否显示(默认true) */
  visible?: boolean
  /**是否超出隐藏 */
  showOverflow?: boolean
  /**过滤规则 */
  filters?: {
    label: string | number
    value: string | number
  }[]
  /**多层过滤 */
  filterMultiple?: boolean
  /**标题提示信息 */
  titlePrefix?: {
    /**是否解析(默认false) */
    useHTML?: boolean
    /**信息内容 */
    message?: string
    /**信息内容 */
    content?: string
  }
  /**是否可编辑 */
  editRender?: {
    /**编辑框类型 */
    name: '$input' | '$select'
    /**name为$select时添加选项 */
    options?: {
      label: string
      value: string
    }[]
    props: {
      /**输入框类型(不写type默认string类型) */
      type?:
      | 'password'
      | 'number'
      | 'float'
      | 'integer'
      | 'week'
      | 'month'
      | 'year'
      | 'date'
      | 'datetime'
      /**是否可清空(默认false) */
      clearable?: boolean
      /**显示内容 */
      placeholder?: string
      /**type为number或float时添加，定义最大和最小值 */
      min?: number
      /**type为number或float时添加，定义最大和最小值 */
      max?: number
      /**type为float时添加，定义有几位小数 */
      digits?: number
    }
    /**输入值实时同步更新 默认false */
    immediate?: boolean
  }
  /**插槽部分 */
  slots?: {
    /**表头显示 */
    header?: ([key]?: any) => JSX.Element[]
    /**展示内(容需要在 p, span, h 等文字标签中) */
    default?: ([key]?: any) => JSX.Element[]
    /**过滤去部分 */
    filter?: ([key]?: any) => JSX.Element[]
    /**可编辑部分 */
    edit?: ([key]?: any) => JSX.Element[]
    /**表尾显示 */
    footer?: ([key]?: any) => JSX.Element[]
  }
  /**是否绑定表格样式 */
  isBindStyle?: boolean
  /**是否指定为树形节点 */
  treeNode?: boolean
}
interface checkboxConfigType {
  /**开启复选框范围选择功能（启用后通过鼠标在复选框的列内滑动选中或取消指定行） 默认为true */
  range?: boolean
  /**是否显示全选按钮（如果 checkStrictly=true 则默认为 false） 默认为true */
  showHeader?: boolean
  /**是否严格的遵循父子不互相关联的做法 默认为false */
  checkStrictly?: boolean
  /**是否允许勾选的方法，该方法，的返回值用来决定这一行的 checkbox 是否可以勾选 */
  checkMethod?: ({ row }: { row: any }) => boolean
}
interface requiredType extends columnsType {
  /**列类型 */
  type: 'seq' | 'radio' | 'checkbox' | string
  /**所绑定字段 */
  field?: string
  /**子列 */
  children?: requiredType[]
}
interface requiredField extends columnsType {
  /**列类型 */
  type?: 'seq' | 'radio' | 'checkbox' | string
  /**所绑定字段 */
  field: string
  /**子列 */
  children?: requiredField[]
}
export interface CompleteTableType {
  /**必填属性而且值必须唯一 */
  id: string
  /**设置表格高度(包含查询分页部分在内) */
  height?: string | number
  /**设置表格最大高度(包含查询分页部分在内) */
  maxHeight?: string | number
  /**表格文字对齐方式left,center,right(默认left ) */
  align?: 'left' | 'center' | 'right'
  /**是否显示表尾(默认false) */
  showFooter?: boolean
  /**树形结构配置项 */
  treeConfig?: {
    [prop: string]: any
  }
  /**列设置按钮配置 */
  customConfig?: {
    /**是否在localStorage中保存修改配置(默认true) */
    storage?: boolean
    /**添加不可操作的显示的列 */
    disableColumns?: string[]
  }
  /**行排序时是否重新请求数据(仅当启用数据代理是生效-触发query方法) */
  sortConfig?: {
    /**行排序时是否重新请求数据(默认true,仅当启用数据代理是生效-触发query方法) */
    remote: boolean
  }
  /**行筛选时是否重新请求数据(仅当启用数据代理是生效-触发query方法) */
  filterConfig?: {
    /**行筛选时是否重新请求数据(默认true,仅当启用数据代理是生效-触发query方法) */
    remote: boolean
  }
  /**配置表格分页(不需要时传入false) */
  pagerConfig?:
  | boolean
  | {
    /**默认页面大小 */
    pageSize: number
    /**页面大小选项 */
    pageSizes: number[]
    /**分页展示内容 */
    layouts?: string[]
  }
  /**配置查询栏 */
  formConfig?: {
    /**输入框标题宽度 */
    titleWidth?: string | number
    /**标题对齐方式left,center,right(默认right) */
    titleAlign?: 'left' | 'center' | 'right'
    /**各个查询条件框详细配置 */
    items: (
      | {
        /**输入框标题宽度 */
        titleWidth?: string | number
        /**绑定查询的数据字段 */
        field: string
        /**标题名称 */
        title?: string
        /**所占位置大小(总共24) */
        span?: number
        /**显示内容 */
        placeholder?: string
        /**查询框类型 */
        itemType: 'input' | 'select' | 'inputNumber' | 'datePicker'
        /**定义时间选择器类型(以Element Plus组件库为基础) */
        type?: string
        /**类型为select时传入 */
        options?: {
          /**选项展示数据 */
          label: string
          /**传入后台数据 */
          value: string | number | boolean | undefined
        }[]
        /**类型为inputNumber时传入可输入的最大和最小值 */
        min?: number
        /**类型为inputNumber时传入可输入的最大和最小值 */
        max?: number
        /**类型为inputNumber时传入输入数字的精度 */
        precision?: number
        /**类型为inputNumber时传入控制输入数字的步长 */
        step?: number
        /**按钮或输入框在其中的位置 */
        align?: 'left' | 'center' | 'right'
      }
      | {
        /**查询与重置按钮(只有 button 一个值) */
        itemType: 'button'
        /**按钮或输入框在其中的位置 */
        align?: 'left' | 'center' | 'right'
        /**所占位置大小(总共24) */
        span?: number
      }
      | {
        /**所占位置大小(总共24) */
        span: number
      }
      | {
        /**类型为selectInput时不是绑定的字段，是输入框唯一标识 */
        field: string
        /**查询框类型 */
        itemType: 'selectInput'
        /**类型为selectInput时定义input框绑定的字段 */
        selectValue: string
        /**类型为selectInput时定义选择框宽度 */
        selectWidth: number
        /**类型为selectInput时添加查询条件框按钮 */
        addButton?: boolean
        /**所占位置大小(总共24) */
        span: number
        options: {
          /**选项展示数据 */
          label: string
          /**传入后台数据 */
          value: string | number | boolean | undefined
        }[]
      }
    )[]
  }
  /**表格工具栏配置，默认都存在 */
  toolbarConfig?: {
    /**重新配置VXE自带的按钮, 新增(insert_actived), 预删除(mark_cancel),  删除(delete),  保存(save) */
    buttons?: {
      /**VXE自带按钮的所绑定方法 */
      code: 'insert_actived' | 'mark_cancel' | 'delete' | 'save'
      /**按钮显示文字 */
      name?: string
      /**按钮样式 */
      status: string
      /**按钮显示图标 */
      icon: string
    }[]
    /**显示新增按钮(默认true) */
    insert_actived?: boolean
    /**显示预删除/取消按钮(默认true) */
    mark_cancel?: boolean
    /**显示直接删除按钮(默认true) */
    delete?: boolean
    /**显示保存按钮(默认true) */
    save?: boolean
    /**显示还原排序按钮(默认true) */
    resetSort?: boolean
    /**显示表格样式按钮(默认true) */
    tableStyle?: boolean
    /**显示颜色设置按钮(默认true) */
    colorSet?: boolean
    /**显示刷新按钮(默认true) */
    refresh?: boolean
    /**显示导入按钮(默认false) */
    import?: boolean
    /**显示导出按钮(默认false) */
    export?: boolean
    /**显示打印按钮(默认false) */
    print?: boolean
    /**显示全屏按钮(默认true) */
    zoom?: boolean
    /**列设置按钮(默认true) */
    custom?: boolean
  }
  /**数据代理,当不传入时,则需传入data */
  proxyConfig?: {
    /**配置响应字段 */
    props: {
      /**配置响应结果列表字段 */
      result: string
      /**配置响应结果总页数字段 */
      total: string
    }
    /**数据代理,包括query, delete, save */
    ajax: {
      /**当初次加载, 查询, 页面跳转, sortConfig.remote为true过滤排序时触发, 需要有返回需要展示数据的数据 */
      query?: (
        page?: any,
        sorts?: any,
        filters?: any,
        formData?: any,
        isQuery?: boolean,
        currentOperation?: string
      ) => any
      /**绑定了按钮栏code属性为delete按钮, 这个按钮click时会被触发 */
      delete?: (params?: any) => any | undefined
      /**绑定了按钮栏code属性为save按钮, 这个按钮click时会被触发 */
      save?: (params?: any) => any | undefined
    }
  }
  /**当数据代理不传入时，需要传入data */
  data?: { [key: string]: any }[]
  /**配置表格列, 每一列都必须要配置type或field其中一个属性(包括没有绑定数据的列, 需要配置field属性) */
  columns: (requiredType | requiredField)[]
  /**复选框配置项 */
  checkboxConfig?: checkboxConfigType
  /**如果一列可编辑时配置, 配置其编辑规则 */
  editRules?: {
    /**需要设定规则列的field */
    [key: string]: [
      {
        /**是否必填 */
        required: boolean
        /**提示信息 */
        message: string
      }?,
      {
        /**最小长度 */
        min: number
        /**最大长度 */
        max: number
        /**提示信息 */
        message: string
      }?
    ]
  }
  /**配置编辑 */
  editConfig?: {
    /**编辑模式触发方式 */
    trigger: 'click' | 'manual'
  }
  /**配置表尾(默认没有表尾) */
  footerMethod?: (columns: any, data: any) => any[]
}
