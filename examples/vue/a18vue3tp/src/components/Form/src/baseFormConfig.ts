import type { CSSProperties } from 'vue';
import type { ColEx } from './types/';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';
import type { ButtonProps as AntdButtonProps } from '@/components/Button';

type FieldMapToTime = [string, [string, string], (string | [string, string])?][];

interface ButtonProps extends AntdButtonProps {
  text?: string;
}

export const baseFormConfig: {
  name?: string;
  layout?: 'vertical' | 'inline' | 'horizontal';
  // Form value
  model?: Recordable;
  // The width of all items in the entire form
  labelWidth?: number | string;
  // alignment
  labelAlign?: 'left' | 'right';
  // Row configuration for the entire form
  rowProps?: RowProps;
  // Submit form on reset
  submitOnReset?: boolean;
  // Submit form on form changing
  submitOnChange?: boolean;
  // Col configuration for the entire form
  labelCol?: Partial<ColEx>;
  // Col configuration for the entire form
  wrapperCol?: Partial<ColEx>;

  // General row style
  baseRowStyle?: CSSProperties;

  // General col configuration
  baseColProps?: Partial<ColEx>;

  // Function values used to merge into dynamic control form items
  mergeDynamicData?: Recordable;
  // Compact mode for search forms
  compact?: boolean;
  // Blank line span
  emptySpan?: number | Partial<ColEx>;
  // Internal component size of the form
  size?: 'default' | 'small' | 'large';
  // Whether to disable
  disabled?: boolean;
  // Whether to readonly
  readonly?: boolean;
  // Time interval fields are mapped into multiple
  fieldMapToTime?: FieldMapToTime;
  // Placeholder is set automatically
  autoSetPlaceHolder?: boolean;
  // Auto submit on press enter on input
  autoSubmitOnEnter?: boolean;
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;
  // Whether to show collapse and expand buttons
  showAdvancedButton?: boolean;
  // Whether to focus on the first input box, only works when the first form item is input
  autoFocusFirstItem?: boolean;
  // Automatically collapse over the specified number of rows
  autoAdvancedLine?: number;
  // Always show lines
  alwaysShowLines?: number;
  // Whether to show the operation button
  showActionButtonGroup?: boolean;

  // Reset button configuration
  resetButtonOptions?: Partial<ButtonProps>;

  // Confirm button configuration
  submitButtonOptions?: Partial<ButtonProps>;

  // Operation column configuration
  actionColOptions?: Partial<ColEx>;

  // Show reset button
  showResetButton?: boolean;
  // Show confirmation button
  showSubmitButton?: boolean;

  resetFunc?: () => Promise<void>;
  submitFunc?: () => Promise<void>;
  transformDateFunc?: (date: any) => string;
  colon?: boolean;
} = {
  labelWidth: 90,
  labelAlign: 'left',
  compact: true,
  showAdvancedButton: true,
  baseRowStyle: {
    background: '#fff',
    marginBottom: '16px',
    padding: '12px 10px 6px',
    borderRadius: '2px',
  },
  baseColProps: {
    style: {
      padding: '0 30px',
    },
  },
};
