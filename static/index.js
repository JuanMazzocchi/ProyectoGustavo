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
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
const modBoot = document.getElementById('btnModalBoot');
modBoot.addEventListener('click', carroBoot);
const modalcontent = document.getElementById('modalBootstrap');

const botonAñadirProducto = document.querySelectorAll('.btnAñadirAlCarrito');
botonAñadirProducto.forEach(addTocartbutton => {
    addTocartbutton.addEventListener('click', addToCartBtnClicked);
    });
const contenedorCarrito = document.getElementById('modalCarrito');

const btnVaciarCarro = document.getElementById('vaciarCarrito');
btnVaciarCarro.addEventListener('click', btnVaciarClicked);

const titulos=` <div class="row justify-content-center titulares">
<div class="col-1 mw-100 text-center">
  <p>Codigo</p>
</div>
<div class="col-3 text-center"  >
  <p>Descripcion</p>
</div>
<div class="col-1 mw-100 text-center">
  <p>Precio</p>
</div>
<div class="col-1 mw-100 text-center">
  <p>Cantidad</p>
</div>
<div class="col-1 mw-100 text-center">
  <p>Quitar</p>
</div>
<div class="col-1 mw-100 text-center">
  <p>SubTotal Producto</p>
</div>
</div>`;

const btnPedido=document.getElementById('btnEnviarPedido');
btnPedido.addEventListener('click', btnPedidoClicked);

const btnVolver=document.getElementById('btnVolver');
btnVolver.addEventListener('click', btnVolverClicked);

// const btnSeleccion=document.querySelectorAll('.seleccion');
// btnSeleccion.forEach(seleccion =>{
//     seleccion.addEventListener('click',cantidadDefault
//     )
// });

 


 

function carroBoot(){
    let productosEnElCarro;
    productosEnElCarro =obtenerProductosLS();
    if(productosEnElCarro.length===0){
        modalcontent.innerHTML=`<div class="row justify-content-center" id="modalBootstrap"><h1>El Carro Esta Vacio</h1>
          
        </div>`;
    }
    else{
    modalcontent.innerHTML="";
    modalcontent.innerHTML=titulos;
    productosEnElCarro.forEach(arregladora);
    const borrarProductoCarro = document.querySelectorAll('.btnBorrarProducto');
    borrarProductoCarro.forEach(borroProducto => {
    borroProducto.addEventListener('click', borrarProductoCarroClicked);
    });

    const restarCantidadCarro = document.querySelectorAll('.restaCantidad');
    restarCantidadCarro.forEach(restarProducto =>{
        restarProducto.addEventListener('click', btnRestarCantidadClicked)
    });
    const sumarCantidadCarro = document.querySelectorAll('.sumaCantidad');
    sumarCantidadCarro.forEach(sumarProducto=>{
        sumarProducto.addEventListener('click', btnSumarCantidadClicked);
    });
    totalCarro();}

}
 

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
     
    addToCarrito(infoProducto);
    
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
                // console.log('igualdad de id entre : '+ productosEnStorage[i].id +" y "+infoProducto.id)
            }else{
                // console.log('desigual ' + productosEnStorage[i].id)
                continue
            }
        };
       if (indice!=0){
        indice.cantidad+=1;
        // console.log('envio a guardar producto con cantidad modificada');
        guardarEnLS(indice);
        

       }else{
        // console.log('envio a guardar producto nuevo');
        guardarEnLS(infoProducto);
       }

    }
    else{
       // console.log("guardo default");  // solo si no hay nada cargado
        guardarEnLS(infoProducto);
    };
    Toast.fire({
        icon: 'success',
        title: 'Producto añadido al Carro'
      })
    cantidadDefault(); 
};

function arregladora(item){
    const filaCarrito= document.createElement('div');
    const contenidoCarrito= `<div class="row articulos justify-content-center listado contenedor" >
    <div class="col-1 art mw-100 no-gutters text-center">
      <p  class="item-codigo">${item.id}</p>
    </div>
    <div class="col-3 art no-gutters text-center "  >
      <p class="item-descripcionProducto">${item.descripcion}</p>
    </div>
    <div class="col-1 art mw-100 no-gutters text-center">
      <p class="item-precioProducto"> ${item.precio}</p>
    </div>
    
    <div class="col-1 art mw-100 no-gutters text-center">
    <button class="btn btn-info restaCantidad" title="Disminuir">-</button><input class="cantidadInput" type="number" value=${item.cantidad} min="0" ><button class="btn btn-info sumaCantidad" title="Añadir">+</button>
    </div>
    <div class="col-1 art mw-100 no-gutters text-center">
    <button class="btn btn-danger btnBorrarProducto" title="Quitar del Carro">X</button>
    </div>
    <div class="col-1 art mw-100 no-gutters text-center">
      <p class="item-SubtotalProducto">$ ${(item.precio * item.cantidad).toFixed(2)}</p>
    </div>
    </div> `;
    filaCarrito.innerHTML=contenidoCarrito;
    modalcontent.append(filaCarrito);
        
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
            // console.log('cambio cantidad y finalizo guardado en LS');
            cambiocantidad = true
            break
        };
    };
    if (cambiocantidad===false){
        productos.push(productoAlStorage);
        localStorage.setItem('productos', JSON.stringify(productos))
        // console.log('guardado producto nuevo en LS') ;
    };
    if (productos.length===0) { 
        // console.log('default')
        productos.push(productoAlStorage);
        localStorage.setItem('productos', JSON.stringify(productos));
    };
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


