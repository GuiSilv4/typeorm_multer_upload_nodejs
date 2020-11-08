import { getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import CategoryRepository from '../repositories/CategoriesRepository';

class CreatCategoryService {
  public async execute(title: string): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoryRepository);
    const category = await categoriesRepository.findOne({ title });

    if (!category) {
      const newCategory = categoriesRepository.create({
        title,
      });
      await categoriesRepository.save(newCategory);
      return newCategory;
    }

    return category;
  }
}

export default CreatCategoryService;
