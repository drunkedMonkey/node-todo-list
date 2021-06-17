require("colors");
const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoCheckList,
} = require("./helpers/inquirer");
const Tareas = require("./models/tareas");

// const { mostrarMenu, pausa } = require("./helpers/mensajes");

const main = async () => {
  let opt = "";
  const tareas = new Tareas();
  const tareasDB = leerDB();
  let control = true;
  if (tareasDB) {
    tareas.cargarTareasFormArray(tareasDB);
  }
  do {
    const opt = await inquirerMenu();
    switch (opt) {
      case "1":
        //crear
        const desc = await leerInput("Descripción: ");
        tareas.crearTarea(desc);
        break;
      case "2":
        tareas.listadoCompleto();
        break;
      case "3":
        tareas.listarPendientesCompletadas(true);
        break;
      case "4":
        tareas.listarPendientesCompletadas(false);
        break;
      case "5":
        const ids = await mostrarListadoCheckList(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case "6":
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== "0") {
          const ok = await confirmar("¿Estás seguro que deseas borrrar?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada correctamente");
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);
    if (opt !== "0") await pausa();
    control = opt !== "0";
  } while (control);
};

main();
