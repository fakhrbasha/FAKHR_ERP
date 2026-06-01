import { NextFunction, Request, Response } from "express"
import EmployeeRepository from "../../DB/repository/employee.repository"
import { AppError } from "../../common/utils/global-error-handling"
import MaterialRepository from "../../DB/repository/material.repository"
import { IMaterial } from "../../DB/models/materials.model"
import mongoose from "mongoose"



class MaterialService {




    private readonly _materialModel = new MaterialRepository()

    // create-material


    addMaterial = async (req: Request, res: Response, next: NextFunction) => {
        const { name, description, code, unit }: IMaterial = req.body

        const isMaterial = await this._materialModel.findOne({
            filter: {
                $or: [
                    { code },
                    { name }
                ]
            }
        })

        if (isMaterial) {
            throw new AppError("material already exist", 409)
        }

        const material = await this._materialModel.create({
            name: name.trim(), description, code: code?.trim().toUpperCase(), unit
        })

        return res.status(201).json({
            status: true,
            message: "Material Added Successfully",
            data: material
        })
    }

    // get-material
    getMaterials = async (req: Request, res: Response, next: NextFunction) => {
        const data = await this._materialModel.find({ filter: {} })
        if (!data) {
            throw new AppError("Data Is Empty", 400)
        }

        return res.status(200).json({
            success: true,
            message: "Material retrieved Successfully",
            data
        })
    }



    // get-material-by-id

    getMaterialById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const isMaterial = await this._materialModel.findOne({
            filter: { _id: id }
        })

        if (!isMaterial) {
            throw new AppError("Material Not Found", 404)
        }

        return res.status(200).json({
            success: true,
            message: "Material retrieved successfully",
            data: isMaterial
        })
    }
    // update-material
    updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        if (Array.isArray(id)) {
            throw new AppError("Invalid employee id", 400);
        }
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError(
                "Invalid material id",
                400
            );
        }



        const { name, unit, description, code } = req.body


        const isMaterial = await this._materialModel.findOne({
            filter: { _id: id }
        })

        if (!isMaterial) {
            throw new AppError("Material Not Found", 404)

        }
        const materialWithSameCode =
            await this._materialModel.findOne({
                filter: {
                    code
                }
            });

        if (
            materialWithSameCode &&
            materialWithSameCode._id.toString() !== id
        ) {
            throw new AppError(
                "Material code already exists",
                409
            );
        }
        const updateData: any = {};

        if (name !== undefined) {
            updateData.name = name;
        }

        if (unit !== undefined) {
            updateData.unit = unit;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (code !== undefined) {
            updateData.code = code;
        }
        const updatedMaterial = await this._materialModel.update({ _id: id }, updateData)
        return res.status(200).json({
            success: true,
            message: "Material updated successfully",
            data: updatedMaterial
        });


    }

    deleteMaterial = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        if (Array.isArray(id)) {
            throw new AppError("Invalid employee id", 400);
        }
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError(
                "Invalid material id",
                400
            );
        }

        const isMaterial = await this._materialModel.findOne({
            filter: { _id: id }
        })

        if (!isMaterial) {
            throw new AppError("Material not found", 404)
        }

        await this._materialModel.delete(isMaterial._id)

        return res.status(200).json({
            status: true,
            message: "delete Material successfully"
        })
    }
    // delete-material

}

export default new MaterialService()