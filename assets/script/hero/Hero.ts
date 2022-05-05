// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import Enemy from "../enemy/Enemy";
import BattleMgr from "../manager/BattleMgr";
import BoxCollider = cc.BoxCollider;

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    anim: cc.Animation = null;
    collider: BoxCollider = null;

    private _atk = 80;
    private _hp = 100;

    private _battleMgr: BattleMgr = null;
    private _attackEnemy: Enemy = null;
    private _playingAnim = 'idle'
    private _speed = 3;
    private _initFlag = false;
    private _attacking = false;
    private _attackStep = 1;
    private _attackMaxStep = 3;


    onLoad() {
        this.anim = this.node.getChildByName('body').getComponent(cc.Animation);
        this.node.getChildByName('body').on('collisionEnter',this._onAnimFinish,this);
        this.anim.on(cc.Animation.EventType.FINISHED, this._onAnimFinish, this)
        this.collider = this.node.getComponent(BoxCollider);
    }

    protected onDestroy() {
        this.anim.off(cc.Animation.EventType.FINISHED, this._onAnimFinish, this)
    }


    update(dt) {
        if (!this._initFlag  || this._attacking) {
            return;
        }
        if (!this._attackEnemy) {
            let enemy = this._findEnemy();
            this._attackEnemy = enemy;
        }


        if (this._attackEnemy) {

            if(!this._attackEnemy.live){
                this._attackEnemy = null;
                return ;
            }


            let distInfo = this.getDistInfo(this._attackEnemy);
            if (this._canAttack(distInfo)) {
                this._attack();
            } else {
                this._move(this._attackEnemy);
            }
        }



    }


    public initHero(battleMgr: BattleMgr) {
        this._initFlag = true;
        this._battleMgr = battleMgr;
    }

    public attackHit(enemy: Enemy){
        let hitNum = this._atk;
        enemy.hit(this._attackStep * hitNum);
    }

    public getDistInfo(enemy: Enemy): { minDist: number, currDist: number } {
        let minDist = this.collider.size.width + enemy.collider.size.width;
        minDist = Math.round(minDist / 2);
        let currDist = Math.abs(this.node.x - enemy.node.x);
        return {
            minDist,
            currDist
        }
    }

    private _onAnimFinish(type: string, state: cc.AnimationState) {

        if (state.name.indexOf('attack') != -1) {
            this._attacking = false;
            if (this._attackStep >= this._attackMaxStep) {
                this._attackStep = 1;
            } else {
                this._attackStep += 1;
            }
            this._playAnim('idle')
        }
    }

    _canAttack(distInfo: { minDist: number, currDist: number }) {
        return (distInfo.minDist + 8) >= distInfo.currDist;
    }

    _move(enemy: Enemy) {
        this._playAnim('run')
        let enemyX = enemy.node.x;
        let heroX = this.node.x;
        let move = this._speed;
        if (enemyX > heroX) {
            this.node.scaleX = Math.abs(this.node.scaleX)
        } else {
            this.node.scaleX = -Math.abs(this.node.scaleX);
            move = -move;
        }
        this.node.x = this.node.x + move;
    }

    _attack() {
        if (!this._attacking) {
            this._attacking = true;
            this._playAnim('attack' + this._attackStep)
        }
    }


    _playAnim(anim: string) {
        if (this._playingAnim !== anim) {
            this.anim.play(anim);
            this._playingAnim = anim;
        }
    }


    _findEnemy(): Enemy {
        let children = this.node.parent.children;
        let minDistEnemy = null;
        let minDist = null;
        for (let enemyNode of children) {
            if (enemyNode === this.node) {
                continue;
            }
            let enemy = enemyNode.getComponent(Enemy);
            if(enemy.live){
                let distInfo = this.getDistInfo(enemy);

                if (!minDistEnemy || minDist > distInfo.currDist) {
                    minDist = distInfo.currDist;
                    minDistEnemy = enemy;
                }
            }

        }
        return minDistEnemy;
    }


}
