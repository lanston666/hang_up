import NodePool = cc.NodePool
import Prefab = cc.Prefab
import Node = cc.Node
const { ccclass, property } = cc._decorator;



interface IDictPool {
    [name: string]: NodePool;
}

interface IDictPrefab {
    [name: string]: Prefab;
}

@ccclass('PoolManager')
export class PoolManager {

    public static instance(){
        if(!this._instance){
            this._instance = new PoolManager();
        }

        return this._instance;
    }

    private _dictPool: IDictPool = {};
    private _dictPrefab: IDictPrefab = {};
    private static _instance: PoolManager;


    public getNode(prefab: Prefab, parent: Node){
        let name = prefab.data.name;
        // console.log('get node   ' + name);
        let node: Node = null;
        this._dictPrefab[name] = prefab;
        const pool = this._dictPool[name];
        if (pool) {
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = cc.instantiate(prefab);
            }
        } else {
            this._dictPool[name] = new NodePool();
            node = cc.instantiate(prefab);
        }

        node.parent = parent;
        node.active = true;
        return node;
    }

    public putNode(node: Node){
        let name = node.name;
        // console.log('put node   ' + name);
        node.parent = null;
        if (!this._dictPool[name]) {
            this._dictPool[name] = new NodePool();
        }

        this._dictPool[name].put(node);
    }
}

