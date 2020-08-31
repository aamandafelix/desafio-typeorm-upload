import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const repository = getCustomRepository(TransactionsRepository);

    const transactions = await repository.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, currentTransaction) => {
        switch (currentTransaction.type) {
          case 'income':
            accumulator.income += Number(currentTransaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(currentTransaction.value);
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
      },
    );
    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
