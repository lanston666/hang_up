// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Hero from "../hero/Hero";
import {PoolManager} from "./PoolManager";
import Enemy from "../enemy/Enemy";
import random = cc.random;

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleMgr extends cc.Component {
    @property(Hero)
    public hero: Hero;

    @property(cc.Node)
    public battle: cc.Node;


    @property(cc.Prefab)
    enemyPreFab: cc.Prefab;


    public lev = 1;
    public liveEnemyNum = 4;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = 1;

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    start() {
        this.playGame();
    }

    playGame() {
        this.hero.initHero(this);
        this.buildEnemy(4);
    }

    buildEnemy(num: number) {
        this.liveEnemyNum = num;
        for (let i = 0; i < num; i++) {
            let enemyNode = PoolManager.instance().getNode(this.enemyPreFab, this.battle);
            let enemy = enemyNode.getComponent(Enemy);
            let width = enemy.collider.size.width
            let initX = (Math.random() * 10) > 5 ? (- i * width) : (640 + i * width)
            enemy.init(this, initX);
        }
    }

    public enemyDead(){
        this.liveEnemyNum -- ;
        if(this.liveEnemyNum === 0){
            this.lev++;
            this.buildEnemy(4);
            console.info(' nex lev : %s' , this.lev)

        }
    }

}
