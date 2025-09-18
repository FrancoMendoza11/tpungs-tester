// testCases.js
// Test cases para los problemas A a E del Torneo de Programación UNGS 2025

export const testCases = {
  // Problema A: Suma de Pares
  A: [
    {
      name: "Caso 1: Ejemplo del enunciado",
      input: "5 3\n1 3 2 6 1\n",
      output: "3"
    },
    {
      name: "Caso 2: Ningún par divisible por K",
      input: "4 5\n1 2 3 4\n",
      output: "0"
    },
    {
      name: "Caso 3: Todos los pares son válidos",
      input: "3 1\n1 2 3\n",
      output: "3"
    }
  ],

  // Problema B: Conteo de Números Repetidos
  B: [
    {
      name: "Caso 1: Ejemplo del enunciado",
      input: "8\n1 2 3 2 4 1 5 1\n",
      output: "2"
    },
    {
      name: "Caso 2: Todos los números únicos",
      input: "5\n1 2 3 4 5\n",
      output: "0"
    },
    {
      name: "Caso 3: Todos los números iguales",
      input: "4\n7 7 7 7\n",
      output: "1"
    }
  ],

  // Problema C: Subarray con Suma Mínima Mayor o Igual a S
  C: [
    {
      name: "Caso 1: Ejemplo del enunciado",
      input: "6 11\n1 2 3 4 5 6\n",
      output: "3"
    },
    {
      name: "Caso 2: Subarray completo necesario",
      input: "5 15\n1 2 3 4 5\n",
      output: "5"
    },
    {
      name: "Caso 3: Ningún subarray alcanza S",
      input: "3 10\n1 2 3\n",
      output: "0"
    }
  ],

  // Problema D: Máxima Suma de Subarray Contiguo de Longitud Exacta K
  D: [
    {
      name: "Caso 1: Ejemplo del enunciado",
      input: "8 3\n1 2 3 4 5 1 2 6\n",
      output: "12"
    },
    {
      name: "Caso 2: Subarray con números negativos",
      input: "5 2\n-1 -2 3 4 -5\n",
      output: "7"
    },
    {
      name: "Caso 3: K = 1, máxima suma es el mayor número",
      input: "4 1\n1 5 3 2\n",
      output: "5"
    }
  ],

  // Problema E: Subarray con K Elementos Únicos
  E: [
    {
      name: "Caso 1: Ejemplo del enunciado",
      input: "7 3\n1 2 1 2 3 4 3\n",
      output: "5"
    },
    {
      name: "Caso 2: Todos los elementos únicos, K = N",
      input: "4 4\n1 2 3 4\n",
      output: "4"
    },
    {
      name: "Caso 3: No hay subarray con exactamente K elementos únicos",
      input: "5 3\n1 1 2 2 1\n",
      output: "0"
    }
  ],
};
