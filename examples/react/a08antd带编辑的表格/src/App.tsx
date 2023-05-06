import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Table, Input, InputNumber, Popconfirm } from 'antd';



const data = [];
for (let i = 0; i < 12; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}


class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: '15%',
        editable: true,
        render: (text, record) => {
          return <InputNumber
            value={text}
            onChange={(e) => {
              this.save('age', e, record, record.key)
            }}></InputNumber>
        }
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '40%',
        editable: true,
      }
    ];
  }
  /**
   * 保存表格数据
   * @param editKey 当前编辑的这一行英文索引名 dataIndex
   * @param text 当前编辑的内容值
   * @param record 当前行数据
   * @param key 当前编辑的这一行索引
   */
  save<T>(dataIndex: string, text: any, record: T, key?: string) {
    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key); // 这里后面根据dataIndex来查找
    console.log('dataIndex,text,record, key:', dataIndex, text, record, key)
    console.log('index:', index)
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        [`${dataIndex}`]: text,
      });
      console.log('newData===>', newData)
      this.setState({ data: newData });
    } else {
      newData.push(record);
      this.setState({ data: newData });
    }
  }


  render() {

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          // inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    });

    return (
      <Table
        bordered
        dataSource={this.state.data}
        columns={columns}
        rowClassName="editable-row"
      // pagination={false}
      />
    );
  }
}

export default EditableTable;