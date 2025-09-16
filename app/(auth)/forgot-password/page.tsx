'use client';

import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { Spinner } from '../spinner';

export const formSchema = z.object({
  email: z
    .email({ message: 'Por favor, insira um endereço de email válido.' })
    .trim(),
});

export type FormSchemaType = z.infer<typeof formSchema>;

const supabase = createClient();

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    values: {
      email: '',
    },
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/callback`,
    });

    if (error) {
      setErrorMessage('Erro ao enviar o email. Tente novamente.');
      setLoading(false);
      return;
    }

    reset();
    setSuccessMessage('Email com link de redefinição enviado com sucesso!');
    setLoading(false);
  };

  return (
    <main className="flex flex-col gap-4 mt-4 p-4">
      <h1 className="text-xl font-medium">
        Digite seu email para receber o código de confirmação
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="email..."
          className={clsx('input', {
            'border-red-500': !!errors.email,
          })}
          {...register('email')}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
        <button type="submit" className="primary-button flex justify-center">
          {isLoading ? <Spinner /> : 'Enviar'}
        </button>
      </form>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </main>
  );
}
