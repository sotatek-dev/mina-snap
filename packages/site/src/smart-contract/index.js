/* eslint-disable */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method } from 'snarkyjs';
/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class Quiz extends SmartContract {
    constructor() {
        super(...arguments);
        this.num = State();
    }
    init() {
        super.init();
        this.num.set(Field(1));
    }
    update(answer) {
        const currentDayNumber = Field(new Date().getUTCDay());
        const currentState = this.num.get();
        this.num.assertEquals(currentState); // precondition that links this.num.get() to the actual on-chain state
        currentState.add(currentDayNumber).assertEquals(answer);
        this.num.set(answer);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Quiz.prototype, "num", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], Quiz.prototype, "update", null);
//# sourceMappingURL=Quiz.js.map