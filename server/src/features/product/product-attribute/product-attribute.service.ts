import {ProductAttributeRepository} from './product-attribute.repository';
import {HttpException} from '../../../shared/exceptions/http-exception';
import httpStatus from 'http-status';
import {TCreateAttribute, TUpdateAttribute, TCreateAttributeValue, TUpdateAttributeValue} from './product-attribute.schema';

export class ProductAttributeService {
  private repository: ProductAttributeRepository;

  constructor() {
    this.repository = new ProductAttributeRepository();
  }

  async getAllAttributes() {
    return await this.repository.getAllAttributes();
  }

  async getAttributeById(id: string) {
    const attr = await this.repository.findAttributeById(id);
    if (!attr) throw new HttpException('Attribute not found', httpStatus.NOT_FOUND);
    return attr;
  }

  async createAttribute(data: TCreateAttribute) {
    return await this.repository.createAttribute(data);
  }

  async updateAttribute(id: string, data: TUpdateAttribute) {
    return await this.repository.updateAttribute(id, data);
  }

  async deleteAttribute(id: string) {
    return await this.repository.deleteAttribute(id);
  }

  async createAttributeValue(data: TCreateAttributeValue) {
    return await this.repository.createAttributeValue(data);
  }

  async updateAttributeValue(id: string, data: TUpdateAttributeValue) {
    return await this.repository.updateAttributeValue(id, data);
  }

  async deleteAttributeValue(id: string) {
    return await this.repository.deleteAttributeValue(id);
  }
}
