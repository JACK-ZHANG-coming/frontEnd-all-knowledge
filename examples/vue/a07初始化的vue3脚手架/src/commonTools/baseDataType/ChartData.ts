import Jrjobject from './Jrjobject'

export class lstChartDataTwo {
  public lstData: ChartDataTwo[]
  public constructor(jsonData?: Partial<ChartDataTwo>[]) {
    this.lstData = []
    if (jsonData != null) {
      jsonData.forEach((Data) => {
        let cData = new ChartDataTwo(Data)
        this.lstData.push(cData)
      })
    }
  }
}

export class ChartDataTwo {
  public objTop: Jrjobject
  public lstSub: Jrjobject[]

  public constructor(jsonData?: Partial<ChartDataTwo>) {
    this.lstSub = []
    this.objTop = new Jrjobject()
    if (jsonData != null) {
      this.objTop.copy(new Jrjobject(jsonData.objTop))
      jsonData.lstSub?.forEach((obj) => {
        let objSub = new Jrjobject()
        objSub.copy(obj)
        this.lstSub.push(objSub)
      })
    }
  }
}

export class lstChartDataThree {
  public lstData: ChartDataThree[]
  public constructor(jsonData?: Partial<ChartDataThree>[]) {
    this.lstData = []
    if (jsonData != null) {
      jsonData.forEach((Data) => {
        let cData = new ChartDataThree(Data)
        this.lstData.push(cData)
      })
    }
  }
}

export class ChartDataThree {
  public objTop: Jrjobject
  public lstSub: ChartDataTwo[]

  public constructor(jsonData: Partial<ChartDataThree>) {
    this.lstSub = []
    this.objTop = new Jrjobject()
    this.objTop.copy(new Jrjobject(jsonData.objTop))
    jsonData.lstSub?.forEach((obj) => {
      let objSub = new ChartDataTwo(obj)
      this.lstSub.push(objSub)
    })
  }
}
