const Matrix = (function(){ // OPEN DEVELOP PLACE

class Matrix extends Array {
  constructor(){
    super()
  }
  modify(getterValueHandler){
    this.eachElements(getterValueHandler)
  }
  eachElements(valueHandler){
   for(let i = 0; i < this.length; i++){
      for(let j = 0; j < this[0].length; j++){
        this[i][j] = valueHandler(this[i][j], i, j, this)
      }
    }
  }
}

return Matrix

})() // CLOSE DEVELOP PLACE 
