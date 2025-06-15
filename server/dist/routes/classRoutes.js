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
const classController = __importStar(require("../controllers/classController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Public: get all classes, get class by id
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
// Protected: create, update, delete (admin/instructor only)
// Temporarily removed authorizeRoles for testing class creation
router.post('/', authMiddleware_1.authenticateJWT, classController.createClass);
router.put('/:id', authMiddleware_1.authenticateJWT, (0, roleMiddleware_1.authorizeRoles)('admin', 'instructor'), classController.updateClass);
// router.put('/:id/image', authenticateJWT, authorizeRoles('admin', 'instructor'), upload.single('classImage'), classController.uploadClassImage);
router.delete('/:id', authMiddleware_1.authenticateJWT, (0, roleMiddleware_1.authorizeRoles)('admin', 'instructor'), classController.deleteClass);
// Protected: enrollment endpoints (authenticated users)
router.post('/:id/enroll', authMiddleware_1.authenticateJWT, classController.enrollInClass);
router.delete('/:id/enroll', authMiddleware_1.authenticateJWT, classController.unenrollFromClass);
exports.default = router;
