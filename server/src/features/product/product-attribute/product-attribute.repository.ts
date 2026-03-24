import {prisma} from '../../../shared/lib/prisma';
import {TCreateAttribute, TUpdateAttribute, TCreateAttributeValue, TUpdateAttributeValue} from './product-attribute.schema';

export class ProductAttributeRepository {
  // --- Attribute Methods ---
  async getAllAttributes() {
    return await prisma.attribute.findMany({
      where: {deletedAt: null},
      include: {attributeValues: {where: {deletedAt: null}}}
    });
  }

  async findAttributeById(id: string) {
    return await prisma.attribute.findUnique({
      where: {id, deletedAt: null},
      include: {attributeValues: {where: {deletedAt: null}}}
    });
  }

  async createAttribute(data: TCreateAttribute) {
    return await prisma.attribute.create({data});
  }

  async updateAttribute(id: string, data: TUpdateAttribute) {
    return await prisma.attribute.update({where: {id}, data});
  }

  async deleteAttribute(id: string) {
    return await prisma.attribute.update({
      where: {id},
      data: {deletedAt: new Date()}
    });
  }

  // --- AttributeValue Methods ---
  async createAttributeValue(data: TCreateAttributeValue) {
    return await prisma.attributeValue.create({data});
  }

  async updateAttributeValue(id: string, data: TUpdateAttributeValue) {
    return await prisma.attributeValue.update({where: {id}, data});
  }

  async deleteAttributeValue(id: string) {
    return await prisma.attributeValue.update({
      where: {id},
      data: {deletedAt: new Date()}
    });
  }
}
