let pizzas = [];
let pizzasList = []; // Lista de pizzas en el pedido
let precioTotal = 0; // Variable para almacenar el precio total
let user = "" 

async function cargarPizzas() {
    try {
        const response = await fetch('http://localhost:8080/api/pizzas'); // Llamada a la API
        pizzas = await response.json(); // Convertir respuesta a JSON
        
        const tablaBody = document.getElementById('pizza-table');
        tablaBody.innerHTML = ''; // Limpiar la tabla antes de insertar los datos

        pizzas.forEach(pizza => {

            if(pizza.disponible == true){
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${pizza.nombre}</td>
                    <td>${pizza.ingredientes}</td>
                    <td>${pizza.precio.toFixed(2)}€</td>
                    <td><img src="${pizza.imageUrl}" width="200"></td>
                    <td><button class="add-btn" data-nombre="${pizza.nombre}" data-precio="${pizza.precio}" data-id="${pizza._id}">Agregar</button></td>
                `;

                console.log(pizza._id)

                // Agregar evento al botón de agregar
                fila.querySelector('.add-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = e.target.getAttribute('data-id')
                    const nombre = e.target.getAttribute('data-nombre');
                    const precio = parseFloat(e.target.getAttribute('data-precio'));
                    agregarAPedido(id, nombre, precio);
                });

                tablaBody.appendChild(fila);
            }
        });

    } catch (error) {
        console.error('Error cargando las pizzas:', error);
    }
}

function agregarAPedido(_id, nombre, precio) {
    pizzasList.push({ _id ,nombre, precio });
    precioTotal += precio; // Sumar al precio total

    actualizarListaPedido();
}

function actualizarListaPedido() {
    const listaPedido = document.getElementById('pedido-list');
    listaPedido.innerHTML = ''; // Limpiar la lista antes de actualizar

    pizzasList.forEach((pizza, index) => {
        const item = document.createElement('li');
        item.textContent = `${pizza.nombre} - ${pizza.precio.toFixed(2)}€`;
        
        // Botón para eliminar del pedido
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
            precioTotal -= pizza.precio; // Restar el precio de la pizza eliminada
            pizzasList.splice(index, 1);
            actualizarListaPedido();
        });

        item.appendChild(btnEliminar);
        listaPedido.appendChild(item);
    });

    // Mostrar el precio total
    const totalElement = document.getElementById('total-precio');
    totalElement.textContent = `Total: ${precioTotal.toFixed(2)}€`;
}

document.getElementById("addPedidoForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const pedido = {
        cliente: user, 
        pizzas: pizzasList,
        total: precioTotal,
        fecha: new Date().toLocaleDateString(),
        estado: "Pendiente"
    };

    fetch("/api/pedidos/addNewPedido", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        window.location.href = "/pedidos";
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Hubo un error al registrar la pizza.");
    });

});

document.addEventListener('DOMContentLoaded', () => {
    cargarPizzas();

    const rol = obtenerRolUsuario()
    

    // Crear y agregar el elemento para mostrar el precio total
    const totalElement = document.createElement('p');
    totalElement.id = 'total-precio';
    totalElement.textContent = 'Total: 0.00€';
    document.getElementById('pedido-container').appendChild(totalElement);
});


function obtenerRolUsuario() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token almacenado");
        }

        // Decodificar el payload del token
        user = JSON.parse(atob(token.split(".")[1])).sub
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        console.log("Payload del token:", tokenPayload);

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