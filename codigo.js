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
	var tbody = document.getElementById("tbody"), nfila = 0;
	tbody.innerHTML = "";
	var catcode;
	for (i = 0; i < num; i++) {
		tbody.innerHTML += fila;
		// Agregar botón de eliminación en cada fila
		const eliminarBtn = document.createElement("button");
		eliminarBtn.innerText = "Eliminar";
		eliminarBtn.onclick = () => eliminarProducto(productos[nfila].id);
		tbody.rows[nfila].appendChild(eliminarBtn);
	}
	var tr;
	ids = document.getElementsByClassName("id");
	titles = document.getElementsByClassName("title");
	descriptions = document.getElementsByClassName("description");
	categories = document.getElementsByClassName("category");
	fotos = document.getElementsByClassName("foto");
	prices = document.getElementsByClassName("price");
	if (orden === 0) { orden = -1; precio.innerHTML = "Precio" }
	else
		if (orden == 1) { ordenarAsc(productos, "price"); precio.innerHTML = "Precio A"; precio.style.color = "darkgreen" }
		else
			if (orden == -1) { ordenarDesc(productos, "price"); precio.innerHTML = "Precio D"; precio.style.color = "blue" }


	listado.style.display = "block";
	for (nfila = 0; nfila < num; nfila++) {
		ids[nfila].innerHTML = productos[nfila].id;
		titles[nfila].innerHTML = productos[nfila].title;
		descriptions[nfila].innerHTML = productos[nfila].description;
		categories[nfila].innerHTML = productos[nfila].category;
		catcode = codigoCat(productos[nfila].category);
		tr = categories[nfila].parentElement;
		tr.setAttribute("class", catcode);
		prices[nfila].innerHTML = "$" + productos[nfila].price;
		fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
		fotos[nfila].firstChild.setAttribute("onclick", "window.open('" + productos[nfila].image + "');");
	}
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