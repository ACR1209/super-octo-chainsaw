import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

type User = {
  username: string;
  password: string;
};
export default function Login() {
  const [user, setUser] = useState<User>({
    username: "",
    password: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleLogIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);

    await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      callbackUrl: "/",
    });
  }

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div>
        <h1 className="font-bold text-2xl">Iniciar Sesión</h1>
        <form className="flex flex-col space-y-3 my-5" onSubmit={handleLogIn}>
          <div className="flex flex-col">
            <label>Usuario</label>
            <input
              onChange={handleChange}
              name="username"
              className="border-2 border-black"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <label>Contraseña</label>
            <input
              className="border-2 border-black"
              name="password"
              onChange={handleChange}
              type="password"
            />
          </div>

          <div className="w-full flex justify-end">
            <input
              type="submit"
              value="Iniciar sesión"
              className="bg-blue-700 cursor-pointer transition-all text-white hover:bg-blue-500 p-2 w-fit"
            />
          </div>
        </form>
        <p>
          No tienes una cuenta?
          <Link
            href="/register"
            className="text-blue-800 font-bold hover:text-blue-500 transition-all"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
