const assert = TestRunner.assert
const assertEqual = TestRunner.assertEqual
const assertNotEqual = TestRunner.assertNotEqual
const assertError = TestRunner.assertError

const tr = new TestRunner()

const m1 = new Matrix(1, 4).modify((_,i,j)=>j)
const m2 = new Matrix(4, 4).modify((_, i, j)=>i+j)
const str1 = '[[0,1,2,3]]'
const str2 = '[[0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,6]]'
const m1m2 = '[[14,20,26,32]]'

tr.register( // start register
    function ToString(){
        assertEqual(m1.toString(), str1)
        assertEqual(m2.toString(), str2)
    },
    function Copy(){
        const copy = m1.copy()
        assertEqual(copy.toString(), m1.toString())
        copy[0][0] = 8
        assertNotEqual(copy.toString(), m1.toString(), "Try change in copy matrix -> dont change in target")
    },
    function MultValue(){
        const m = m1.multValue(2)
        assertNotEqual(m.toString(), m1.toString())
        assertEqual(m.toString(), "[[0,2,4,6]]")
        assertEqual(m2.multValue(3).toString(), '[[0,3,6,9],[3,6,9,12],[6,9,12,15],[9,12,15,18]]')
        assertEqual(m2.multValue(3).multValue(1/3).toString(), m2.toString())
    },
    function modifyMultValue(){
        const m = m1.copy()
        const n = m.copy()
        assertEqual(m.modifyMultValue(2).toString(), '[[0,2,4,6]]')
        assertNotEqual(n.toString(), m.toString())
        assertEqual(n.toString(), m1.toString())
    },
    function MultMatrix(){
        const nm = m1.multMatrix(m2)
        assertEqual(nm.toString(), m1m2)
        const m2m1 = `MultError: Matrixs width (4) !== other matrixs height (1)`
        const f = ()=>{m2.multMatrix(m1)}
        assertError(f, m2m1)
        nm[0][0] = 50
        assertNotEqual(nm.toString(), m1m2)
    },
    function ModifyMultMatrix(){
        const mm = m1.copy()
        mm.modifyMultMatrix(m2)
        assertEqual(mm.toString(), m1m2)
        assertNotEqual(m1.toString(), mm.toString())
    },
    function Modify(){
        const m = new Matrix(2,3)
        m.modify((_,i,j)=>j)
        assertEqual(m.toString(), "[[0,1,2],[0,1,2]]")
    },
    function Each(){
        let str = ''
        m1.each((prop,i,j)=>{
            str=str+i+j
        })
        assertEqual(str, "00010203")
        let prev, next
        m1.each(prop=>{
            prev = prev + '' + prop
            prop = 5
            return 5
        })
        m1.each(prop=>{
            next = next + '' + prop
        })
        assertEqual(prev, next)
    },
    function IsMatrix(){
        const m = new Matrix(1,4).modify((_,i,j)=>j)
        assert(Matrix.isMatrix(m))
        assert(!Matrix.isMatrix(1))
        assert(!Matrix.isMatrix("1"))
        assert(!Matrix.isMatrix([1]))
        assert(!Matrix.isMatrix({a:1}))
        assert(Matrix.isMatrix(new (class M extends Matrix {})(1,1)))
    },
    function SizeResize(){
        const m = new Matrix(2,6)
        let [i,j] = m.size()
        assertEqual(i,2)
        assertEqual(j,6)
        m.resize(4,18)
        assertEqual(m.size()[0], 4)
        assertEqual(m.size()[1], 18)
        m.resize(0,0)
        assertEqual(m.size()[0], 0)
    },
    function AddValue(){
        assertEqual(
            m2.addValue(5).toString(), 
            JSON.stringify(JSON.parse('[[0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,6]]').map(arr=>arr.map(v=>v+5)))
        )
        assertEqual(
            m2.addValue(-5).toString(), 
            JSON.stringify(JSON.parse('[[0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,6]]').map(arr=>arr.map(v=>v-5)))
        )
    },
    function ModifyAddValue(){
        const m = m2.copy()
        m.modifyAddValue(5)
        assertEqual(
            m2.addValue(5).toString(), 
            m.toString()
        )
        m.modifyAddValue(-10)
        assertEqual(
            m2.addValue(-5).toString(), 
            m.toString()
        )
    },
    function SubValue(){
        assertEqual(
            m2.subValue(5).toString(), 
            JSON.stringify(JSON.parse(str2).map(arr=>arr.map(v=>v-5)))
        )
        assertEqual(
            m2.subValue(-5).toString(), 
            JSON.stringify(JSON.parse(str2).map(arr=>arr.map(v=>v+5)))
        )
    },
    function ModifySubValue(){
        const m = m2.copy()
        m.modifySubValue(5)
        assertEqual(
            m2.subValue(5).toString(), 
            m.toString()
        )
        m.modifySubValue(-10)
        assertEqual(
            m2.subValue(-5).toString(), 
            m.toString()
        )
    },
    function AddMatrix(){
        const m = new Matrix(1,4).modify((_,i,j)=>j+1)
        assertEqual(
            m1.addMatrix(m).toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v*2+1)))
        )
        assertError(()=>m1.addMatrix(m2), `MultError: Matrixs size (1x4) !== other matrixs size (4x4)`)
    },
    function ModifyAddMatrix(){
        const m = m1.copy()
        assertEqual(
            m.modifyAddMatrix(m1).toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v*2)))
        )
        assertEqual(
            m.toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v*2)))
        )
        assertEqual(
            m1.toString(),
            str1
        )
    },
    function Mult(){
        assertEqual(
            m1.mult(5).toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v*5)))
        )
        assertEqual(
            m1.mult(m2).toString(),
            m1m2
        )
    },
    function ModifyMult(){
        const m = m1.copy()
        assertEqual(
            m.modifyMult(5).toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v*5)))
        )
        assertEqual(
            m.toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v*5)))
        )
        m.modifyMult(1/5).modifyMult(m2)
        assertEqual(
            m.toString(),
            m1m2
        )
    },
    function Add(){
        assertEqual(
            m1.add(5).toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v+5)))
        )
        assertEqual(
            m2.add(-5).toString(),
            JSON.stringify(JSON.parse(str2).map(arr=>arr.map(v=>v-5)))
        )
        assertEqual(
            m1.add(m1).add(m1).toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v*3)))
        )
        assertError(()=>m1.add(m2), `MultError: Matrixs size (1x4) !== other matrixs size (4x4)`)
    },
    function ModifyAdd(){
        const m = m1.copy()
        m.modifyAdd(5)
        assertEqual(
            m.toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v+5)))
        )
        assertEqual(
            m.modifyAdd(-10).toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v-5)))
        )
        m.modifyAdd(5)
        assertEqual(
            m.modifyAdd(m.copy()).toString(),
            JSON.stringify(JSON.parse(str1).map(arr=>arr.map(v=>v*2)))
        )
        assertError(()=>m1.modifyAdd(m2), `MultError: Matrixs size (1x4) !== other matrixs size (4x4)`)
        assertEqual(m1.toString(), str1)
        assertEqual(m2.toString(), str2)
    },
    function Sub(){
        assertEqual(
            m1.sub(5).sub(m1).toString(),
            m1.add(-5).add(m1.mult(-1)).toString()
        )
        assertError(()=>m1.sub(m2), `MultError: Matrixs size (1x4) !== other matrixs size (4x4)`)
    },
    function ModifySub(){
        const m = m1.copy()
        const mc = m.modifySub(5).modifySub(m1)
        assertEqual(m, mc)
        assertEqual(
            m.toString(),
            m1.add(-5).add(m1.mult(-1)).toString()
        )
        assertError(()=>m.modifySub(m2), `MultError: Matrixs size (1x4) !== other matrixs size (4x4)`)
    },
    function Transpose(){
        const mt = m1.transpose()
        assertEqual(mt.toString(), "[[0],[1],[2],[3]]")
        assertEqual(m1.toString(), str1)
    },
    function ModifyTranspose(){
        const mt = m1.copy()
        mt.modifyTranspose()
        assertEqual(mt.toString(), "[[0],[1],[2],[3]]")
        assertEqual(mt.modifyTranspose().toString(), str1)
    },
    function From(){
      let arr = [[5, 2], [3, 1]]
      const m = Matrix.from(arr)
      assertEqual(JSON.stringify(arr), m.toString())
    }
) // end register
tr.run()
