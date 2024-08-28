<!-- 数据定义编辑 -->
<template>
  <BaseContainer style="width: 100%; height: 100%">
    <div class="change_management_box">
      <div class="layout-sider">
        <div class="expand_collapse_box">
          <Button type="primary" @click="isCollapse = !isCollapse">
            <Icon v-if="!isCollapse" icon="ant-design:double-left-outlined" />
            <Icon v-else icon="ant-design:double-right-outlined" />
          </Button>
        </div>
        <Menu :mode="`inline`" :inline-collapsed="isCollapse">
          <Menu.Item
            v-for="item in defaultNodeList"
            :index="item.nodeType + 'id'"
            :key="item.nodeType"
            draggable="true"
            @dragstart="dragStart($event, item.nodeType)"
            :value="item.nodeType"
            style="cursor: move"
          >
            <div style="display: inline-block; width: 100px">{{ item.label }}</div>
            <template #icon>
              <Icon :icon="item.icon" />
            </template>
            <template #title>{{ item.label }}</template>
          </Menu.Item>
        </Menu>
      </div>
      <div class="layout-content">
        <div class="main-content">
          <div class="header">
            <Space>
              <Button type="primary" @click="areUpdateSaveGraph()">保存</Button>
              <Tag v-if="currentTipText && currentTipText === tipTextDic.VERIFY_ERROR" color="red">
                {{ currentTipText }}
              </Tag>
              <Tag v-else-if="currentTipText" color="cyan">{{ currentTipText }}</Tag>
              <Tag v-if="graphOldContent.updateTime" color="cyan">{{
                `上次更新时间:${graphOldContent.updateTime}`
              }}</Tag>
            </Space>
            <div class="graph-title">当前画布：{{ graphOldContent.canvasName }}</div>
          </div>
          <div class="main">
            <div ref="containerBox"></div>
            <TeleportContainer />
          </div>
        </div>
        <EditBoard
          ref="editBoardRef"
          v-model="currentCellData"
          @are-update-save-graph="areUpdateSaveGraph"
        />
      </div>
    </div>
  </BaseContainer>
