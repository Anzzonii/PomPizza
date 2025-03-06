


async function cargarPizzas() {
    const rol = obtenerRolUsuario();
    
    try {
        const response = await fetch('http://localhost:8080/api/pizzas'); // Llamada a la API

        const pizzas = await response.json(); // Convertir respuesta a JSON

        const isAdmin = rol === "ROLE_ADMIN";
        
        const cardsContainer = document.getElementById('pizza-cards-container');

        cardsContainer.innerHTML = ''; // Limpiar el contenedor antes de insertar los datos

        pizzas.forEach(pizza => {

            // Si el usuario es admin, se muestra la pizza independientemente de su disponibilidad
            if (isAdmin || pizza.disponible) {
                const card = `
                    <div class="pizza-card">
                        <img src="${pizza.imageUrl}" alt="${pizza.nombre}" class="pizza-image">
                        <div class="pizza-info">
                            <h3>${pizza.nombre}</h3>
                            <p><strong>Ingredientes:</strong> ${pizza.ingredientes}</p>
                            <p><strong>Precio:</strong> ${pizza.precio.toFixed(2)}€</p>
                        </div>
                        ${isAdmin ? `
                            <div class="pizza-actions">
                                <button class="btn btn-danger" onClick="eliminarPizza('${pizza._id}')">Eliminar</button>
                                <button class="btn btn-warning" onClick="editarPizza('${pizza._id}')">Editar</button>
                            </div>
                        ` : ''}
                    </div>
                `;

                cardsContainer.innerHTML += card;
            }
        });

        if (!isAdmin) {
            document.getElementById("crearForm").style.display = "none"; // Ocultar el botón para crear pizzas si no es admin
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




document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault()

    cargarPizzas()

    const cerrarSesion = document.getElementById("cerrarSessionButton")

    cerrarSesion.addEventListener("click", function(e){
        e.preventDefault()

        localStorage.removeItem("token")
        window.location.href="/auth/login"

    })

});


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
        return null;
    }
}