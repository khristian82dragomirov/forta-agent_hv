"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var forta_agent_1 = require("forta-agent");
var agent_1 = __importStar(require("./agent"));
var createTxEvent = function (_a) {
    var gasUsed = _a.gasUsed, addresses = _a.addresses, logs = _a.logs, blockNumber = _a.blockNumber;
    var tx = {};
    var receipt = { gasUsed: gasUsed, logs: logs };
    var block = { number: blockNumber };
    var eventAddresses = __assign({}, addresses);
    return new forta_agent_1.TransactionEvent(forta_agent_1.EventType.BLOCK, forta_agent_1.Network.MAINNET, tx, receipt, [], eventAddresses, block);
};
describe("multi gas threshold agent", function () {
    var handleTransaction;
    beforeAll(function () {
        handleTransaction = agent_1.default.handleTransaction;
    });
    describe("handleTransaction", function () {
        it("Returns empty findings if gas used is below lowest threshold", function () { return __awaiter(void 0, void 0, void 0, function () {
            var txEvent, findings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txEvent = createTxEvent({ gasUsed: "500000" });
                        return [4 /*yield*/, handleTransaction(txEvent)];
                    case 1:
                        findings = _a.sent();
                        expect(findings).toStrictEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Returns finding with severity Medium if gas used is between 1000000 and 3000000", function () { return __awaiter(void 0, void 0, void 0, function () {
            var txEvent, findings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txEvent = createTxEvent({
                            gasUsed: agent_1.MEDIUM_GAS_THRESHOLD
                        });
                        return [4 /*yield*/, handleTransaction(txEvent)];
                    case 1:
                        findings = _a.sent();
                        expect(findings).toStrictEqual([
                            forta_agent_1.Finding.fromObject({
                                name: "High Gas Use Detection",
                                description: "Gas Used by Transaction",
                                alertId: "NETHFORTA-1",
                                severity: forta_agent_1.FindingSeverity.Medium,
                                type: forta_agent_1.FindingType.Suspicious,
                                metadata: {
                                    gas: agent_1.MEDIUM_GAS_THRESHOLD
                                }
                            })
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Returns finding with severity High if gas used is greater than or equal to 3000000", function () { return __awaiter(void 0, void 0, void 0, function () {
            var txEvent, findings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txEvent = createTxEvent({
                            gasUsed: agent_1.HIGH_GAS_THRESHOLD
                        });
                        return [4 /*yield*/, handleTransaction(txEvent)];
                    case 1:
                        findings = _a.sent();
                        expect(findings).toStrictEqual([
                            forta_agent_1.Finding.fromObject({
                                name: "High Gas Use Detection",
                                description: "Gas Used by Transaction",
                                alertId: "NETHFORTA-1",
                                severity: forta_agent_1.FindingSeverity.High,
                                type: forta_agent_1.FindingType.Suspicious,
                                metadata: {
                                    gas: agent_1.HIGH_GAS_THRESHOLD
                                }
                            })
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Returns empty findings if gasUsed is undefined", function () { return __awaiter(void 0, void 0, void 0, function () {
            var txEvent, findings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txEvent = createTxEvent({});
                        return [4 /*yield*/, handleTransaction(txEvent)];
                    case 1:
                        findings = _a.sent();
                        expect(findings).toStrictEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
