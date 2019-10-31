// var adder = function (x) {
//     var base = x;
//     console.log(base, '这是内层的base')
//     return function (n) {
//     console.log(base, '这是内层的内层的base')        
//       return n + base;
//     };
//   };
  
// //   var add10 = adder(10);
// //   console.log(add10(5));
  
// //   var add20 = adder(20);
// //   console.log(add20(5)
// const app = () => {
//     let base = 0;
//     let adder10 = adder(10);
//     console.log(adder10(2))
//     console.log(base, '这是外层的base')
// }
// app()

// var adder = function (x) {
//     var base = x;
//     return function (n) {
//       return n + base;
//     };
//   };
  
//   var add10 = adder(10);
//   console.log(add10(5));
  
//   var add20 = adder(20);
//   console.log(add20(5));

// for (var i = 0; i < 5; i++) {
//     setTimeout(function () {
//       console.log(i, '里层');
//     }, 5000*i);
//     console.log(i, '外层')
//   }

// var myObject = {value: 100};
// myObject.getValue = function () {
//   var foo = function () {
//     console.log(this.value) // => undefined
//     // console.log(this);// 输出全局对象 global
//   };

//   foo();

//   return this.value;
// };

// console.log(myObject.getValue()); // => 100



function Dog(){
    this.name = "dog";
    this.showName=function(){
        console.log("这是一条"+this.name+"!")
    }
}
function Cat(){
    this.name="cat";
    // Dog.apply(this)
    this.showName=function(){
        console.log(this.name+" eat fish");
    }
    Dog.apply(this)
};
var cat = new Cat()
// Dog.call(cat)    /*call的用法*/
cat.showName()        /*这是一条dog*/
console.log(cat.name)    /*dog*/