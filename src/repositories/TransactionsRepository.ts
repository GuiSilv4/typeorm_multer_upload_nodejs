import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balance = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += transaction.value;
          accumulator.total += transaction.value;
        } else {
          accumulator.outcome += transaction.value;
          accumulator.total -= transaction.value;
        }
        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );
    return balance;
  }
}

export default TransactionsRepository;
