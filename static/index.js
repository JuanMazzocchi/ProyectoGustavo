const btnsConfirm = document.querySelectorAll("#btnBorrar")

if (btnsConfirm.length){
    for(const btn of btnsConfirm){
       btn.addEventListener("click", Event => {
           console.log(Event)
         const resp= confirm("Esta opcion no tiene marcha atras. Confirma?")
           if (!resp) {
               Event.preventDefault()
           }
       }) 
    }
    
};

const abrirCarrito = document.getElementById('carrito');
abrirCarrito.addEventListener('click', modalCarrito);

const cierraCarro = document.getElementById('BtnCerrarCarrito');
cierraCarro.addEventListener('click', cerrarCarro);

const botonAñadirProducto = document.querySelectorAll('.btnAñadirAlCarrito');
botonAñadirProducto.forEach(addTocartbutton => {
    addTocartbutton.addEventListener('click', addToCartBtnClicked);
    });
const contenedorCarrito = document.getElementById('modalCarrito');

const btnVaciarCarro = document.getElementById('vaciarCarrito');
btnVaciarCarro.addEventListener('click', btnVaciarClicked);

// const borrarProductoCarro = document.querySelectorAll('.btnBorrarProducto');
// console.log(borrarProductoCarro);
// borrarProductoCarro.forEach(borroProducto => {
//     borroProducto.addEventListener('click', borrarProductoCarroClicked);
// });

function addToCartBtnClicked(event){
    const boton = event.target;
    const item = boton.closest('.item');

    const itemCodigo = item.querySelector('.item-codigo').textContent;
    const itemImage = item.querySelector('.item-image').src;
    const itemDescripcion = item.querySelector('.item-descripcionProducto').textContent;
    const itemPrecio= item.querySelector(".item-precioProducto").textContent;
    const itemUnidad = item.querySelector('.item-unidadDeVenta').textContent;
    const itemCantidad = 1 //default

    infoProducto ={id:itemCodigo,imagen:itemImage,descripcion:itemDescripcion,precio:itemPrecio,unidad:itemUnidad,cantidad:itemCantidad};
     
    addToCarrito(infoProducto)
}

function addToCarrito(infoProducto){
    let productosEnStorage;
    productosEnStorage=obtenerProductosLS();
    let indice=0; 
    let productoModificado;
    if (productosEnStorage.length!=0){
        for(let i=0;i<productosEnStorage.length;i++){
                        
            if (productosEnStorage[i].id === infoProducto.id){
                indice = productosEnStorage[i];
                console.log('igualdad de id entre : '+ productosEnStorage[i].id +" y "+infoProducto.id)
            }else{
                console.log('desigual ' + productosEnStorage[i].id)
            }
        };
       if (indice!=0){
        indice.cantidad+=1;
        console.log('envio a guardar producto con cantidad modificada');
        guardarEnLS(indice);
        

       }else{
        console.log('envio a guardar producto nuevo');
        guardarEnLS(infoProducto);
       }

    }
    else{
        console.log("guardo default");  // solo si no hay nada cargado
        guardarEnLS(infoProducto);
    };
};

function arregladora(item){
    const filaCarrito= document.createElement('div');
    filaCarrito.setAttribute('id','listadoItems')
    const contenidoCarrito= `<div class="row articulos justify-content-center listado contenedor" >
    <div class="col-1 art mw-100 no-gutters text-center">
      <p  class="item-codigo">${item.id}</p>
    </div>
    <div class="col-3 art no-gutters text-center "  >
      <p class="item-descripcionProducto">${item.descripcion}</p>
    </div>
    <div class="col-1 art mw-100 no-gutters text-center">
      <p class="item-precioProducto">${item.precio}</p>
    </div>
    <div class="col-1 art mw-100 no-gutters text-center">
      <p class="item-unidadDeVenta">${item.unidad}</p>
    </div>
    <div class="col-1 art mw-100 no-gutters text-center">
      <p class="item-Cantidad">${item.cantidad}</p><button class="btn btn-danger btnBorrarProducto" title="Quitar del Carro">X</button>
    </div>
    </div> `;
    filaCarrito.innerHTML=contenidoCarrito;
    contenedorCarrito.append(filaCarrito);
    
 };

function guardarEnLS(productoAlStorage){
   
    let productos;
    productos =this.obtenerProductosLS();
    
    let cambiocantidad = false

    for (let i =0; i < productos.length; i++){
        if (productos[i].id === productoAlStorage.id){
            productos.splice([i], 1);
            productos.push(productoAlStorage);
            localStorage.setItem('productos', JSON.stringify(productos));
            console.log('cambio cantidad y finalizo guardado en LS');
            cambiocantidad = true
            break
        };
    };
    if (cambiocantidad===false){
        productos.push(productoAlStorage);
        localStorage.setItem('productos', JSON.stringify(productos))
        console.log('guardado producto nuevo en LS') ;
    };
    if (productos.length===0) { 
        console.log('default')
        productos.push(productoAlStorage);
        localStorage.setItem('productos', JSON.stringify(productos));
    };
    cerrarCarro();
   };

function obtenerProductosLS(){
    let productoLS;
      if(localStorage.getItem('productos')=== null){
            productoLS = [];
        }
        else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        };
        return productoLS
};

function modalCarrito(){

   let modal=document.getElementById('todoElCarro');
   if(modal.style.display === 'block'){
    alert("El Carrito ya está abierto");
   }
   else {
    if (localStorage.getItem('productos') === null){
        alert("El Carrito esta Vacio");
      
    }else{ 
        let productosEnElCarro;
        productosEnElCarro =obtenerProductosLS();
        productosEnElCarro.forEach(arregladora);
        modal.style.display="block";
    };
        };
    const borrarProductoCarro = document.querySelectorAll('.btnBorrarProducto');
    // console.log(borrarProductoCarro);
    borrarProductoCarro.forEach(borroProducto => {
    borroProducto.addEventListener('click', borrarProductoCarroClicked);
    });
    };


function cerrarCarro(){
   let carroCompleto=document.getElementById('todoElCarro');
   let modal=document.getElementById('modalCarrito');
   carroCompleto.style.display="none";
   modal.innerHTML = "";
};

function btnVaciarClicked(){
    localStorage.clear();
    cerrarCarro();
};


function modificarCantidad(modificado){
    let productosEnStorage;
    productosEnStorage=obtenerProductosLS();
    // console.log("esta es la cantidad del producto modificado "+modificado.cantidad);

    for(let i = 0 ; i<=productosEnStorage.length ; i++){
        
        if (productosEnStorage[i].id === modificado.id){
            console.log('producto en LS'+ productosEnStorage[i]);
            // console.log('se borro '+ productosEnStorage[i]);
            break
        };
    };
    
    guardarEnLS(productosEnStorage);
};

function borrarProductoCarroClicked(event){
     
    let btn = event.target;
    let prodABorrar = btn.closest('.contenedor');
    
    let itemCodigo= prodABorrar.querySelector('.item-codigo').textContent;

    let productos;
    productos =obtenerProductosLS();

    for(let i =0; i < productos.length; i++){
        if(productos[i].id===itemCodigo){
            console.log('producto '+productos[i].id+' borrandose' );
            productos.splice([i], 1);
            localStorage.setItem('productos', JSON.stringify(productos));
            console.log("borrado");
            cerrarCarro();
            modalCarrito();
        };
    };
};
