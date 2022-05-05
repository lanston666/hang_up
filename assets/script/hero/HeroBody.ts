// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BoxCollider = cc.BoxCollider;
import Hero from "./Hero";
import Enemy from "../enemy/Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroBody extends cc.Component {


    hero : Hero = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hero = this.node.parent.getComponent(Hero);
    }

    start () {

    }

    onCollisionEnter(other: BoxCollider, self: BoxCollider) {
        if (other.node.group === 'enemy') {
            this.hero.attackHit(other.getComponent(Enemy));
        }
    }


}
