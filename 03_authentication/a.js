const fruits = ['apple', 'banana', 'cherry', 'date'];

const context = {
  targetFruit: 'cherry'
};


function a(element){

    let isTargetFruit = (element)=> {

        return element === this.targetFruit;
    };
    return isTargetFruit(element)
}


const foundFruit = fruits.find(a, context);

console.log(foundFruit); // Output: undefined
