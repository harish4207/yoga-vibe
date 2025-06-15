"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contentController = __importStar(require("../controllers/contentController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
console.log('Content Controller imported in routes:', contentController);
// Public route to get all content (e.g., for user dashboard)
router.get('/content', contentController.getAllContent);
// Admin routes for content management
router.post('/content', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)(['admin']), contentController.createContent);
router.get('/content/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)(['admin']), contentController.getContentById);
router.put('/content/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)(['admin']), contentController.updateContent);
router.delete('/content/:id', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)(['admin']), contentController.deleteContent);
exports.default = router;
