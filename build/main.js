"use strict";
class Vertex {
    id;
    name;
    edges; // id, edge
    indegree;
    outdegree;
    visited;
    constructor(id, name) {
        this.id = id;
        this.name = name || `узел #${id}`;
        this.edges = new Map();
        this.indegree = 0;
        this.outdegree = 0;
        this.visited = false;
    }
    updDegrees() {
        this.indegree = (h.edges.filter(x => x[0][1] == this.id.toString()).length);
        this.outdegree = (h.edges.filter(x => x[0][0] == this.id.toString()).length);
    }
    rename(newName) {
        let oldName = this.name;
        this.name = newName;
        console.log(`Edit: vertex "${oldName}" -> "${this.name}"`);
    }
}
class Edge {
    id;
    start;
    end;
    weight;
    constructor(start, end, weight) {
        this.start = h.vertices.get(start);
        this.end = h.vertices.get(end);
        this.weight = weight;
        this.id = `${start}${end}`;
    }
    reweigh(newW) {
        let oldW = this.weight;
        this.weight = newW;
        console.log(`Edit: edge "${oldW}" -> "${this.weight}"`);
    }
}
class Graph {
    #vertices = new Map(); // id,Vertex>
    #edges = new Map();
    #adjacentList = new Map(); // vertex id, edges ids
    getRootVert() {
        if (this.vertices.size > 0) {
            let [first] = this.vertices.values();
            return first;
        }
        throw new Error("Err: no vertices in graph");
    }
    get vertices() {
        return this.#vertices;
    }
    get edges() {
        return Array.from(this.#edges);
    }
    get adjacentList() {
        const list = {};
        this.#adjacentList.forEach((val, key) => {
            list[key] = Array.from(val);
        });
        return list;
    }
    addVert(id, name = "") {
        if (!this.vertExist(id)) {
            let vertex = new Vertex(id, name);
            this.vertices.set(id, vertex);
            this.#adjacentList.set(vertex.id, []);
        }
        else
            throw new Error(`Err: the vertex #${id} is already exist`);
    }
    editVert(id, newName) {
        if (this.vertExist(id)) {
            this.vertices.get(id).rename(newName);
        }
        else
            throw new Error(`Err: the vertex #${id} is not exist`);
    }
    delVert(id) {
        if (this.vertExist(id)) {
            Array.from(this.vertices.get(id).edges).forEach(([id, edge], number) => {
                this.#edges.delete(id);
            });
            this.#adjacentList.delete(id);
            this.vertices.delete(id);
            console.log(`Del: vertex #${id}`);
        }
        else
            throw new Error(`Err: the vertex #${id} is not exist`);
    }
    editEdge(start, end, newW) {
        if (this.edgeExist(`${start}${end}`)) {
            this.#edges.get(`${start}${end}`).reweigh(newW);
        }
        else
            throw new Error(`Err: the edge ${start}->${end} is not exist`);
    }
    delEdge(start, end) {
        if (this.edgeExist(`${start}${end}`)) {
            if (this.vertExist(start))
                this.vertices.get(start).edges.delete(`${start}${end}`);
            let edgeArr = this.#adjacentList.get(start).filter(x => x !== end);
            this.#adjacentList.set(start, edgeArr);
            console.log(`Del: edge ${start}->${end}`);
        }
        else
            throw new Error(`Err: the edge ${start}->${end} is not exist`);
    }
    addEdge(start, end, weight) {
        if (!this.edgeExist(`${start}${end}`) && this.vertices.has(start) && this.vertices.has(end)) {
            let edge = new Edge(start, end, weight);
            this.#edges.set(edge.id, edge);
            this.vertices.get(start).edges.set(edge.id, edge);
            this.#adjacentList.get(start).push(end);
            this.vertices.get(start).updDegrees();
            this.vertices.get(end).updDegrees();
        }
        else
            throw new Error(`Err: the edge ${start}->${end} is already exist or no such vertices exist`);
    }
    printStringify() {
        let str = '';
        this.#adjacentList.forEach((val, key) => {
            str += `${key} => ${Array.from(val.sort()).join(', ') || '/'};\n`;
        });
        console.log(str);
    }
    vertExist(id) {
        return this.vertices.has(id);
    }
    edgeExist(id) {
        return this.#edges.has(id);
    }
    getFirst(id) {
        if (this.vertExist(id)) {
            if (this.vertices.get(id).edges.size > 0) {
                let [first] = this.vertices.get(id).edges.values();
                return (first.end.id);
            }
            return this.getRootVert().id;
        }
        else {
            throw new Error(`Err: the vertex #${id} is not exist`);
            return undefined;
        }
    }
    getNext(id, i) {
        if (this.vertExist(id)) {
            let edgeSize = this.vertices.get(id).edges.size;
            if (edgeSize > 0 && i < edgeSize) {
                return +Array.from(this.vertices.get(id).edges)[i][0][1];
            }
            return this.getRootVert().id;
        }
        else {
            throw new Error(`Err: the vertex #${id} is not exist`);
        }
    }
    getVertex(id) {
        if (this.vertExist(id)) {
            return this.vertices.get(id);
        }
        throw new Error(`Err: the vertex #${id} is not exist`);
    }
}
function getAllCycles(graph) {
    const { vertices, adjacentList } = graph;
    let res = [];
    let graphCycles = {};
    function recursiveVisit(currId, path) {
        if (path.includes(currId)) {
            path.push(currId);
            res.push(path);
            return;
        }
        if (Number.isInteger(currId))
            path.push(currId);
        if ((adjacentList.hasOwnProperty(currId) && adjacentList[currId].length != 0) && path[0] != currId) {
            for (const neighbor of adjacentList[currId]) {
                recursiveVisit(neighbor, [...path]);
            }
        }
        return path;
    }
    for (const [vertex, neighbors] of Object.entries(adjacentList)) {
        neighbors.forEach((nextId) => {
            recursiveVisit(Number(nextId), [Number(vertex)]);
            res.forEach((currentArr) => {
                if (currentArr[0] == currentArr.at(-1)) {
                    let arr = getFormat(currentArr);
                    if (isUniq(arr)) {
                        if (graphCycles.hasOwnProperty(arr.length)) {
                            graphCycles[arr.length].push(currentArr);
                        }
                        else {
                            graphCycles[arr.length] = [currentArr];
                        }
                    }
                }
            });
            res = [];
        });
    }
    function isUniq(arr) {
        if (!graphCycles.hasOwnProperty(arr.length))
            return true;
        let uniq = true;
        graphCycles[arr.length].forEach((currArr) => {
            if (getFormat(currArr).join() == arr.join())
                uniq = false;
        });
        return uniq;
    }
    function getFormat(arr) {
        return Array.from(new Set(arr)).sort();
    }
    return graphCycles;
}
function getLenCycle(graph, len) {
    return getAllCycles(graph)[len] || `циклов длины ${len} нет`;
}
const h = new Graph();
h.addVert(1);
h.addVert(2, "Example");
h.addVert(3);
h.addVert(4);
h.addVert(5);
h.addEdge(1, 2, 1);
h.addEdge(2, 3, 3);
h.addEdge(3, 4, 1);
h.addEdge(3, 5, 2);
h.addEdge(4, 2, 6);
h.addEdge(4, 1, 8);
h.printStringify();
console.log(getLenCycle(h, 3));
