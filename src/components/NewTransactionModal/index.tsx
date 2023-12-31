import * as Dialog from '@radix-ui/react-dialog';
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from './styles';
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionContext } from '../../contexts/TransactionsContext';
import { useContextSelector } from 'use-context-selector';

const newTransactionModalSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
});

type NewTransactionsFormInputs = z.infer<typeof newTransactionModalSchema>;

export function NewTransactionModal() {
  const createTransaction = useContextSelector(
    TransactionContext,
    (context) => {
      return context.createTransaction;
    }
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactionsFormInputs>({
    resolver: zodResolver(newTransactionModalSchema),
    defaultValues: {
      type: 'income',
    },
  });

  async function handleCreateNewTransaction(data: NewTransactionsFormInputs) {
    const { category, description, price, type } = data;

    await createTransaction({
      category,
      description,
      price,
      type,
    });

    reset();
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova Transação</Dialog.Title>
        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form action='' onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type='text'
            placeholder='Descrição'
            required
            {...register('description')}
          />
          <input
            type='text'
            placeholder='Preço'
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type='text'
            placeholder='Categoria'
            required
            {...register('category')}
          />

          <Controller
            control={control}
            name='type'
            render={({ field }) => {
              console.log(field);

              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButton
                    variant='income'
                    value='income'
                    {...register('type')}
                  >
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>

                  <TransactionTypeButton
                    variant='outcome'
                    value='outcome'
                    {...register('type')}
                  >
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              );
            }}
          />

          <button type='submit' disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}
