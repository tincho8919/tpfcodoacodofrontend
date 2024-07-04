const { createApp } = Vue
createApp({
    data() {
        return {
            productos: [],
            url: 'https://userpython24178.pythonanywhere.com/productos',
            error: false,
            cargando: true,
            compraExitosa: false,
            id: 0,
            nombre: "",
            imagen: "",
            stock: 0,
            precio: 0,
            tipo:"",
        }
    },
    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.productos = data;
                    this.cargando = false;
                })
                .catch(err => {
                    console.error(err);
                    this.error = true;
                    this.cargando = false;
                });
        },
        eliminar(id) {
            const url = this.url + '/' + id;
            var options = {
                method: 'DELETE',
            }
            fetch(url, options)
                .then(res => res.text()) // or res.json()
                .then(res => {
                    this.fetchData(this.url);
                })
                .catch(err => {
                    console.error(err);
                    this.error = true;
                });
        },
        grabar() {
            let producto = {
                nombre: this.nombre,
                precio: this.precio,
                stock: this.stock,
                imagen: this.imagen,
                tipo:this.tipo
            };
            var options = {
                body: JSON.stringify(producto),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            };
            fetch(this.url, options)
                .then(() => {
                    alert("Registro grabado");
                    window.location.href = "./productos.html";
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al grabar");
                });
        },
        modificar() {
            let producto = {
                nombre: this.nombre,
                precio: this.precio,
                stock: this.stock - 1,
                imagen: this.imagen,
                tipo:this.tipo
            };
            var options = {
                body: JSON.stringify(producto),
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            };
            fetch(this.url + "/" + location.search.substr(4), options)
                .then(() => {
                    alert("Registro modificado");
                    window.location.href = "./productos.html";
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al modificar");
                });
        },
        async comprar(id) {
            const url = this.url + '/' + id;
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.id = data.id;
                    this.nombre = data.nombre;
                    this.imagen = data.imagen;
                    this.stock = data.stock;
                    this.precio = data.precio;
                    this.tipo = data.tipo;
                })
                .catch(err => {
                    console.error(err);
                    this.error = true;
                });

            let producto = {
                nombre: this.nombre,
                precio: this.precio,
                stock: this.stock - 1,
                imagen: this.imagen,
                tipo:this.tipo
            };
            var options = {
                body: JSON.stringify(producto),
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            };
            fetch(this.url + "/" + id, options)
                .then(() => {
                    this.compraExitosa = true;
                    setTimeout(() => {
                        this.compraExitosa = false;
                    }, 5000);
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al realizar la compra");
                });
        }
    },
    created() {
        let url;
        if (location.search.substr(4) === "") // si no viene de la modificación
            url = this.url;
        else
            url = this.url + "/" + location.search.substr(4);  // para la modificación
        // si viene de la modificación le agrego "/<id>" del producto

        this.fetchData(url);
    },
}).mount('#app');




