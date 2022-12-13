let adjacentList = {
    1 : [2,3],
    2: [4],
    3:[2,5],
    5:[2],
    4:[1]
}
function findCycle(cycleLen) {
    let res = []
    let graphCycles = {}
    function recursiveVisit(currId, path) {
        if (path.includes(currId)) {
            path.push(currId)
            res.push(path);
            return
        }
        if (Number.isInteger(currId)) path.push(currId)
        if ((adjacentList.hasOwnProperty(currId) && adjacentList[currId].length != 0) && path[0]!=currId) {
            for (const neighbor of adjacentList[currId]) {
                recursiveVisit(neighbor,[...path])
            }
        }
        return path
    }
    for (const [vertex, neighbors] of Object.entries(adjacentList)) {
        neighbors.forEach(nextId=>{
            recursiveVisit(Number(nextId), [Number(vertex)])
            res.forEach(currentArr => {
                if (currentArr[0]==currentArr.at(-1)) {
                    let arr = getFormat(currentArr)
                    if (isUniq(arr)) {
                        if (graphCycles.hasOwnProperty(arr.length))
                            graphCycles[arr.length].push(currentArr)
                        else
                            graphCycles[arr.length] = currentArr
                    }
                }
            })
            res=[]
        })
    }
    function isUniq(arr) {
        if (!graphCycles.hasOwnProperty(arr.length)) return true
        for (const [id, currArr] of Object.entries(graphCycles)) {
            if (getFormat(currArr).join() == arr.join()) return false
        }
    }
    function getFormat(arr){
        return Array.from(new Set(arr)).sort();
    }
    console.log(graphCycles);
}

// console.log(recursiveVisit(2,[1]))
// console.log(res)
findCycle(1)
