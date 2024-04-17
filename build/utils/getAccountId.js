"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountId = void 0;
const getAccountId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let accountId = req.headers["account-id"];
    if (!accountId) {
        res.status(400).json({ error: "Account id not found" });
        return;
    }
    if (Array.isArray(accountId)) {
        accountId = accountId[0];
    }
    return accountId;
});
exports.getAccountId = getAccountId;
