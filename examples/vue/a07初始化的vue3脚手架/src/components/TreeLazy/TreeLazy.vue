<script setup lang="tsx">
import type Node from 'element-plus/es/components/tree/src/model/node'
import SApi from '@/commonTools/baseApi/SApi'
import _ from 'lodash'
import { ref } from 'vue'

const props = defineProps(['urlParams', 'width', 'renderContent'])

const loading = ref<boolean>(true)
interface Tree {
  name: string
  leaf?: boolean
}

const setProps = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf'
}

const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    new SApi()
      .PostInfoData(props.urlParams[node.level].url, props.urlParams[node.level].params)
      .then((res: any) => {
        const data: any = []
        res.forEach((element: any) => {
          let name = ''
          props.urlParams[node.level].title.forEach((item: any) => {
            name += `${item.prefix ? item.prefix : ''}
            ${element.properties[item.content]}
            ${item.suffix ? item.suffix : ''}`
          })
          data.push({
            name: name,
            entity: element,
            key: `${element.type}-${element.id}`,
            leaf: node.level === props.urlParams.length - 1
          })
        })
        loading.value = false
        return resolve(data)
      })
  } else {
    const params = _.cloneDeep(props.urlParams[node.level].params)
    if (params.entity === 'getByNode') {
      params.entity = node.data.entity
    }
    new SApi().PostInfoData(props.urlParams[node.level].url, params).then((res: any) => {
      const data: any = []
      res.forEach((element: any) => {
        let name = ''
        props.urlParams[node.level].title.forEach((item: any) => {
          name += `${item.prefix ? item.prefix : ''}
          ${element.entity.properties[item.content]}
          ${item.suffix ? item.suffix : ''}`
        })
        data.push({
          name: name,
          entity: element.entity,
          key: `${element.entity.type}-${element.entity.id}`,
          leaf: node.level === props.urlParams.length - 1
        })
      })
      return resolve(data)
    })
  }
}

const emit = defineEmits(['currentNode'])
const currentNode = (value: any, node: any) => {
  emit('currentNode', value, node)
}

//导出树形控件方法
const treeMethod = ref<any>()
defineExpose({ treeMethod })
</script>
<template>
  <div class="tree_lazy_box" :style="{ width: props.width }">
    <el-tree
      ref="treeMethod"
      :props="setProps"
      :load="loadNode"
      node-key="key"
      lazy
      v-loading="loading"
      element-loading-text="加载中..."
      :render-content="props.renderContent"
      @node-click="currentNode"
    />
  </div>
</template>
<style lang="scss">
.tree_lazy_box {
  min-width: 308px;
  padding: 10px 20px 0 20px;
  .space_between {
    width: 95%;
  }
  .el-tree-node__content {
    box-sizing: content-box;
    padding: 7px 5px 7px 5px;
    .space_between {
      > div:nth-child(1) {
        width: 70%;
        > span {
          font-size: $font-size-small;
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
