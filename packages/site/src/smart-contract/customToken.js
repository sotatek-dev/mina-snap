/* eslint-disable no-cond-assign */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AccountUpdate, Experimental, Field, Int64, Permissions, PublicKey, SmartContract, State, UInt64, method, state, Struct, } from 'o1js';
class Transfer extends Struct({
  from: PublicKey,
  to: PublicKey,
  amount: UInt64
}) {
  constructor(from, to, amount) {
      super({ from, to, amount });
  }
}
class Lock extends Struct({
  locker: PublicKey,
  receipt: Field,
  amount: UInt64
}) {
  constructor(locker, receipt, amount) {
      super({ locker, receipt, amount });
  }
}
export class Token extends SmartContract {
  constructor() {
      super(...arguments);
      this.decimals = State();
      this.maxSupply = State();
      this.circulatingSupply = State();
      this.owner = State();
      this.events = { "Transfer": Transfer, "Lock": Lock };
  }
  deploy(args) {
      super.deploy(args);
      this.account.permissions.set({
          ...Permissions.default(),
          access: Permissions.proofOrSignature(),
      });
      this.decimals.set(UInt64.from(18));
      this.maxSupply.set(UInt64.from(10000000000000000000));
      this.owner.set(this.sender);
      this.account.tokenSymbol.set('WETH');
  }
  mint(receiver, amount) {
      this.owner.getAndRequireEquals().assertEquals(this.sender);
      const maxSupply = this.maxSupply.getAndRequireEquals();
      const circulatingSupply = this.circulatingSupply.getAndRequireEquals();
      const newCirculatingSupply = circulatingSupply.add(amount);
      newCirculatingSupply.assertLessThanOrEqual(maxSupply);
      this.token.mint({
          address: receiver,
          amount,
      });
      this.circulatingSupply.set(newCirculatingSupply);
  }
  burn(burner, amount) {
      const circulatingSupply = this.circulatingSupply.getAndRequireEquals();
      const newCirculatingSupply = circulatingSupply.sub(amount);
      this.token.burn({
          address: burner,
          amount,
      });
      this.circulatingSupply.set(newCirculatingSupply);
  }
  transfer(sender, receiver, amount) {
      this.token.send({ from: sender, to: receiver, amount });
      this.emitEvent("Transfer", {
          from: sender,
          to: receiver,
          amount,
      });
  }
  lock(receipt, bridgeAddress, amount) {
      this.token.send({ from: this.sender, to: bridgeAddress, amount });
      this.emitEvent("Lock", {
          locker: this.sender,
          receipt,
          amount,
      });
  }
  approveCallbackAndTransfer(sender, receiver, amount, callback) {
      const tokenId = this.token.id;
      const senderAccountUpdate = this.approve(callback, AccountUpdate.Layout.AnyChildren);
      senderAccountUpdate.body.tokenId.assertEquals(tokenId);
      senderAccountUpdate.body.publicKey.assertEquals(sender);
      const negativeAmount = Int64.fromObject(senderAccountUpdate.body.balanceChange);
      negativeAmount.assertEquals(Int64.from(amount).neg());
      const receiverAccountUpdate = Experimental.createChildAccountUpdate(this.self, receiver, tokenId);
      receiverAccountUpdate.balance.addInPlace(amount);
  }
  approveUpdateAndTransfer(zkappUpdate, receiver, amount) {
      // TODO: THIS IS INSECURE. The proper version has a prover error (compile != prove) that must be fixed
      this.approve(zkappUpdate, AccountUpdate.Layout.AnyChildren);
      // THIS IS HOW IT SHOULD BE DONE:
      // // approve a layout of two grandchildren, both of which can't inherit the token permission
      // let { StaticChildren, AnyChildren } = AccountUpdate.Layout;
      // this.approve(zkappUpdate, StaticChildren(AnyChildren, AnyChildren));
      // zkappUpdate.body.mayUseToken.parentsOwnToken.assertTrue();
      // let [grandchild1, grandchild2] = zkappUpdate.children.accountUpdates;
      // grandchild1.body.mayUseToken.inheritFromParent.assertFalse();
      // grandchild2.body.mayUseToken.inheritFromParent.assertFalse();
      // see if balance change cancels the amount sent
      const balanceChange = Int64.fromObject(zkappUpdate.body.balanceChange);
      balanceChange.assertEquals(Int64.from(amount).neg());
      const receiverAccountUpdate = Experimental.createChildAccountUpdate(this.self, receiver, this.token.id);
      receiverAccountUpdate.balance.addInPlace(amount);
  }
  approveUpdate(zkappUpdate) {
      this.approve(zkappUpdate);
      const balanceChange = Int64.fromObject(zkappUpdate.body.balanceChange);
      balanceChange.assertEquals(Int64.from(0));
  }
  // Instead, use `approveUpdate` method.
  // @method deployZkapp(address: PublicKey, verificationKey: VerificationKey) {
  //     let tokenId = this.token.id
  //     let zkapp = AccountUpdate.create(address, tokenId)
  //     zkapp.account.permissions.set(Permissions.default())
  //     zkapp.account.verificationKey.set(verificationKey)
  //     zkapp.requireSignature()
  // }
  /**
   * 'sendTokens()' sends tokens from `senderAddress` to `receiverAddress`.
   *
   * It does so by deducting the amount of tokens from `senderAddress` by
   * authorizing the deduction with a proof. It then creates the receiver
   * from `receiverAddress` and sends the amount.
   */
  sendTokensFromZkApp(receiverAddress, amount, callback) {
      // approves the callback which deductes the amount of tokens from the sender
      let senderAccountUpdate = this.approve(callback);
      // Create constraints for the sender account update and amount
      let negativeAmount = Int64.fromObject(senderAccountUpdate.body.balanceChange);
      negativeAmount.assertEquals(Int64.from(amount).neg());
      let tokenId = this.token.id;
      // Create receiver accountUpdate
      let receiverAccountUpdate = Experimental.createChildAccountUpdate(this.self, receiverAddress, tokenId);
      receiverAccountUpdate.balance.addInPlace(amount);
  }
}
__decorate([
  state(UInt64),
  __metadata("design:type", Object)
], Token.prototype, "decimals", void 0);
__decorate([
  state(UInt64),
  __metadata("design:type", Object)
], Token.prototype, "maxSupply", void 0);
__decorate([
  state(UInt64),
  __metadata("design:type", Object)
], Token.prototype, "circulatingSupply", void 0);
__decorate([
  state(PublicKey),
  __metadata("design:type", Object)
], Token.prototype, "owner", void 0);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey, UInt64]),
  __metadata("design:returntype", void 0)
], Token.prototype, "mint", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey, UInt64]),
  __metadata("design:returntype", void 0)
], Token.prototype, "burn", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey, PublicKey, UInt64]),
  __metadata("design:returntype", void 0)
], Token.prototype, "transfer", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [Field, PublicKey, UInt64]),
  __metadata("design:returntype", void 0)
], Token.prototype, "lock", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey,
      PublicKey,
      UInt64, Experimental.Callback]),
  __metadata("design:returntype", void 0)
], Token.prototype, "approveCallbackAndTransfer", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [AccountUpdate, PublicKey, UInt64]),
  __metadata("design:returntype", void 0)
], Token.prototype, "approveUpdateAndTransfer", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [AccountUpdate]),
  __metadata("design:returntype", void 0)
], Token.prototype, "approveUpdate", null);
__decorate([
  method,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [PublicKey,
      UInt64, Experimental.Callback]),
  __metadata("design:returntype", void 0)
], Token.prototype, "sendTokensFromZkApp", null);
//# sourceMappingURL=erc20.js.map
