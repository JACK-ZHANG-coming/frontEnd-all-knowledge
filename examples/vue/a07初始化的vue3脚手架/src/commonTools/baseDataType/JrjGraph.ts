import Jrjobject from './Jrjobject'

export default class JrjGraph {
  public roots: JrjGraphNode[]
  constructor(graph?: Partial<JrjGraph>) {
    this.roots = []
    if (graph != null) {
      graph.roots?.forEach((root) => {
        let rootNode = new JrjGraphNode()
        let rootObj = new Jrjobject()
        rootObj.copy(root.entity)
        rootNode.entity = rootObj
        if (root.bindImgFiles) {
          rootNode.bindImgFiles = root.bindImgFiles
        }
        this.RecAddNode(root, rootNode)
        this.roots.push(rootNode)
      })
    }
  }

  private RecAddNode(sNode: JrjGraphNode, dNode: JrjGraphNode): void {
    sNode.children.forEach((ssNode) => {
      let ddNode = new JrjGraphNode()
      let ddObj = new Jrjobject()
      ddObj.copy(ssNode.entity)
      ddNode.entity = ddObj
      dNode.children.push(ddNode)
      this.RecAddNode(ssNode, ddNode)
    })
  }
}

export class JrjGraphNode {
  public entity: Jrjobject
  public children: JrjGraphNode[]
  public bindImgFiles?: Jrjobject[]
  constructor() {
    this.entity = new Jrjobject()
    this.children = []
    this.bindImgFiles = []
  }

  public ContainsChild(id: number): boolean {
    if (this.entity.id == id) {
      return true
    } else {
      for (let child of this.children) {
        if (child.ContainsChild(id)) {
          return true
        }
      }
      return false
    }
  }
}

export class CascaderOption {
  public value: string;
  public label: string;
  public children: CascaderOption[];
  constructor(val: string) {
    this.value = val;
    this.label = val;
    this.children = [];
  }

  public Add(chi: CascaderOption) {
    if (this.children == null) {
      this.children = [];
    }
    this.children.push(chi);
  }
}
