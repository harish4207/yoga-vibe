"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const classRoutes_1 = __importDefault(require("./classRoutes"));
const chatRoutes_1 = __importDefault(require("./chatRoutes"));
const router = express_1.default.Router();
router.use('/auth', authRoutes_1.default);
router.use('/api/classes', classRoutes_1.default);
router.use('/api', chatRoutes_1.default);
exports.default = router;
