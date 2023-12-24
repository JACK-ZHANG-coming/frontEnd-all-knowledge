import moment from 'moment'
export default class Jrjobject {
  public key: string = ''
  public type: string = ''
  public id: number = 0
  public mogokey: string = ''
  public properties: any
  public hasChild: boolean = false

  constructor(jsonObj?: Partial<Jrjobject>) {
    this.id = 0
    this.type = ''
    this.properties = {}
    if (jsonObj != null) {
      this.type = jsonObj.type || ''
      this.id = jsonObj.id || 0
      this.properties = jsonObj.properties
      this.hasChild = jsonObj.hasChild || false
    }
  }

  public GetDeletePropObj(): Jrjobject {
    let obj = new Jrjobject()
    obj.type = this.type
    obj.id = this.id
    return obj
  }

  public toShortObj(): Jrjobject {
    let shortObj = new Jrjobject()
    shortObj.id = this.id
    shortObj.type = this.type
    return shortObj
  }

  public spCopy(obj: Jrjobject) {
    this.type = obj.type
    this.id = obj.id
    this.key = obj.key
    this.properties = JSON.parse(JSON.stringify(obj.properties))
    this.hasChild = obj.hasChild
    return this
  }

  public copy(obj: Jrjobject) {
    this.type = obj.type
    this.id = obj.id
    this.key = obj.key
    this.properties = obj.properties
    this.hasChild = obj.hasChild
    return this
  }

  public hasProp(prop: string) {
    return Object.prototype.hasOwnProperty.call(this.properties, prop)
  }

  public copyProp(obj: Jrjobject) {
    this.properties = obj.properties
  }

  public appendProp(obj: Jrjobject) {
    for (let key in obj.properties) {
      if (this.properties[key.toLocaleLowerCase()] == null) {
        this.SetValue(key, obj.properties[key])
      } else {
      }
    }
  }

  public overRideProp(obj: Jrjobject) {
    for (let key in obj.properties) {
      this.SetValue(key, obj.properties[key])
    }
  }

  public addPropSuffix(obj: Jrjobject, suffix: string) {
    for (let key in obj.properties) {
      this.SetValue(key + suffix, obj.properties[key])
    }
  }

  public SetValue(key: string, value: string | number | undefined) {
    this.properties[key.toLocaleLowerCase()] = value
  }

  public SetObjValue(key: string, obj: Jrjobject) {
    this.properties[key.toLocaleLowerCase()] = obj
  }

  public SetBool(key: string, value: boolean) {
    if (value) {
      this.properties[key.toLocaleLowerCase()] = '1'
    } else {
      this.properties[key.toLocaleLowerCase()] = '0'
    }
  }

  public SetNumber(key: string, value: number) {
    this.SetValue(key, value.toString())
  }

  public GetPropVal(key: string): string {
    if (key.length == 0) {
      return ''
    }
    if (this.properties[key] != null) {
      return this.properties[key]
    }
    if (this.properties[key.toLocaleLowerCase()] != null) {
      return this.properties[key.toLocaleLowerCase()]
    }
    if (this.properties[key.toLocaleUpperCase()] != null) {
      return this.properties[key.toLocaleUpperCase()]
    }
    return ''
  }

  public GetMomentTime(key: string) {
    if (key.length == 0) {
      return moment(new Date())
    }
    if (this.properties[key] != null && this.properties[key].length != 0) {
      return moment(this.properties[key])
    }
    if (
      this.properties[key.toLocaleLowerCase()] != null &&
      this.properties[key.toLocaleLowerCase()].length != 0
    ) {
      return moment(this.properties[key.toLocaleLowerCase()])
    }
    if (
      this.properties[key.toLocaleUpperCase()] != null &&
      this.properties[key.toLocaleUpperCase()].length != 0
    ) {
      return moment(this.properties[key.toLocaleUpperCase()])
    }
    return moment(new Date())
  }

  public GetPropTime(key: string, format?: string): string {
    if (key.length == 0) {
      return ''
    }
    if (this.properties[key] != null && this.properties[key].length != 0) {
      return format
        ? moment(this.properties[key]).format(format)
        : moment(this.properties[key]).format('YYYY-MM-DD')
    }
    if (
      this.properties[key.toLocaleLowerCase()] != null &&
      this.properties[key.toLocaleLowerCase()].length != 0
    ) {
      return format
        ? moment(this.properties[key.toLocaleLowerCase()]).format(format)
        : moment(this.properties[key.toLocaleLowerCase()]).format('YYYY-MM-DD')
    }
    if (
      this.properties[key.toLocaleUpperCase()] != null &&
      this.properties[key.toLocaleUpperCase()].length != 0
    ) {
      return format
        ? moment(this.properties[key.toLocaleUpperCase()]).format(format)
        : moment(this.properties[key]).format('YYYY-MM-DD')
    }
    return ''
  }

  public GetPropInt(key: string): number {
    let num = 0
    if (this.properties[key] != null) {
      num = parseInt(this.properties[key])
    }
    if (this.properties[key.toLocaleLowerCase()] != null) {
      num = parseInt(this.properties[key.toLocaleLowerCase()])
    }
    if (isNaN(num)) {
      num = 0
    }
    return num
  }

  public GetPropFloat(key: string): number {
    let num = 0
    if (this.properties[key] != null) {
      num = parseFloat(this.properties[key])
    }
    if (this.properties[key.toLocaleLowerCase()] != null) {
      num = parseFloat(this.properties[key.toLocaleLowerCase()])
    }
    if (isNaN(num)) {
      num = 0
    }
    return num
  }

  public GetPropFloatPrecise(key: string, precise: number): number {
    let num = 0
    let valStr = ''
    if (this.properties[key] != null) {
      valStr = this.properties[key]
      num = parseFloat(parseFloat(this.properties[key]).toFixed(precise))
    }
    if (this.properties[key.toLocaleLowerCase()] != null) {
      valStr = this.properties[key.toLocaleLowerCase()]

      num = parseFloat(parseFloat(this.properties[key.toLocaleLowerCase()]).toFixed(precise))
    }
    if (precise == null) {
      num = parseFloat(valStr)
    } else {
      num = parseFloat(parseFloat(valStr).toFixed(precise))
    }
    if (isNaN(num)) {
      num = 0
    }
    return num
  }

  public GetPropBool(key: string): boolean {
    let val = this.GetPropVal(key)
    if (val.toLocaleLowerCase() == '1'.toLocaleLowerCase()) {
      return true
    } else {
      return false
    }
  }

  // public SetwUlr(): string {
  //     let dl = new Filer();
  //     this.properties.url = dl.dlAddress + "?id=" + this.id.toString();
  //     return this.properties.url;
  // }
}
