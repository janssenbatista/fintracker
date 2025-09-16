'use client';

import { useState } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Spinner } from '../spinner';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const formSchema = z.object({
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
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    values: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);

    const { email, password } = data;

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setLoginErrorMessage('Erro ao entrar. Verifique suas credenciais.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-4 w-full md:max-w-[50%] lg:max-w-[580px]"
      >
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className={clsx('input', {
            'border-red-500 outline-red-500': !!errors.email,
          })}
          {...register('email')}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
        <div className="flex flex-col">
          <label htmlFor="password" className="label mb-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            className={clsx('input', {
              'border-red-500': !!errors.password,
            })}
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
          <Link href={'/forgot-password'} className="small-link pt-1">
            Esqueci minha senha
          </Link>
        </div>
        {loginErrorMessage && (
          <span className="text-red-500 text-center">{loginErrorMessage}</span>
        )}
        <button type="submit" className="primary-button flex justify-center">
          {isLoading ? <Spinner /> : 'Entrar'}
        </button>
      </form>
      <div className="flex gap-1 text-sm md:text-lg">
        <span>Ainda não possui uma conta?</span>
        <Link href={'/sign-up'} className="link">
          Cadastre-se
        </Link>
      </div>
    </>
  );
}
