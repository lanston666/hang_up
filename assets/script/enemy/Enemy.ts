// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BoxCollider = cc.BoxCollider;
import BattleMgr from "../manager/BattleMgr";
import {PoolManager} from "../manager/PoolManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    public anim: cc.Animation = null;
    public collider: BoxCollider = null;
    public live = false;

    private _battleMgr : BattleMgr = null;
    private _playingAnim = 'idle'

    private _hp = 100;
    private _speed = 0.5;
    private _atk = 5;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.node.getChildByName('body').getComponent(cc.Animation);
        this.collider = this.node.getComponent(BoxCollider);
    }

    protected onEnable() {
        this.collider.enabled = true;
        this.anim.on(cc.Animation.EventType.FINISHED, this._onAnimFinish, this)
    }

    protected onDisable() {
        this.anim.off(cc.Animation.EventType.FINISHED, this._onAnimFinish, this)
    }


    init(battleMgr : BattleMgr , initX : number ){
        this._battleMgr = battleMgr;
        this.live = true;
        this.node.x = initX;
    }

    start() {
    }

    protected update(dt: number) {
        if(this.live){
            let distInfo = this._getDistInfo();
            if (this._canAttack(distInfo)) {
               this._attack();
            } else {
                this._move(this._battleMgr.hero.node);
            }
        }
    }


    // onCollisionEnter(other: BoxCollider, self: BoxCollider) {
    //     if (other.node.group === 'heroAttack') {
    //         this.anim.play('hit');
    //     }
    // }

    public hit(hitNum:number){
        this._hp = this._hp - hitNum;
        if(this._hp <= 0 ){
            this.collider.enabled = false;
            this.live = false;
            this._battleMgr.enemyDead();
            this._playAnim('dead');
        }else{
            this._playAnim('hit');
        }
    }

    private _onAnimFinish(type: string, state: cc.AnimationState) {

        if (state.name  === 'dead') {
            //死亡...
            PoolManager.instance().putNode(this.node);
        }else if(state.name === 'hit'){
            this._playAnim('idle');
        }

    }
    private _attack(){
        //this._playAnim('attack');
    }
    private _canAttack(distInfo: { minDist: number, currDist: number }) {
        return (distInfo.minDist + 8) >= distInfo.currDist;
    }
    private _getDistInfo(): { minDist: number, currDist: number } {
        let minDist = this.collider.size.width + this._battleMgr.hero.collider.size.width;
        minDist = Math.round(minDist / 2);
        let currDist = Math.abs(this.node.x - this._battleMgr.hero.node.x);
        return {
            minDist,
            currDist
        }
    }


    private _move(heroNode : cc.Node){
        this._playAnim('run')
        let move = this._speed;
        if(this.node.x > heroNode.x){
            this.node.scaleX = -Math.abs(this.node.scaleX)
            move = -move
        }else{
            this.node.scaleX = Math.abs(this.node.scaleX)
        }
        this.node.x = this.node.x + move;
    }


    private _playAnim(anim: string) {
        if (this._playingAnim !== anim) {
            this.anim.play(anim);
            this._playingAnim = anim;
        }
    }

}
