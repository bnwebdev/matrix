const Matrix = (function(){ // OPEN DEVELOP PLACE

class Matrix extends Array {
  constructor(i, j){
    super()
    this.resize(i, j)
  }
  modify(getterValueHandler){
    this.eachElements(function(value, i, j, matrix){
      matrix[i][j] = getterValueHandler(value, i, j, matrix)
    })
    return this
  }
  each(valueHandler){
    for(let i = 0; i < this.length; i++){
      for(let j = 0; j < this[0].length; j++){
        valueHandler(this[i][j], i, j, this)
      }
    }
  }
  resize(i, j){
    this.length = i
    for(let it = 0; it < i; i++){
      this[it] = new Array(j).fill(0)
    }
  }
  multValue(value){
    this.modify(function(prev){
      return prev * value
    })
  }
  size(){
    const i = this.length
    const j = this[0]? this[0].length: 0
    return [i, j]
  }
  multMatrix(matrix){
    const [i, j] = this.size()
    const [oi, oj] = matrix.size()
    if(j !== oi) {
      throw new Error(`MultError: Matrixs width (${j}) !== other matrixs height (${oi})`)
    }
    const resultMatrix = new Matrix(i, oj).modify(function(_, i, j){
      const row = this[i]
      let step = 0
      return row.reduce((total, current)=>total + current * matrix[step++][j], 0)
    })
    return resultMatrix
  }
  toString(){
    return this.map(arr=>`|${arr.join(',')}|`).join('\n')
  }
}

return Matrix

})() // CLOSE DEVELOP PLACE 
