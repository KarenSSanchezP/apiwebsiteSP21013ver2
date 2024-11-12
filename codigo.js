/* Universidad de El Salvador
Nombre: Karen Stefany Sánchez Pocasangre
Carnet: SP21013
Grupo: 7
*/
var fila = "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='acciones'></td></tr>";
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
    tbody.innerHTML = ""; // Limpia la tabla antes de actualizarla

    var catcode;
    for (var i = 0; i < num; i++) tbody.innerHTML += fila;

    var tr;
    ids = document.getElementsByClassName("id");
    titles = document.getElementsByClassName("title");
    descriptions = document.getElementsByClassName("description");
    categories = document.getElementsByClassName("category");
    fotos = document.getElementsByClassName("foto");
    prices = document.getElementsByClassName("price");
    var acciones = document.getElementsByClassName("acciones");

    if (orden === 0) { orden = -1; precio.innerHTML = "Precio" }
    else if (orden == 1) { ordenarAsc(productos, "price"); precio.innerHTML = "Precio A"; precio.style.color = "darkgreen"; }
    else if (orden == -1) { ordenarDesc(productos, "price"); precio.innerHTML = "Precio D"; precio.style.color = "blue"; }

    listado.style.display = "block";
    for (var nfila = 0; nfila < num; nfila++) {
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

        // Añadir botón eliminar en cada fila
        var eliminarBtn = document.createElement("button");
        eliminarBtn.innerText = "Eliminar";
        eliminarBtn.onclick = function () { eliminarProducto(productos[nfila].id); };
        acciones[nfila].appendChild(eliminarBtn);
    }
}

function obtenerProductos() {
    fetch('https://retoolapi.dev/r46XHt/productos')
        .then(res => res.json())
        .then(data => { 
            productos = data;
            productos.forEach(producto => {
                producto.price = parseFloat(producto.price); // Asegurarse que el precio sea un número flotante
            });
            listarProductos(data); 
        });
}

// Eliminar producto
async function eliminarProducto(id) {
    try {
        // Hacer la solicitud DELETE a la API
        const response = await fetch(`https://retoolapi.dev/r46XHt/productos/${id}`, {
            method: "DELETE"
        });

        // Verificamos si la respuesta fue exitosa
        if (response.ok) {
            console.log(`Producto con ID ${id} eliminado.`);
            
            // Recargar los productos desde la API
            obtenerProductos();
        } else {
            console.error("Error al eliminar el producto:", response.statusText);
            alert("Hubo un problema al eliminar el producto.");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("Error en la conexión, no se pudo eliminar el producto.");
    }
}

// Agregar producto
function agregarProducto() {
    const titulo = document.getElementById("titulo").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const descripcion = document.getElementById("descripcion").value;
    const imagen = document.getElementById("imagen").value;
    const categoria = document.getElementById("categoria").value;

    if (!titulo || isNaN(precio) || !descripcion || !imagen || !categoria) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const nuevoProducto = {
        title: titulo,
        price: precio,
        description: descripcion,
        image: imagen,
        category: categoria
    };

    // Enviar el nuevo producto a la API usando POST
    fetch("https://retoolapi.dev/r46XHt/productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoProducto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al agregar el producto");
        }
        return response.json();
    })
    .then(data => {
        productos.push(data); // Agregar el producto a la lista local
        listarProductos(productos); // Actualizar la tabla
        alert("Producto agregado exitosamente.");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al agregar el producto.");
    });
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