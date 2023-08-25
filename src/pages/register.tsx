import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import { isLatinOrSpanishString } from "@/utils/validations";

type User = {
  username: string;
  password: string;
};

export default function Register() {
  const [user, setUser] = useState<User>({
    username: "",
    password: "",
  });

  function isValidPassword(password: string): boolean {
    const regex =
      /^(?=.*?[A-Z].*?[A-Z])(?=.*?[a-z])(?=.*?[0-9].*?[0-9]).{2,8}$/;

    return regex.test(password);
  }
  function isValidUsername(username: string): boolean {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;

    return regex.test(username);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function validateUser(userToSend: {
    username: string | undefined;
    name: string | undefined;
    password: string | undefined;
  }): boolean {
    let missing = [];

    if (!userToSend.username || !isValidUsername(userToSend.username)) {
      missing.push("usuario");
    }
    if (!userToSend.name || !isLatinOrSpanishString(userToSend.name)) {
      missing.push("nombre");
    }

    if (!userToSend.password || !isValidPassword(userToSend.password)) {
      missing.push("contraseña");
    }

    if (missing.length > 0) {
      alert(`Campos faltantes o incorrectos: ${missing.join(", ")}`);
      return false;
    }

    return true;
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);

    const userToSend = {
      username: form.get("username")?.toString(),
      password: form.get("password")?.toString(),
      name: form.get("name")?.toString(),
    };

    if (!validateUser(userToSend)) {
      return
    }

    axios
      .post("/api/register", userToSend)
      .then((res) => {
        if (!res.data.user) {
          return null;
        }

        signIn("credentials", {
          username: res.data.user.username,
          password: form.get("password"),
          callbackUrl: "/login",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div>
        <h1 className="font-bold text-2xl">Registrarse </h1>
        <form
          className="flex flex-col space-y-3 my-5"
          onSubmit={handleRegister}
        >
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
            <label>Nombre</label>
            <input
              onChange={handleChange}
              name="name"
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
              value="Registrarse"
              className="bg-blue-700 transition-all text-white hover:bg-blue-500 p-2 w-fit"
            />
          </div>
        </form>
        <p>
          Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-800 font-bold hover:text-blue-500 transition-all"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
