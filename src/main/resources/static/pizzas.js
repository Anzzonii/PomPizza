


async function cargarPizzas() {
    const rol = obtenerRolUsuario()
    
    try {
        const response = await fetch('http://localhost:8080/api/pizzas'); // Llamada a la API

        const pizzas = await response.json(); // Convertir respuesta a JSON

        const isAdmin = rol === "ROLE_ADMIN";
        
        const tablaBody = document.getElementById('pizza-table');

        tablaBody.innerHTML = ''; // Limpiar la tabla antes de insertar los datos

        pizzas.forEach(pizza => {

            //Si el usuario es admin la muestra independientemente si esta disponible o no
            if(isAdmin){
                const fila = `<tr>
                    <td>${pizza.nombre}</td>
                    <td>${pizza.ingredientes}</td>
                    <td>${pizza.precio.toFixed(2)}€</td>
                    <td><image src="${pizza.imageUrl}" width="200"></td>

                    ${isAdmin ? `
                    <td>
                        <button onClick="eliminarPizza('${pizza._id}')">Eliminar</button>
                        <button onClick="editarPizza('${pizza._id}')">Editar</button>
                    </td>`
                    : ""}
                </tr>`;
                    
                tablaBody.innerHTML += fila;

            }else{
                //Si la pizza esta disponible y el usuario no es admin se muestra
                if(pizza.disponible){
                        const fila = `<tr>
                        <td>${pizza.nombre}</td>
                        <td>${pizza.ingredientes}</td>
                        <td>${pizza.precio.toFixed(2)}€</td>
                        <td><image src="${pizza.imageUrl}" width="200"></td>

                        ${isAdmin ? `
                        <td>
                            <button onClick="eliminarPizza('${pizza._id}')">Eliminar</button>
                            <button onClick="editarPizza('${pizza._id}')">Editar</button>
                        </td>`
                        : ""}
                    </tr>`;
                        
                    tablaBody.innerHTML += fila;
                }

            }
        });

        if (!isAdmin) {
            document.getElementById("thAcciones").style.display = "none";
            document.getElementById("crearForm").style.display = "none";
        }

    } catch (error) {
        console.error('Error cargando las pizzas:', error);
    }
}

function eliminarPizza(id) {
    
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta pizza?");
    
    if (!confirmacion) {
        return;
    }

    fetch(`/api/pizzas/deletePizza?id=${id}`, { 
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error eliminando la pizza");
        }
        return response.text();
    })
    .then(data => {
        alert("Pizza eliminada correctamente");
        window.location.reload(); 
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al eliminar la pizza.");
    });
}

function editarPizza(id) {
    window.location.href = `/pizzas/admin/editarPizza/${id}`; // Ajusta la ruta según tu backend
}


document.addEventListener('DOMContentLoaded', cargarPizzas);


function obtenerRolUsuario() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token almacenado");
        }

        // Decodificar el payload del token
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));

        // Extraer el rol del campo 'role'
        const rol = tokenPayload.role;

        if (!rol) {
            throw new Error("El token no contiene un rol válido");
        }

        return rol;
    } catch (error) {
        console.error("Error obteniendo el rol:", error);
        localStorage.removeItem("token"); // Limpiar el token inválido
        window.location.href = "/auth/login";
        return null;
    }
}