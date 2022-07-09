class Matrix extends Array {
  constructor(i, j){
    super()
    this.resize(i, j)
  }
  static isMatrix(some){
    return typeof some === "object" && some instanceof Matrix
  }
  static from(array2d){
    const matrix = new Matrix(...Matrix.prototype.size.call(array2d)) 
    return matrix.modify(function(_, i, j){
      return array2d[i][j]
    })
  }
  size(){
    const i = this.length
    const j = this[0]? this[0].length: 0
    return [i, j]
  }
  resize(i, j){
    this.length = i
    for(let it = 0; it < i; it++){
      this[it] = new Array(j)
    }
    return this
  }
  each(valueHandler){
    let [isize, jsize] = this.size()
    for(let i = 0; i < isize; i++){
      for(let j = 0; j < jsize; j++){
        valueHandler(this[i][j], i, j, this)
      }
    }
    return this
  }
  modify(getterValueHandler){
    return this.each(function(value, i, j, matrix){
      matrix[i][j] = getterValueHandler(value, i, j, matrix)
    })
  }
  modifyMultValue(value){
    return this.modify(function(prev){
      return prev * value
    })
  }
  multValue(value){
    const resultMatrix = new Matrix(...this.size())
    this.each(function(prev, i, j){
      resultMatrix[i][j] = prev * value
    })
    return resultMatrix
  }
  modifyMultMatrix(matrix){
    const result = this.multMatrix(matrix)
    this.resize(...result.size())
    return this.modify(function(_, i, j){
      return result[i][j]
    })
  }
  multMatrix(matrix){
    const [i, j] = this.size()
    const [oi, oj] = matrix.size()
    if(j !== oi) {
      throw new Error(`MultError: Matrixs width (${j}) !== other matrixs height (${oi})`)
    }
    const self = this
    return new Matrix(i, oj).modify(function(_, i, j){
      const row = self[i]
      let step = 0
      return row.reduce((total, current)=>total + current * matrix[step++][j], 0)
    })
  }
  modifyAddValue(value){
    return this.modify(function(prev){
      return prev + value
    })
  }
  modifyAddMatrix(matrix){
    const [i, j] = this.size()
    const [oi, oj] = matrix.size()
    if(i !== oi || j !== oj){
      throw new Error(`MultError: Matrixs size (${i}x${j}) !== other matrixs size (${oi}x${oj})`)
    }
    return this.modify(function(prev, i, j){
      return prev + matrix[i][j]
    })
  }
  modifySubValue(value){
    return this.modifyAddValue(-value)
  }
  modifySubMatrix(matrix){
    const [i, j] = this.size()
    const [oi, oj] = matrix.size()
    if(i !== oi || j !== oj){
      throw new Error(`MultError: Matrixs size (${i}x${j}) !== other matrixs size (${oi}x${oj})`)
    }
    return this.modify(function(prev, i, j){
      return prev - matrix[i][j]
    })
  }
  addValue(value){
    const self = this
    return new Matrix(...this.size()).modify(function(_, i, j){
      return self[i][j] + value
    })
  }
  addMatrix(matrix){
    const [i, j] = this.size()
    const [oi, oj] = matrix.size()
    if(i !== oi || j !== oj){
      throw new Error(`MultError: Matrixs size (${i}x${j}) !== other matrixs size (${oi}x${oj})`)
    }
    const self = this
    return new Matrix(i, j).modify(function(_, i, j){
      return self[i][j] + matrix[i][j]
    })
  }
  subValue(value){
    return this.addValue(-value)
  }
  subMatrix(matrix){
    const [i, j] = this.size()
    const [oi, oj] = matrix.size()
    if(i !== oi || j !== oj){
      throw new Error(`MultError: Matrixs size (${i}x${j}) !== other matrixs size (${oi}x${oj})`)
    }
    const self = this
    return new Matrix(i, j).modify(function(_, i, j){
      return self[i][j] - matrix[i][j]
    })
  }
  mult(some){
    let result
    if(typeof some === "number"){
      result = this.multValue(some)
    } else if(Matrix.isMatrix(some)) {
      result = this.multMatrix(some)
    } else {
      throw new Error(`MultError: wrong type of some (${some})`)
    }
    return result
  }
  modifyMult(some){
    let result
    if(typeof some === "number"){
      result = this.modifyMultValue(some)
    } else if(Matrix.isMatrix(some)) {
      result = this.modifyMultMatrix(some)
    } else {
      throw new Error(`ModifyMultError: wrong type of some (${some})`)
    }
    return result
  }
  add(some){
    let result
    if(typeof some === "number"){
      result = this.addValue(some)
    } else if(Matrix.isMatrix(some)) {
      result = this.addMatrix(some)
    } else {
      throw new Error(`AddError: wrong type of some (${some})`)
    }
    return result
  }
  sub(some){
    let result
    if(typeof some === "number"){
      result = this.subValue(some)
    } else if(Matrix.isMatrix(some)) {
      result = this.subMatrix(some)
    } else {
      throw new Error(`SubError: wrong type of some (${some})`)
    }
    return result
  }
  modifyAdd(some){
    let result
    if(typeof some === "number"){
      result = this.modifyAddValue(some)
    } else if(Matrix.isMatrix(some)) {
      result = this.modifyAddMatrix(some)
    } else {
      throw new Error(`ModifyAddError: wrong type of some (${some})`)
    }
    return result
  }
  modifySub(some){
    let result
    if(typeof some === "number"){
      result = this.modifySubValue(some)
    } else if(Matrix.isMatrix(some)) {
      result = this.modifySubMatrix(some)
    } else {
      throw new Error(`ModifySubError: wrong type of some (${some})`)
    }
    return result
  }
  copy(){
    const [i, j] = this.size()
    const resultMatrix = new Matrix(i, j)
    this.each(function(prev, i, j){
      resultMatrix[i][j] = prev
    })
    return resultMatrix
  }
  transpose(){
    const [i, j] = this.size()
    const self = this
    return new Matrix(j, i).modify(function(_, i, j){
      return self[j][i]
    })
  }
  modifyTranspose(){
    const result = this.transpose()
    this.resize(...result.size())
    return this.modify(function(_, i, j){
      return result[i][j]
    })
  }
  toString(){
    return JSON.stringify(this)
  }
}

export default Matrix