function btnVaciarClicked(){
    localStorage.clear();
    totalCarro();
    modalcontent.innerHTML="";
    
};

function btnRestarCantidadClicked(event){
    let btn = event.target;
    let prodAModificar = btn.closest('.contenedor');
    let itemCodigo= prodAModificar.querySelector('.item-codigo').textContent;
    let itemCantidad =prodAModificar.querySelector('.cantidadInput').value;
    let productoModificado;
    let productos;
    productos =obtenerProductosLS();

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id===itemCodigo){

            if(productos[i].cantidad===1){
                continue
            }else{
            productoModificado=productos[i];
            productoModificado.cantidad=itemCantidad-1;
            productos.splice([i],1,productoModificado); //quita el array viejo y en su lugar pone el nuevo
            localStorage.setItem('productos', JSON.stringify(productos));
            carroBoot();
            totalCarro();
            
            };
        };
    };
};

function btnSumarCantidadClicked(event){
    let btn = event.target;
    let prodAModificar = btn.closest('.contenedor');
    let itemCodigo= prodAModificar.querySelector('.item-codigo').textContent;
    let itemCantidad =parseInt( prodAModificar.querySelector('.cantidadInput').value);
    let productoModificado;
    let productos;
    productos =obtenerProductosLS();

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id===itemCodigo){
            
            productoModificado=productos[i];
            productoModificado.cantidad=itemCantidad+1;
            productos.splice([i],1,productoModificado); //quita el array viejo y en su lugar pone el nuevo
            localStorage.setItem('productos', JSON.stringify(productos));
            carroBoot();
            totalCarro();
            
            };
        };
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
            carroBoot();
            totalCarro();
            
        };
    };
};
function totalCarro(){
    let productos;
    productos =obtenerProductosLS();
    let total=0;
    let totalDiv = document.getElementById('totalCarro');
    for (let i = 0; i < productos.length; i++) {
        // console.log(productos[i].precio*productos[i].cantidad);
        total=total+(parseFloat(productos[i].precio)*parseFloat(productos[i].cantidad));
    };
    let totalnumero =  `<p>Total Pedido: $ ${total.toFixed(2)} </p>`;
    totalDiv.innerHTML=totalnumero;
};
function cantidadDefault(){
    
     
     
    var myElement=document.querySelectorAll('.cantidadDefault');
    if(myElement.length!=0){
        let productos;
        productos =obtenerProductosLS();
        let codigos=document.querySelectorAll('.item-codigo');
        myElement.forEach(element=>{
            element.value=0
        });
      // codigos.forEach(element=>{console.log("supuesto codigo en pantalla"+element.textContent)})
        productos.forEach(element => {
            for (let i = 0; i < codigos.length; i++) {
               if(element.id===codigos[i].textContent){
                // console.log("codigo en pantalla "+codigos[i].textContent+ " codigo producto "+ element.id)
                if(document.getElementById(element.id)){
                    document.getElementById(element.id).value=element.cantidad;
                }

                }else{
                    continue    
                };

            }
        });
};};  

//  INDEX.HTML
function volver(){
    var contenedor=document.getElementById("container");
    contenedor.style.display = 'block';
    document.getElementById("volver").style.display = 'none';
    document.getElementById("cuadro").innerHTML="";
};

function mostrarSanitarios(event){
    var id = event.currentTarget.getAttribute("id")
  //  console.log(id)
    var rubros = document.getElementsByClassName(id);

   // console.log(rubros)
    var contenedor=document.getElementById("container");
   // console.log(contenedor)
    contenedor.style.display = 'none';
    document.getElementById("cuadro").innerHTML = rubros[0].innerHTML;
    document.getElementById("volver").style.display = 'block';
};

var pedidoTotal=document.getElementById('terminarPedido');

function btnPedidoClicked(){
    // let productos;
    // productos =obtenerProductosLS();
    // productos.forEach(acomodadorDePedido);
    pedidoTotal.style.display="block";
    document.getElementById('botonesEnviar').style.display="none";
    // document.getElementById('totalCarro').style.display="none"
};

function btnVolverClicked(){
    pedidoTotal.style.display="none";
    document.getElementById('botonesEnviar').style.display="flex";

};

$("#exampleModal").on("hidden.bs.modal", function () {           //actualizador de cantidades cuando se cierra el modal
    // console.log("your hacking is funquing")
    cantidadDefault();
});





function acomodadorDePedido(item){
    
    const divPedido=document.createElement('div');              //NO ESTA EN USO
    let itemPedido;
      
    itemPedido=`<div> Codigo: ${item.id} Producto: ${item.descripcion} Cantidad: ${item.cantidad} SubTotal: ${(item.precio * item.cantidad).toFixed(2)}</div> `;
    divPedido.innerHTML=itemPedido
    pedidoTotal.append(divPedido)
};


 
totalCarro();

