"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multer_host = exports.multer_local = void 0;
const multer_1 = __importDefault(require("multer"));
const node_fs_1 = __importDefault(require("node:fs"));
const multer_local = ({ custom_path = "General", custom_type = [] }) => {
    const full_path = `upload/${custom_path}`;
    if (!node_fs_1.default.existsSync(full_path)) {
        node_fs_1.default.mkdirSync(full_path, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, full_path);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() +
                "-" +
                Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}__${file.originalname}`);
        }
    });
    const fileFilter = (req, file, cb) => {
        if (custom_type.length &&
            !custom_type.includes(file.mimetype)) {
            return cb(new Error("Invalid File Type"));
        }
        cb(null, true);
    };
    return (0, multer_1.default)({
        storage,
        fileFilter
    });
};
exports.multer_local = multer_local;
const multer_host = ({ custom_type = [] }) => {
    const storage = multer_1.default.memoryStorage();
    const fileFilter = (req, file, cb) => {
        if (custom_type.length &&
            !custom_type.includes(file.mimetype)) {
            return cb(new Error("Invalid File Type"));
        }
        cb(null, true);
    };
    return (0, multer_1.default)({
        storage,
        fileFilter
    });
};
exports.multer_host = multer_host;
