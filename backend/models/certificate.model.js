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
const mongoose_1 = __importStar(require("mongoose"));
const CertificateSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    assessmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    },
    issuer: { type: String, default: "EduConnect" },
    credentialID: { type: String, required: true },
    grade: { type: String, required: true },
    skills: [{ type: String }]
}, { timestamps: true });
// Generate a unique credential ID
CertificateSchema.pre("save", function (next) {
    if (this.isNew) {
        const prefix = this.title.substring(0, 3).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        const timestamp = Date.now().toString().slice(-4);
        this.credentialID = `${prefix}-${random}-${timestamp}`;
    }
    next();
});
const Certificate = mongoose_1.default.model("Certificate", CertificateSchema);
exports.default = Certificate;
