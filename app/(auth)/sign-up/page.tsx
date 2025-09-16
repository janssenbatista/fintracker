'use client';

import { useState } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Spinner } from '../spinner';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const formSchema = z.object({
  name: z.string().trim().min(3, 'O nome precisa ter no mínimo 3 caracteres.'),

  email: z
    .email({ message: 'Por favor, insira um endereço de email válido.' })
    .trim(),
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
      name: '',
      email: '',
      password: '',
    },
  });

  const [isLoading, setLoading] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);

    const { name, email, password } = data;

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: name,
        },
      },
    });

    if (error) {
      setLoading(false);
      setSignupErrorMessage('Erro ao cadastrar-se. Tente novamente!');
      return;
    }

    setLoading(false);
    setSuccessMessage(
      'Cadastro realizado com sucesso. Um link para ativação da conta foi enviado para seu email.'
    );
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-4 w-full md:max-w-[50%] lg:max-w-[580px]"
      >
        <label htmlFor="name" className="label">
          Nome
        </label>
        <input
          type="text"
          id="name"
          className={clsx('input', {
            'input-error': !!errors?.name,
          })}
          {...register('name')}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className={clsx('input', {
            'input-error': !!errors?.email,
          })}
          {...register('email')}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <label htmlFor="password" className="label">
          Senha
        </label>
        <input
          type="password"
          id="password"
          className={clsx('input', {
            'input-error': !!errors.password,
          })}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button type="submit" className="primary-button flex justify-center">
          {isLoading ? <Spinner /> : 'Criar conta'}
        </button>
      </form>
      {signupErrorMessage && (
        <p className="text-red-500 pr-4 pl-4 pb-2">{signupErrorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 pr-4 pl-4 pb-2">{successMessage}</p>
      )}
      <div className="flex gap-1 text-sm md:text-lg">
        <span>Já possui uma conta?</span>
        <Link href={'/login'} className="link">
          Entrar
        </Link>
      </div>
    </>
  );
}
