class TestRunner {
    constructor(){
      this.successed = 0
      this.falsed = 0
      this.tests = []
      
    }
    registerOne(test){
        this.tests.push([test.name, test])
    }
    register(...tests){
        tests.forEach(this.registerOne.bind(this))
    }
    static assert(bool, msg = ''){
        if(!bool){
            throw new Error(`${msg}`)
        }
    }
    static assertEqual(value1, value2, msg = ''){
        TestRunner.assert(value1 === value2, `${value1} !== ${value2} ${msg? "("+msg+")":""}`)
    }
    static assertNotEqual(value1, value2, msg = ''){
        TestRunner.assert(value1 !== value2, `${value1} === ${value2} ${msg? "("+msg+")":""}`)
    }
    static assertError(fn, error){
        const msg = `ASSERT ERROR FALE: ERROR DIDN'T REGISTERED`
        try {
            fn()
            throw new Error(msg)
        } catch (e) {
            if(e.message === msg){
                throw e
            } else if(error && error !== e.message){
                throw e
            }
        }
    }
    run(){
        for(const [name, test] of this.tests){
            try {
                test()
                this.successed++
                console.log(`Test ${name}: OK`)
            } catch(e) {
                console.error(`Test ${name}: FALSE`, e)
                this.falsed++
            }
        }
        console.log(`TestRunner end run test: ${this.successed} tests TRUE, ${this.falsed} tests FALSE`)
    }
}
