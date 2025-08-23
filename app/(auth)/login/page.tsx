import Image from "next/image";

export default async function Page() {
  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <Image
        src={"/logo.png"}
        width={128}
        height={128}
        alt="logo da aplicação"
      />
      <h1 className="text-4xl font-bold mt-2">
        Fin<span className="text-blue-500">Tracker</span>
      </h1>
      <form
        method="POST"
        className="flex flex-col gap-2 p-4 w-full md:max-w-[50%] lg:max-w-[35%]"
      >
        <label htmlFor="email" className="label">
          Email
        </label>
        <input type="email" name="email" id="email" className="input" />
        <label htmlFor="password" className="label">
          Senha
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="input"
        />
        <input type="submit" value="Entrar" className="primary-button" />
      </form>
      <div className="flex gap-1 text-sm md:text-lg">
        <span>Ainda não possui uma conta?</span>
        <span className="link">Cadastre-se</span>
      </div>
    </main>
  );
}