</template>
<script lang="tsx" setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import BaseContainer from '@/components/BaseContainer.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { Layout, Button, SubMenu, Menu, Space, Tag } from 'ant-design-vue';
  import { Graph, Shape } from '@antv/x6';
  import { Dnd } from '@antv/x6-plugin-dnd';
  import { Snapline } from '@antv/x6-plugin-snapline';
  import { register, getTeleport } from '@antv/x6-vue-shape';
  import { Selection } from '@antv/x6-plugin-selection';
  import { Keyboard } from '@antv/x6-plugin-keyboard';
  import { Clipboard } from '@antv/x6-plugin-clipboard';
  import { History } from '@antv/x6-plugin-history';
  import { cloneDeep, reject } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import EditBoard from './EditBoard.vue';
  import CustomNode from './CustomNode.vue';
  import {
    CreateOneDataDefine,
    ModifyOneDataDefine,
    DeleteOneDataDefine,
    GetOneCanvas,
    ComposeTwoDataDefine,
    DisComposeTwoDataDefine,
    ModifyIdField,
  } from '@/api/dataDefinition/dataDefinitionEditingConsole';
  import { UpdateOneCanvas } from '@/api/dataDefinition/dataDefinitionEditing';

  defineOptions({ name: 'DataDefinitionEditing' }); // 路由页面缓存
  const route = useRoute();

  const tipTextDic = {
    '0': '',
    SAVE_SUCCESS: '保存画布成功',
    AUTO_SAVE_SUCCESS: '自动保存画布成功',
    AUTO_SAVE_LOADING: '自动保存画布中...',
    AUTO_SAVE_ERROR: '自动保存画布失败，可手动保存画布',
    VERIFY_SUCCESS: '校验成功，画布已自动保存',
    VERIFY_LOADING: '操作校验中...',
    VERIFY_ERROR: '操作校验失败，请重试',
  };

  // 节点字典
  const NodeTypeObj = {
    Root: {
      key: '0',
      type: '0',
      name: '根节点',
      typeKey: 'Root',
      icon: 'gravity-ui:nodes-down',
    },
    RootArray: {
      key: '1',
      type: '1',
      name: 'Arr根节点',
      typeKey: 'RootArray',
      icon: 'material-symbols:data-array',
    },
    IntData: {
      key: '2',
      type: '2',
      name: 'Int节点',
      typeKey: 'IntData',
      icon: 'carbon:double-integer',
    },
    FloatData: {
      key: '3',
      type: '3',
      name: 'Float节点',
      typeKey: 'FloatData',
      icon: 'carbon:floating-ip',
    },
    BoolData: {
      key: '4',
      type: '4',
      name: 'Bool节点',
      typeKey: 'BoolData',
      icon: 'oui:token-boolean',
    },
    ByteData: {
      key: '5',
      type: '5',
      name: 'Byte节点',
      typeKey: 'ByteData',
      icon: 'token:gbyte',
    },
    StringData: {
      key: '6',
      type: '6',
      name: 'Str节点',
      typeKey: 'StringData',
      icon: 'ant-design:field-string-outlined',
    },
    TimeStampSData: {
      key: '7',
      type: '7',
      name: 'Stp节点',
      typeKey: 'TimeStampSData',
      icon: 'token:stpt',
    },
    TimeStampMsData: {
      key: '8',
      type: '8',
      name: 'Mstp节点',
      typeKey: 'TimeStampMsData',
      icon: 'arcticons:mytelkomsel',
    },
    // InnerData:'9',
    // RangeData:'10',
    // NullData:'11',
  };

  const graphOldContent = ref<any>({}); // 原始画布数据
  const graphLastContent = ref<any>({}); // 上一次保存的画布数据
  const currentTipText = ref<string>('');
  const loading = ref(false);
  const { createMessage } = useMessage();
  const graphMode = ref<string>('normal');
  const editBoardRef = ref<any>();

  // #region 侧边栏模块
  const isCollapse = ref(false);
  const defaultNodeList = ref<any[]>([
    // 普通根节点
    {
      nodeType: NodeTypeObj['Root'].key,
      label: NodeTypeObj['Root'].name,
      icon: NodeTypeObj['Root'].icon,
    },
    // 数组型根节点
    {
      nodeType: NodeTypeObj['RootArray'].key,
      label: NodeTypeObj['RootArray'].name,
      icon: NodeTypeObj['RootArray'].icon,
    },
    // 整型节点
    {
      nodeType: NodeTypeObj['IntData'].key,
      label: NodeTypeObj['IntData'].name,
      icon: NodeTypeObj['IntData'].icon,
    },
    // 浮点型节点
    {
      nodeType: NodeTypeObj['FloatData'].key,
      label: NodeTypeObj['FloatData'].name,
      icon: NodeTypeObj['FloatData'].icon,
    },
    // 布尔型节点
    {
      nodeType: NodeTypeObj['BoolData'].key,
      label: NodeTypeObj['BoolData'].name,
      icon: NodeTypeObj['BoolData'].icon,
    },
    // 字节型节点
    {
      nodeType: NodeTypeObj['ByteData'].key,
      label: NodeTypeObj['ByteData'].name,
      icon: NodeTypeObj['ByteData'].icon,
    },
    // 字符串型节点
    {
      nodeType: NodeTypeObj['StringData'].key,
      label: NodeTypeObj['StringData'].name,
      icon: NodeTypeObj['StringData'].icon,
    },
    // 秒级时间戳节点
    {
      nodeType: NodeTypeObj['TimeStampSData'].key,
      label: NodeTypeObj['TimeStampSData'].name,
      icon: NodeTypeObj['TimeStampSData'].icon,
    },
    // 毫秒级时间戳节点
    {
      nodeType: NodeTypeObj['TimeStampMsData'].key,
      label: NodeTypeObj['TimeStampMsData'].name,
      icon: NodeTypeObj['TimeStampMsData'].icon,
    },
  ]);
  const dragStart = (event: any, nodeType: string) => {
    // console.log('event.target.value', event.target.value);
    // console.log('nodeType', nodeType);
    let data: any = {
      nodeType: '-1',
      eventList: [],
      dataName: '', // 节点名称
      typeSub: '', // 次级类型
      description: '', // 描述
      isIdField: false, // 唯一标识字段
      uuid: '', // 唯一uuid标识
      unitName: '', // 单位
    };
    let items = [
      // {
      //   group: 'right',
      // },
      {
        group: 'left',
      },
    ];
    switch (nodeType) {
      case NodeTypeObj['Root'].key:
        initNodeData(data, NodeTypeObj['Root']);
        items = [
          {
            group: 'right',
          },
          {
            group: 'left',
          },
        ];
        break;
      case NodeTypeObj['RootArray'].key:
        initNodeData(data, NodeTypeObj['RootArray']);
        items = [
          {
            group: 'right',
          },
          {
            group: 'left',
          },
        ];
        break;
      case NodeTypeObj['IntData'].key:
        initNodeData(data, NodeTypeObj['IntData']);
        break;
      case NodeTypeObj['FloatData'].key:
        initNodeData(data, NodeTypeObj['FloatData']);
        break;
      case NodeTypeObj['BoolData'].key:
        initNodeData(data, NodeTypeObj['BoolData']);
        break;
      case NodeTypeObj['ByteData'].key:
        initNodeData(data, NodeTypeObj['ByteData']);
        break;
      case NodeTypeObj['StringData'].key:
        initNodeData(data, NodeTypeObj['StringData']);
        break;
      case NodeTypeObj['TimeStampSData'].key:
        initNodeData(data, NodeTypeObj['TimeStampSData']);
        break;
      case NodeTypeObj['TimeStampMsData'].key:
        initNodeData(data, NodeTypeObj['TimeStampMsData']);
        break;
      default:
        break;
    }
    if (graphMode.value === 'normal') {
      // const node = graph.value.createNode({
      //   width: 100,
      //   height: 40,
      //   data: data,
      //   label: data.dataName,
      //   ports: {
      //     ...ports,
      //     items,
      //   },
      //   attrs: {
      //     body: {
      //       stroke: '#8f8f8f',
      //       strokeWidth: 1,
      //       fill: '#fff',
      //       rx: 6,
      //       ry: 6,
      //     },
      //   },
      // });
      // dnd.value.start(node, event);
      const node = graph.value.createNode({
        shape: 'custom-vue-node',
        x: 100,
        y: 60,
        data: data,
        ports: {
          ...ports,
          items,
        },
      });
      dnd.value.start(node, event);
    } else {
      createMessage.warning('根节点只可以放置一个');
    }
  };
  const initNodeData = (nodeData, NodeTypeObj) => {
    nodeData['nodeType'] = NodeTypeObj.type;
    nodeData['dataName'] = NodeTypeObj.name + `${graph.value.getNodes().length + 1}`;
    nodeData['typeKey'] = NodeTypeObj.typeKey;
  };
  // #endregion

  // #region 节点预设
  register({
    shape: 'custom-vue-node',
    width: 204 * 0.7,
    height: 116 * 0.68,
    component: CustomNode,
  });
  // 获取 Teleport 容器组件
  const TeleportContainer = getTeleport();
  // #endregion

  // #region 画布和节点数据
  const containerBox = ref();
  const graph = ref<any>();
  const dnd = ref<any>();
  onMounted(() => {
    graph.value = new Graph({
      container: containerBox.value,
      autoResize: true,
      background: {
        color: '#FCFCFC',
      },
      grid: {
        visible: true,
        type: 'fixedDot',
        args: [
          {
            size: 14,
            color: '#A2A2A2',
            thickness: 1,
          },
        ],
        // args: [
        //   {
        //     color: '#eee', // 主网格线颜色
        //     thickness: 1, // 主网格线宽度
        //   },
        //   {
        //     color: '#ddd', // 次网格线颜色
        //     thickness: 1, // 次网格线宽度
        //     factor: 5, // 主次网格线间隔
        //   },
        // ],
      },
      panning: {
        enabled: true,
        modifiers: 'Ctrl',
      },
      mousewheel: {
        enabled: true,
        modifiers: 'Ctrl',
        maxScale: 4,
        minScale: 0.2,
      },
      connecting: {
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        router: {
          name: 'er',
          args: {
            offset: 24,
            // direction: 'none',
          },
        },
        snap: {
          radius: 30,
        },
        connectionPoint: 'anchor',
        allowBlank: false,
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          });
        },
        validateMagnet({ magnet }) {
          if ((magnet.parentNode as any).classList.value.includes('left')) {
            return false;
          } else {
            return true;
          }
        },
        validateConnection(value: any) {
          let isConnection: boolean = true;
          if (value.sourcePort === value.targetPort) {
            isConnection = false;
          } else if (value.sourceCell === value.targetCell) {
            isConnection = false;
          } else if (
            !value.targetCell.getPort(value.targetPort) ||
            value.targetCell.getPort(value.targetPort).group === 'right'
          ) {
            isConnection = false;
          } else if (graphMode.value === 'fixed') {
            isConnection = false;
          }
          return isConnection;
        },
        validateEdge(value: any) {
          areUpdateSaveGraph('updateEdge', value.edge);
          return true;
        },
      },
    });
    graph.value.centerContent();
    graph.value
      .use(
        new Snapline({
          enabled: true,
          className: 'snapline_style',
          clean: false,
        }),
      )
      .use(new Keyboard())
      .use(new Clipboard())
      .use(new History());
    dnd.value = new Dnd({
      target: graph.value,
      getDragNode: (node) => {
        return node.clone({ keepId: true });
      },
      getDropNode: (node) => {
        return node.clone({ keepId: true });
      },
      validateNode: async (node) => {
        // console.log('验证节点信息:', node);
        try {
          areUpdateSaveGraph('createNode', node); // 这里是异步，先执行return true
          return true;
        } catch (err) {
          currentTipText.value = tipTextDic['VERIFY_ERROR'];
          return false;
        }
      },
    });
    // if (localStorage.getItem('test')) {
    //   graph.value.fromJSON(JSON.parse(localStorage.getItem('test') as string));
    // }
  });
  // #endregion

  // #region 选中节点/边
  const currentCellData = ref<any>({
    properties: {},
  });
  const currentCell = ref<any>({});
  onMounted(() => {
    graph.value.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      }),
    );
    // 选中节点
    graph.value.on('cell:mousedown', ({ cell }: any) => {
      if (graph.value.getSelectedCells().length <= 1) {
        graph.value.resetSelection(cell);
      }
    });
    // 节点选中发生改变时
    graph.value.on('selection:changed', () => {
      const currentCellList = graph.value.getSelectedCells();
      console.log('currentCellList===》', currentCellList);
      if (currentCellList.length < 2 && currentCellList.length > 0) {
        currentCell.value = currentCellList[0];
        console.log('currentCell.value.shape', currentCell.value.shape);
        // console.log('currentCellList[0].getData()', currentCellList[0].getData());
        // 连接节点
        if (currentCell.value.shape == 'edge') {
          currentCellData.value = {
            type: 'edge',
            properties: {
              eventName: currentCell.value?.getLabelAt(0)?.attrs?.label?.text || '自定义边',
            },
          };
        } else {
          currentCellData.value = currentCellList[0].getData();
        }
      } else if (currentCellList.length <= 2) {
        console.log('2===>', currentCellData.value);
        // currentCellData.value = {
        //   properties: {},
        // };
      }
    });
    // 选择边
    graph.value.on('edge:selected', ({ edge }: any) => {
      edge.addTools({
        name: 'boundary',
        args: {
          padding: 20,
          attrs: {
            stroke: '#1677f7',
            'stroke-width': 1,
            'fill-opacity': 0,
          },
        },
      });
    });
    graph.value.on('cell:unselected', ({ cell }: any) => {
      cell.removeTool('button-remove');
      cell.removeTool('boundary');
      cell.removeTool('button');
    });
    // graph.value.validateEdge((Graph, { edge, type, previous }) => {
    //   console.log('Graph', Graph);
    //   console.log('edge, type, previous', edge, type, previous);
    //   return true;
    // });
  });
  // 监听数据并赋值
  watch(
    currentCellData,
    () => {
      // console.log('currentCellData改变了-->', currentCellData.value);
      if (currentCellData.value.type === 'edge') {
        // 更新边的标签显示
        const label = currentCell.value.getLabelAt(0);
        currentCell.value.removeLabelAt(0);
        // label.attrs.label.text = currentCellData.value.properties.eventName; // properties?
        // currentCell.value.setLabelAt(0, label);
        // 更新目标节点数据
        if (currentCell.value.getTarget().cell) {
          // 这里有时会报错  -------
          const targetNode = graph.value.getCellById(currentCell.value.getTarget().cell);
          const targetNodeData = cloneDeep(targetNode.getData());
          let spliceIndex = -1;
          targetNodeData.eventList.forEach((item: any, index: number) => {
            if (item.sourceEdgeId === currentCell.value.id) {
              spliceIndex = index;
            }
          });
          const eventConfig = {
            sourceEdgeId: currentCell.value.id,
            eventName: currentCell.value?.getLabelAt(0)?.attrs?.label?.text || '自定义边',
          };
          if (spliceIndex === -1) {
            targetNodeData.eventList.push(eventConfig);
          } else {
            targetNodeData.eventList.splice(spliceIndex, 1, eventConfig);
          }
          targetNode.setData(targetNodeData);
        }
      } else if (currentCellData.value.nodeType) {
        currentCell.value.data = currentCellData.value;
        currentCell.value.setData(currentCellData.value);
      }
    },
    { deep: true },
  );
  // 校验是否为可操作节点类型
  const isUpdateNode = (nodeType) => {
    let flag = false;
    flag = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(nodeType);
    return flag;
  };

  // #endregion

  // #region 连接线配置
  // 节点连接桩配置
  const ports = {
    groups: {
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
  };
  onMounted(() => {
    graph.value.on('edge:mouseup', ({ edge }: any) => {
      console.log('鼠标抬起', edge);
      console.log('currentCell.value.getTarget().cell', currentCell.value.getTarget().cell);
      if (currentCell.value.getTarget().cell) {
        // 这里调用边的关联接口------
        // graph.value.removeEdge(edge);
        // return;
        const node = graph.value.getCellById(edge.getTarget().cell);
        const nodeData = cloneDeep(graph.value.getCellById(edge.getTarget().cell).getData());
        let spliceIndex = -1;
        nodeData.eventList.forEach((item: any, index: number) => {
          if (item.sourceEdgeId === edge.id) {
            spliceIndex = index;
          }
        });
        const eventConfig = {
          sourceEdgeId: edge.id,
          eventName: edge?.getLabelAt(0)?.attrs?.label?.text || '自定义边',
        };
        if (spliceIndex === -1) {
          nodeData.eventList.push(eventConfig);
        } else {
          nodeData.eventList.splice(spliceIndex, 1, eventConfig);
        }
        node.setData(nodeData);
      }
    });
  });
  // #endregion

  // #region 节点删除
  //删除边的方法
  const removeEdge = (edge: any) => {
    const node = graph.value.getCellById(edge.getTarget().cell);
    const nodeData = cloneDeep(graph.value.getCellById(edge.getTarget().cell).getData());
    let spliceIndex = -1;
    nodeData.eventList.forEach((item: any, index: number) => {
      if (item.sourceEdgeId === edge.id) {
        spliceIndex = index;
      }
    });
    nodeData.eventList.splice(spliceIndex, 1);
    edge.remove();
    node.setData(nodeData, { deep: false });
  };
  // 删除
  onMounted(() => {
    graph.value.on('cell:selected', ({ cell }: any) => {
      cellAddTools(cell);
    });
  });
  const cellAddTools = (cell: any) => {
    if (graphMode.value === 'normal') {
      cell.addTools({
        name: 'button',
        args: {
          x: 159,
          y: -12,
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 7,
                fill: 'rgb(255, 29, 0)',
                cursor: 'pointer',
              },
            },
            {
              tagName: 'text',
              textContent: '×',
              selector: 'icon',
              attrs: {
                fill: '#fff',
                fontSize: 15,
                fontWeight: 'bolder',
                textAnchor: 'middle',
                y: '0.3em',
                cursor: 'pointer',
              },
            },
          ],
          distance: '90%',
          onClick: ({ cell }: any) => {
            let edgeList: any[];
            if (cell.isEdge()) {
              // 删除边操作
              areUpdateSaveGraph('deleteEdge', cell);
              // edgeList = [cell];
              // edgeList.forEach((edge: any) => {
              //   removeEdge(edge);
              // });
            } else {
              // 删除节点操作
              // return
              console.log('点击了删除节点：', cell);
              console.log('----》', graph.value.getOutgoingEdges(cell));
              areUpdateSaveGraph('deleteNode', cell);
              // edgeList = graph.value.getOutgoingEdges(cell) || [];
              // edgeList.forEach((edge: any) => {
              //   removeEdge(edge);
              // });
              // cell.remove();
            }
          },
        },
      });
    }
  };
  // #endregion

  // #region 快捷键与事件
  onMounted(() => {
    // graph.value.bindKey('ctrl+c', () => {
    //   const cells = graph.value.getSelectedCells();
    //   if (cells.length) {
    //     graph.value.copy(cells);
    //   }
    //   return false;
    // });
    // graph.value.bindKey('ctrl+x', () => {
    //   const cells = graph.value.getSelectedCells();
    //   if (cells.length) {
    //     graph.value.cut(cells);
    //   }
    //   return false;
    // });
    // graph.value.bindKey('ctrl+v', () => {
    //   if (!graph.value.isClipboardEmpty()) {
    //     const cells = graph.value.paste({ offset: 32 });
    //     graph.value.cleanSelection();
    //     graph.value.select(cells);
    //   }
    //   return false;
    // });
    // graph.value.bindKey('ctrl+z', () => {
    //   if (graph.value.canUndo()) {
    //     graph.value.undo();
    //   }
    //   return false;
    // });
    graph.value.bindKey(['Backspace', 'delete'], () => {
      const cells = graph.value.getSelectedCells();
      // console.log('Backspace-->delete-->cells', cells);
      if (cells.length == 1 && cells[0].isEdge()) {
        // 此处调用删除边接口------
        // graph.value.removeCells(cells);
        areUpdateSaveGraph('deleteEdge', cells[0]);
      } else if (cells.length == 1) {
        // 此处调用删除节点接口-----
        // graph.value.removeCells(cells);
        areUpdateSaveGraph('deleteNode', cells[0]);
      }
    });
  });
  // #endregion

  // #region 事件处理

  //#endregion

  //#region 初始化
  onMounted(() => {
    console.log('初始化', route.query);
    GetCurrentGraph(true);
  });
  const GetCurrentGraph = async (isUpdateGraph: boolean = false) => {
    loading.value = true;
    try {
      graphOldContent.value = {};
      const res = await GetOneCanvas({}, `?uuid=${route.query.uuid}`);
      graphOldContent.value = res || {};
      loading.value = false;
      if (isUpdateGraph) {
        graphOldContent.value.canvasContent
          ? graph.value.fromJSON(JSON.parse(graphOldContent.value.canvasContent))
          : graph.value.fromJSON([]);
      }
    } catch (err: any) {
      // console.log('err', err);
      loading.value = false;
      graphOldContent.value = {};
      if (isUpdateGraph) {
        graph.value.fromJSON([]);
      }
    }
  };
  // 保存画布
  const areUpdateSaveGraph = (
    triggerType:
      | 'createNode'
      | 'updateNode'
      | 'updateEdge'
      | 'deleteNode'
      | 'deleteEdge'
      | 'updateIsIdField'
      | undefined = undefined,
    nodeData?: any,
    nodeUpdateParams?: any,
  ) => {
    graphLastContent.value = cloneDeep(graph.value.toJSON());
    // console.log('上一次content:', graphLastContent.value);
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // console.log('triggerType-->', triggerType);
        if (triggerType === 'updateEdge' || !triggerType) {
          let cells = graph.value.getSelectedCells();
          graph.value.unselect(cells);
        }
        const content = graph.value.toJSON(); // 获取当前最新画布内容
        currentTipText.value = tipTextDic['VERIFY_LOADING'];
        const canvasParams = {
          uuid: graphOldContent.value.uuid,
          canvasName: graphOldContent.value.canvasName,
          canvasDescription: graphOldContent.value.canvasDescription,
          canvasContent: JSON.stringify(content),
          options: ['canvasContent'],
        };
        console.log('nodeData-->', nodeData);
        UpdateOneCanvas(canvasParams)
          .then(async (res) => {
            // 保存成功后进行节点操作
            switch (triggerType) {
              case 'createNode':
                {
                  let params = {
                    dataName: nodeData.data.dataName,
                    type: nodeData.data.typeKey,
                    typeSub: nodeData.data.typeSub,
                    unitName: nodeData.data.unitName,
                    description: nodeData.data.description,
                    isIdField: nodeData.data.isIdField,
                  };
                  let res = await CreateOneDataDefine(params);
                  nodeData.data.uuid = res.uuid;
                  canvasParams.canvasContent = JSON.stringify(graph.value.toJSON());
                  await UpdateOneCanvas(canvasParams);
                  await GetCurrentGraph();
                }
                break;
              case 'updateNode':
                {
                  let params = {
                    ...nodeUpdateParams,
                  };
                  await ModifyOneDataDefine(params);
                  currentCellData.value['dataName'] = nodeUpdateParams['dataName'];
                  currentCellData.value['typeSub'] = nodeUpdateParams['typeSub'];
                  currentCellData.value['unitName'] = nodeUpdateParams['unitName'];
                  currentCellData.value['description'] = nodeUpdateParams['description'];
                  // console.log('currentCellData.value.nodeType-->', currentCellData.value.nodeType);
                  currentCell.value.data = currentCellData.value;
                  currentCell.value.setData(currentCellData.value);
                  // console.log('currentCell.value--->', currentCell.value);
                  let cells = graph.value.getSelectedCells();
                  graph.value.unselect(cells);
                  canvasParams.canvasContent = JSON.stringify(graph.value.toJSON());
                  await UpdateOneCanvas(canvasParams);
                  await GetCurrentGraph();
                  createMessage.success('修改成功');
                }
                break;
              case 'updateIsIdField':
                {
                  let params = {
                    ...nodeUpdateParams,
                  };
                  await ModifyIdField(params);
                  currentCellData.value['isIdField'] = nodeUpdateParams['isIdField'];
                  let cells: any = [];
                  currentCell.value.data = currentCellData.value;
                  currentCell.value.setData(currentCellData.value);
                  cells = graph.value.getSelectedCells();
                  cells[0].removeTools();
                  canvasParams.canvasContent = JSON.stringify(graph.value.toJSON());
                  await UpdateOneCanvas(canvasParams);
                  await GetCurrentGraph();
                  cellAddTools(cells[0]);
                  createMessage.success('修改成功');
                }
                break;
              case 'updateEdge':
                {
                  // 此处调用更新边接口------
                  let params = {
                    fatherUUID: graph.value.getCellById(nodeData.getSource().cell).data.uuid,
                    childUUID: graph.value.getCellById(nodeData.getTarget().cell).data.uuid,
                  };
                  await ComposeTwoDataDefine(params);
                }
                break;
              case 'deleteNode':
                {
                  // 此处调用删除节点接口-----
                  let urlParams = {
                    uuid: nodeData.data.uuid,
                  };
                  await DeleteOneDataDefine({}, urlParams);
                  nodeData.remove();
                  canvasParams.canvasContent = JSON.stringify(graph.value.toJSON());
                  await UpdateOneCanvas(canvasParams);
                  await GetCurrentGraph();
                }
                break;
              case 'deleteEdge':
                {
                  // 此处调用删除边接口------
                  let params = {
                    fatherUUID: graph.value.getCellById(nodeData.getSource().cell).data.uuid,
                    childUUID: graph.value.getCellById(nodeData.getTarget().cell).data.uuid,
                  };
                  await DisComposeTwoDataDefine(params);
                  removeEdge(nodeData);
                  canvasParams.canvasContent = JSON.stringify(graph.value.toJSON());
                  await UpdateOneCanvas(canvasParams);
                  await GetCurrentGraph();
                }
                break;
              default:
                createMessage.success('保存成功');
                currentTipText.value = tipTextDic['SAVE_SUCCESS'];
                resolve(res);
                return;
            }
            currentTipText.value = tipTextDic['VERIFY_SUCCESS'];
            resolve(res);
          })
          .catch(async (err) => {
            currentTipText.value = tipTextDic['VERIFY_ERROR'];
            let cells: any = [];
            // 回滚操作
            switch (triggerType) {
              case 'createNode':
                {
                  nodeData && graph.value.removeCells([nodeData]);
                }
                break;
              case 'updateNode':
                {
                  //
                }
                break;
              case 'updateIsIdField':
                {
                  console.log('currentCellData.value-->', currentCellData.value['isIdField']);
                  editBoardRef.value.changeFieldValue(!nodeUpdateParams['isIdField']);
                  cells = graph.value.getSelectedCells();
                  cells[0].removeTools();
                  canvasParams.canvasContent = JSON.stringify(graph.value.toJSON());
                }
                break;
              case 'updateEdge':
                {
                  nodeData && graph.value.removeCells([nodeData]);
                }
                break;
              case 'deleteNode':
                {
                  graph.value.canUndo() && graph.value.undo();
                }
                break;
              case 'deleteEdge':
                {
                  graph.value.canUndo() && graph.value.undo();
                }
                break;
              default:
                break;
            }
            graphLastContent.value = graph.value.toJSON(); // 回滚画布内容
            canvasParams.canvasContent = JSON.stringify(graphLastContent.value);
            await UpdateOneCanvas(canvasParams);
            GetCurrentGraph();
            if (triggerType === 'updateIsIdField') {
              cellAddTools(cells[0]);
            }
            reject(err);
          });
      }, 0);
    });
  };
  //#endregion
