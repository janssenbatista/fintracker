'use client';

import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { Spinner } from '../spinner';
import { useRouter } from 'next/navigation';

export const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
      .regex(/[a-z]/, {
        message: 'A senha deve conter pelo menos uma letra minúscula',
      })
      .regex(/[A-Z]/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
      .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
      .regex(/[!@#$%^&*]/, {
        message:
          'A senha deve conter pelo menos um caractere especial (!@#$%^&*)',
      }),
    confirmPassword: z.string().min(1, 'A confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não correspondem.',
    path: ['confirmPassword'],
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
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      console.log(event);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      setErrorMessage('Erro ao tentar redefinir senha. Tente novaemente.');
      setLoading(false);
      return;
    }

    reset();

    for (let index = 1; index < 4; index++) {
      setSuccessMessage(
        `Senha atualizada com sucesso! Você será redirecionado em ${
          4 - index
        }...`
      );
    }

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-4 w-full md:max-w-[50%] lg:max-w-[580px]"
      >
        <label className="label" htmlFor="password">
          Senha
        </label>
        <input
          type="password"
          className={clsx('input', {
            'border-red-500': !!errors.password,
          })}
          {...register('password')}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
        <label className="label" htmlFor="confirmPassword">
          Confirmar Senha
        </label>
        <input
          type="password"
          className={clsx('input', {
            'border-red-500': !!errors.password,
          })}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
        <button type="submit" className="primary-button flex justify-center">
          {isLoading ? <Spinner /> : 'Redefinir Senha'}
        </button>
      </form>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </>
  );
}
