import {Request, Response} from 'express';
import {asyncHandler} from '../../../shared/utils/async-handler';
import {ProductAttributeService} from './product-attribute.service';
import {ApiResponse} from '../../../shared/utils/api-response';
import {TCreateAttribute, TUpdateAttribute, TCreateAttributeValue, TUpdateAttributeValue} from './product-attribute.schema';

const attributeService = new ProductAttributeService();

export class ProductAttributeController {
  // --- Attributes ---
  static getAllAttributes = asyncHandler(async (req: Request, res: Response) => {
    const data = await attributeService.getAllAttributes();
    return ApiResponse.success(res, data, 'Attributes retrieved');
  });

  static createAttribute = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TCreateAttribute;
    const result = await attributeService.createAttribute(data);
    return ApiResponse.success(res, result, 'Attribute created', 201);
  });

  static updateAttribute = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = req.body as TUpdateAttribute;
    const result = await attributeService.updateAttribute(id, data);
    return ApiResponse.success(res, result, 'Attribute updated');
  });

  static deleteAttribute = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await attributeService.deleteAttribute(id);
    return ApiResponse.success(res, null, 'Attribute deleted');
  });

  // --- Attribute Values ---
  static createAttributeValue = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TCreateAttributeValue;
    const result = await attributeService.createAttributeValue(data);
    return ApiResponse.success(res, result, 'Value created', 201);
  });

  static updateAttributeValue = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = req.body as TUpdateAttributeValue;
    const result = await attributeService.updateAttributeValue(id, data);
    return ApiResponse.success(res, result, 'Value updated');
  });

  static deleteAttributeValue = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await attributeService.deleteAttributeValue(id);
    return ApiResponse.success(res, null, 'Value deleted');
  });
}