</script>
<style lang="less" scoped>
  .change_management_box {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 10px 0;
    background-color: #f5f5f5;

    // 左侧边栏
    .layout-sider {
      max-width: 300px;
      height: 100%;
      margin: 0 0 0 10px;
      background-color: rgb(255 255 255);

      .expand_collapse_box {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;

        button {
          width: 100%;

          i {
            font-size: 18px;
          }
        }
      }

      .toHide {
        :deep(.el-sub-menu__title) {
          height: 0;
          overflow: hidden;
          cursor: default;
        }
      }
    }

    // 右侧主体内容
    .layout-content {
      position: relative;
      flex: 1;
      width: 89%;
      height: 100%;
      padding: 0 10px;
      overflow: hidden;

      .main-content {
        width: 100%;
        height: 100%;
        background-color: rgb(255 255 255);

        .header {
          display: flex;
          position: relative;
          align-items: center;
          width: 100%;
          height: 60px;
          padding: 0 20px;

          .graph-title {
            position: absolute;
            left: 50%;
            width: 30%;
            transform: translateX(-50%);
            font-weight: bold;
            line-height: 60px;
            text-align: center;
          }
        }

        .main {
          width: auto;
          height: calc(100% - 92px);
          margin: 0 20px;
        }
      }
    }

    /* 定义过渡样式 */
    .slide-fade-enter-active {
      transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
      transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
      transform: translateX(20px);
      opacity: 0;
    }
  }
</style>
