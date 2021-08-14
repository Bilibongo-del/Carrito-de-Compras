document.addEventListener('DOMContentLoaded', function(){
    'use strick';
    //Variables 
    const VaciarCarrito = document.querySelector('#vaciar-carrito');
    const Eliminar = document.querySelector('#carrito');
    const ListaCursos = document.querySelector('#lista-cursos');
    const MostrarCurso = document.querySelector('#lista-carrito tbody');
    let CompraCarrito = [];
    //Listeners
    cargarListeners();
    function cargarListeners(){
        ListaCursos.addEventListener('click', agregarCarrito);
        Eliminar.addEventListener('click', eliminarCurso);
        VaciarCarrito.addEventListener('click', vaciarCarro);
        CompraCarrito = JSON.parse(localStorage.getItem('Curso')) || [];
        imprimirHTML();
    }
    //Funciones
    function agregarCarrito(e){
        e.preventDefault();
        if(e.target.classList.contains('agregar-carrito')){
            leerInformacion(e.target.parentElement.parentElement);
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'Se agregó correctamente'
              });
        }
    }
    function eliminarCurso(e){
        if(e.target.classList.contains('borrar-curso')){
           const Id = e.target.getAttribute('data-id');
           const ActualizaCarrito = CompraCarrito.filter(curso => {
               if(curso.cantidad > 1){
                   curso.cantidad--;
                   return curso;
               }
               else if(curso.id !== Id){
                    return curso;
               }
               
            });
           CompraCarrito = [...ActualizaCarrito]; 
           imprimirHTML();
        }
    }
    function vaciarCarro(e){
        e.preventDefault();
        if(CompraCarrito.length < 1){
            Swal.fire({
                icon: 'error',
                title: 'Alto!',
                text: 'Tu carrito esta vacio, selecciona un curso'
              });
        }
        else{
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })
            
            swalWithBootstrapButtons.fire({
                title: 'Estas seguro de vaciar el carrito?',
                text: "Esta accion no se puede revertir!",
                icon: 'Asvertencia',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Borradó!',
                    'El carrito ha sido vaciado',
                    'Exito'
                )
                CompraCarrito = [];
                resetearArreglo ();
                localStorage.clear();
                } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
                ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'Tu archivo imaginario esta a salvo :)',
                    'error'
                )
                }
            });
        }
        
        
    }
    function leerInformacion(Info){
        const InfoCurso = {
            imagen: Info.querySelector('img').src,
            titulo: Info.querySelector('h4').textContent,
            precio: Info.querySelector('p span').textContent,
            cantidad: 1,
            id: Info.querySelector('a').getAttribute('data-id')
        }
        const Existe = CompraCarrito.some(curso => curso.id === InfoCurso.id);
        if(Existe){
            const CarritoCurso = CompraCarrito.map(curso =>{
                if(curso.id === InfoCurso.id){
                    curso.cantidad++;
                    return curso;
                }
                else{
                    return curso;
                }
            });
            CompraCarrito = [...CarritoCurso];
        }
        else{
            CompraCarrito = [...CompraCarrito, InfoCurso];
        }
        imprimirHTML();
       
    }

    function imprimirHTML(){
        resetearArreglo();
        CompraCarrito.forEach(curso => {
            const {imagen, titulo, precio, cantidad, id} = curso;
            const Row = document.createElement('TR');
            Row.innerHTML = `
                <th><img src="${imagen}" class="adaptar-imagen">
                <th>${titulo}</th>
                <th>${precio}</th>
                <th>${cantidad}</th>
                <th><p class="borrar-curso" data-id="${id}">X</p></th>
            `;
            MostrarCurso.appendChild(Row);
        });
        sincronizarLocalStorage();
    }
    function resetearArreglo(){
        while(MostrarCurso.firstChild){
            MostrarCurso.removeChild(MostrarCurso.firstChild);
        }
    }
    
    function sincronizarLocalStorage(){
        localStorage.setItem('Curso', JSON.stringify(CompraCarrito));
    }

});