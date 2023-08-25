import { ChangeEvent, FormEvent, useContext, useState } from "react";
import axios from "axios";
import {
  isDateGreaterThanToday,
  isLatinOrSpanishString,
  isValidEmail,
  isValidWorkAge,
  validateEcuadorianID,
} from "@/utils/validations";
import { UserContext } from "./_app";
import { signOut } from "next-auth/react";
import { WorkRegime } from "@prisma/client";

type Employee = {
  id: string;
  name: string;
  email: string;
  date: Date;
  age: number | undefined;
  workRegime: WorkRegime | undefined;
};

export const workRegimes = [
  {
    value: WorkRegime.CODIGO_TRABAJO,
    name: "Código trabajo",
  },
  {
    value: WorkRegime.JUBILADO,
    name: "Jubilado",
  },
  {
    value: WorkRegime.LOEP,
    name: "LOEP",
  },
];

export const workRegimesArray = ["LOEP", "CODIGO_TRABAJO", "JUBILADO"]

export default function Home() {
  const [employee, setEmployee] = useState<Employee>({
    id: "",
    name: "",
    email: "",
    date: new Date(),
    age: undefined,
    workRegime: undefined,
  });

  const user = useContext(UserContext);

  function validateEmployee(): boolean {
    let missing = [];
    if (
      !employee.id.trim() ||
      employee.id.length > 10 ||
      employee.id.length < 10 ||
      !validateEcuadorianID(employee.id)
    ) {
      missing.push("cedula");
    }

    if (!employee.name.trim() || !isLatinOrSpanishString(employee.name)) {
      missing.push("nombre");
    }

    if (!employee.email || !isValidEmail(employee.email)) {
      missing.push("email");
    }

    if (!employee.age || !isValidWorkAge(employee.age)) {
      missing.push("edad");
    }

    if (!employee.date || isDateGreaterThanToday(employee.date)) {
      missing.push("fecha de registro");
    }

    if (
      !employee.workRegime ||
      !workRegimesArray.includes(employee.workRegime)
    ) {
      missing.push("regimen de trabajo");
    }

    if (missing.length > 0) {
      alert(`Campos faltantes o incorrectos: ${missing.join(", ")}`);
      return false;
    }

    return true;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateEmployee()) {
      return;
    }

    axios
      .post("http://localhost:3000/api/employee", employee)
      .then((res) => {
        alert("Empleado registrado con exito!");
      })
      .catch((err) => {
        alert("Error registrando al empleado");
      })
      .finally(() => {
        setEmployee({
          id: "",
          name: "",
          email: "",
          date: new Date(),
          age: undefined,
          workRegime: undefined,
        });
      });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "age") {
      setEmployee({ ...employee, age: parseInt(e.target.value) });
      return;
    }

    if (e.target.name === "date") {
      setEmployee({ ...employee, date: new Date(e.target.value) });
      return;
    }
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  }

  return (
    <main className="w-screen h-screen flex justify-center items-center relative bg-slate-100">
      <div className="absolute top-5 right-5 flex  flex-col space-y-1 justify-end items-end ">
        <div className="font-bold text-lg">Bienvenido {user?.name} ({user?.username})!</div>
        <button
          onClick={() => signOut()}
          className="font-bold w-fit text-red-500 hover:scale-105 hover:text-red-700 transition-all"
        >
          Salir de la sesion
        </button>
      </div>

      <div className="flex w-full justify-center items-center flex-col">
        <h1 className="font-bold text-3xl">Registro de empleados</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-1/2 ">
          <div className="flex  w-full flex-wrap">
            <div className="flex flex-col p-2 w-1/2">
              <label>Cédula</label>
              <input
                name="id"
                type="text"
                value={employee.id}
                onChange={handleChange}
                className="border-2 border-black p-2"
                placeholder="Cedula..."
              />
            </div>
            <div className="flex flex-col p-2 w-1/2">
              <label>Nombre</label>
              <input
                name="name"
                type="text"
                value={employee.name}
                onChange={handleChange}
                className="border-2 border-black p-2"
                placeholder="Nombre..."
              />
            </div>
            <div className="flex flex-col p-2 w-1/2">
              <label>Fecha registro</label>
              <input
                name="date"
                type="date"
                onChange={handleChange}
                className="border-2 border-black p-2"
                placeholder="Fecha registro..."
              />
            </div>
            <div className="flex flex-col p-2 w-1/2">
              <label>Edad</label>
              <input
                name="age"
                type="number"
                value={employee.age}
                onChange={handleChange}
                className="border-2 border-black p-2"
                placeholder="Edad..."
              />
            </div>
            <div className="flex flex-col p-2 w-1/2">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={employee.email}
                onChange={handleChange}
                className="border-2 border-black p-2"
                placeholder="Email..."
              />
            </div>
            <div className="flex flex-col p-2 w-1/2">
              <label>Régimen de trabajo</label>
              <select
                defaultValue={""}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    workRegime: e.target.value as WorkRegime,
                  })
                }
                className="border-2 border-black p-2"
              >
                <option value={""} disabled>
                  Seleccionar...
                </option>
                {workRegimes.map((wr, i) => (
                  <option value={wr.value} key={i}>
                    {wr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <input
            type="submit"
            className="bg-blue-700 w-full p-2 mt-5 rounded-md font-bold cursor-pointer hover:bg-blue-900 transition-all text-white"
            value="Enviar"
          />
        </form>
      </div>
    </main>
  );
}
