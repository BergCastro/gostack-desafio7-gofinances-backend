import path from 'path';
import csv from 'csvtojson';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

interface TransactionObject {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const transactions: Array<Transaction> = [];
    let results: Array<TransactionObject>;

    const filePath = path.join(uploadConfig.directory, filename);

    const createTransaction = new CreateTransactionService();

    await csv()
      .fromFile(filePath)
      .then(json => {
        results = json;
      });

    const forLoop = async () => {
      for (let index = 0; index < results.length; index += 1) {
        const transaction = await createTransaction.execute(results[index]);
        transactions.push(transaction);
      }
    };

    await forLoop();

    return transactions;
  }
}

export default ImportTransactionsService;
