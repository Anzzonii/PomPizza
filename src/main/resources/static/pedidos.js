
let user = ""

async function cargarPedidos() {
    const rol = obtenerRolUsuario()
    const isAdmin = rol === "ROLE_ADMIN";

    try {

        const response = await fetch('http://localhost:8080/api/pedidos'); // Llamada a la API

        const pedidos = await response.json(); // Convertir respuesta a JSON

        const tablaBody = document.getElementById('pedido-table');

        if(isAdmin){

            tablaBody.innerHTML = ''; // Limpiar la tabla antes de insertar los datos


            pedidos.forEach(pedido => {

                const pizzasInfo = pedido.pizzas.map(pizza => {
                    return `${pizza.nombre} - ${pizza.precio.toFixed(2)}€`; // Formateamos el nombre y precio de cada pizza
                }).join('<br>');

                
                const fila = `<tr>
                    <td>${pedido.cliente}</td>
                    <td>${pizzasInfo}</td>
                    <td>${pedido.total}€</td>
                    <td>${pedido.fecha}</td>
                    <td>
                        ${pedido.estado}
                        <br>
                        <select id="estado-${pedido._id}" value="${pedido.estado}">
                            <option value="Pendiente">Pendiente</option>
                            <option value="En preparación">En preparación</option>
                            <option value="Listo">Listo</option>
                            <option value="Entregado">Entregado</option>
                        </select>
                    </td>
                    <td><button onclick="actualizarEstado('${pedido._id}')">Actualizar estado</button></td>

                </tr>`;
                tablaBody.innerHTML += fila;
            });

            document.getElementById("crearForm").style.display = "none"

        }else{
            
            document.getElementById("thAcciones").style.display = "none";
            
            pedidos.forEach(pedido => {

                if(pedido.cliente === user){

                    const pizzasInfo = pedido.pizzas.map(pizza => {
                        return `${pizza.nombre} - ${pizza.precio.toFixed(2)}€`; // Formateamos el nombre y precio de cada pizza
                    }).join('<br>');

                    const fila = `<tr>
                        <td>${pedido.cliente}</td>
                        <td>${pizzasInfo}</td>
                        <td>${pedido.total}€</td>
                        <td>${pedido.fecha}</td>
                        <td>${pedido.estado}</td>

                    </tr>`;
                    tablaBody.innerHTML += fila;
                }
            });

        }

    } catch (error) {
        console.error('Error cargando las pizzas:', error);
    }
}

async function actualizarEstado(id) {
    const nuevoEstado = document.getElementById("estado-"+id).value

    await fetch(`http://localhost:8080/api/pedidos/editarPedido/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(response => {
        if (response.ok) {
            alert(`Pedido cambiado a ${nuevoEstado}`); 
        } else {
            alert("Error al actualizar el estado");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error al actualizar el estado");
    });

    cargarPedidos()

}

function obtenerRolUsuario() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token almacenado");
        }

        // Decodificar el payload del token
        user = JSON.parse(atob(token.split(".")[1])).sub
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        


        user = tokenPayload.sub
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

cargarPedidos()