/* eslint-disable @typescript-eslint/camelcase */
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    if (type !== 'outcome' && type !== 'income') {
      throw new AppError(
        'Wrong Paremeter to type. Need to be income or outcome.',
      );
    }
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError('Value exceed amounth available in you account.');
    }
    const createCategory = new CreateCategoryService();
    const newCategory = await createCategory.execute(category);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: newCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
