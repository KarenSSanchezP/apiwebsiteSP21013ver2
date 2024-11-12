/* Universidad de El Salvador
Nombre: Karen Stefany Sánchez Pocasangre
Carnet: SP21013
Grupo: 7
*/
var fila = "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td></tr>";
var productos = null;
function codigoCat(catstr) {
	var code = "null";
	switch (catstr) {
		case "electronicos": code = "c1"; break;
		case "joyeria": code = "c2"; break;
		case "caballeros": code = "c3"; break;
		case "damas": code = "c4"; break;
	}
	return code;
}
var orden = 0;


function listarProductos(productos) {
    var precio = document.getElementById("price");
    precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
    var num = productos.length;
    var listado = document.getElementById("listado");
    var ids, titles, prices, descriptions, categories, fotos;
    var tbody = document.getElementById("tbody");
    tbody.innerHTML = ""; // Limpia el contenido previo de la tabla

    if (orden === 0) { 
        orden = -1; 
        precio.innerHTML = "Precio"; 
    } else if (orden == 1) { 
        ordenarAsc(productos, "price"); 
        precio.innerHTML = "Precio A"; 
        precio.style.color = "darkgreen"; 
    } else if (orden == -1) { 
        ordenarDesc(productos, "price"); 
        precio.innerHTML = "Precio D"; 
        precio.style.color = "blue"; 
    }

    // Crear filas para cada producto
    productos.forEach((producto, nfila) => {
        const fila = tbody.insertRow(); // Crear una nueva fila

        // Agregar celdas para los datos del producto
        const celdaId = fila.insertCell();
        celdaId.className = "id";
        celdaId.textContent = producto.id;

        const celdaFoto = fila.insertCell();
        celdaFoto.className = "foto";
        celdaFoto.innerHTML = `<img src="${producto.image}" onclick="window.open('${producto.image}');" style="width:50px;height:50px;">`;

        const celdaPrecio = fila.insertCell();
        celdaPrecio.className = "price";
        celdaPrecio.textContent = `$${producto.price}`;

        const celdaTitle = fila.insertCell();
        celdaTitle.className = "title";
        celdaTitle.textContent = producto.title;

        const celdaDescription = fila.insertCell();
        celdaDescription.className = "description";
        celdaDescription.textContent = producto.description;

        const celdaCategory = fila.insertCell();
        celdaCategory.className = "category";
        celdaCategory.textContent = producto.category;

        // Agregar una celda para el botón "Eliminar"
        const celdaEliminar = fila.insertCell();
        const eliminarBtn = document.createElement("button");
        eliminarBtn.innerText = "Eliminar";
        eliminarBtn.onclick = () => eliminarProducto(producto.id);
        celdaEliminar.appendChild(eliminarBtn);
    });

    listado.style.display = "block"; // Muestra el listado de productos
}

function obtenerProductos() {
	fetch('https://retoolapi.dev/r46XHt/productos')
		.then(res => res.json())
		.then(data => { 
			productos = data; 
			productos.forEach(
				function(producto){
					producto.price=parseFloat(producto.price)
				}
			);
			listarProductos(data) })
}

// Agregar producto
async function agregarProducto(event) {
	event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

	const nuevoProducto = {
		title: document.getElementById("nombre").value,
		price: parseFloat(document.getElementById("precio").value),
		description: document.getElementById("descripcion").value,
		image: document.getElementById("imagen").value,
		category: document.getElementById("categoria").value
	};

	try {
		const response = await fetch("https://retoolapi.dev/r46XHt/productos", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(nuevoProducto)
		});
		const data = await response.json();
		console.log("Producto agregado:", data);

		// Limpiar el formulario
		document.getElementById("nombre").value = "";
		document.getElementById("precio").value = "";
		document.getElementById("descripcion").value = "";
		document.getElementById("imagen").value = "";
		document.getElementById("categoria").value = "";

		// Actualizar la lista de productos
		obtenerProductos();
	} catch (error) {
		console.error("Error al agregar el producto:", error);
	}
}

// Eliminar producto
async function eliminarProducto(id) {
	try {
		const response = await fetch(`https://retoolapi.dev/r46XHt/productos/${id}`, {
			method: "DELETE"
		});

		if (response.ok) {
			console.log(`Producto con ID ${id} eliminado.`);
			obtenerProductos();
		} else {
			console.error("Error al eliminar el producto:", response.statusText);
		}
	} catch (error) {
		console.error("Error al eliminar el producto:", error);
	}
}

function ordenarDesc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return -1;
		if (a[p_key] < b[p_key]) return 1;
		return 0;
	});
}

function ordenarAsc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return 1;
		if (a[p_key] < b[p_key]) return -1;
		return 0;
	});
}