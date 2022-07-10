

# from distutils.log import error
from flask import Flask
from flask import render_template,request,redirect,url_for,send_from_directory,flash
from flaskext.mysql import MySQL
from datetime import datetime
import os

from pymysql.cursors import DictCursor

app = Flask(__name__)
mysql=MySQL()

app.config['MYSQL_DATABASE_HOST']='localhost'
app.config['MYSQL_DATABASE_USER']='root'
app.config['MYSQL_DATABASE_PASSWORD']=''
app.config['MYSQL_DATABASE_DB']='gustavo'
# app.config['SECRET_KEY']='sanchez'

UPLOADS=os.path.join('uploads')
app.config['UPLOADS'] = UPLOADS    

mysql.init_app(app)

conn=mysql.connect()
cursor=conn.cursor(cursor=DictCursor)

@app.route('/')
def index():
    return render_template('productos/index.html')

 


@app.route('/admin', methods=['POST'])
def admin():
    
    _Usuario=request.form['Usuario']
    _Password=request.form['Password']
    
    if _Usuario == 'nuria' and _Password =='supertop':
        return render_template('productos/ingresoProd.html')
    else:
        #aca hay que poner la opcion de usuario        
        return redirect('/')
    
@app.route('/isAdmin')
def isAdmin():
    return render_template('productos/ingresoProd.html')   


@app.route('/store', methods=['POST'])
def storage():
    _codigo=request.form['txtCodigo']
    _linea=request.form['txtLinea']
    _codlinea=request.form['txtCodLinea']
    _ordlinea=request.form['txtOrdenLinea']
    _rubro=request.form['txtRubro']
    _codrubro=request.form['txtCodRubro']
    _ordrubro=request.form['txtOrdenRubro']
    _descripcion=request.form["txtDescripcion"]
    _precio=request.form['txtPrecio']
    _unidad=request.form['txtUnidad']
    
    _foto=request.files['txtFoto']
    
    # if _nombre =="" or _producto=="":
    #     flash('El Nombre y tipo de Producto son Obligatorios')
    #     return redirect(url_for('admin'))
    
    # now=datetime.now()
    # tiempo= now.strftime("%Y%H%M%S")  
    if _foto.filename!="":
        # nuevoNombreFoto= tiempo +"_"+ _foto.filename
        _foto.save("uploads/"+_foto.filename)
        
    # sql="INSERT INTO productos(Producto,Nombre,Foto) VALUES (%s,%s,%s);"
    # datos=(_producto,_nombre,nuevoNombreFoto)
    datos=(_codigo,_linea,_codlinea,_ordlinea,_rubro,_codrubro,_ordrubro,_descripcion,_precio,_unidad,_foto.filename)
    sql="INSERT INTO gustavo.web(`cod producto`, linea,`cod linea`,`orden linea`,rubro ,`cod rubro`, `orden rubro`, descripcion, pcio_lista, unidad , imagen) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)";
    cursor.execute(sql,datos)
    conn.commit()
    
    
    return render_template('productos/ingresoProd.html')


@app.route('/userpic/<path:nombreFoto>')
def uploads(nombreFoto):
    return send_from_directory(os.path.join('uploads'),nombreFoto)

@app.route('/seleccion', methods=['POST'] )
def seleccion():
    _rubro=request.form['Name']
    # print(_rubro)
    # id ='ABRAZADERAS'
    # sql ="SELECT * FROM  `gustavo`.`web` WHERE rubro=%s", (id); 
    # sql=f"SELECT * FROM gustavo.web WHERE rubro={id}";
    sql=f"SELECT * FROM gustavo.web WHERE  rubro = '{_rubro}' LIMIT 0, 1000";

    conn=mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql)
    articulos=cursor.fetchall()
    # print(articulos)
    conn.commit()
    return render_template('seleccionados.html', articulos=articulos )
    
    
@app.route('/mono', methods=['GET'])
def mono():
    sql="SELECT Producto FROM productos GROUP BY Producto;"
    cursor.execute(sql)
    tipos=cursor.fetchall()
    
    return render_template('/productos/seleccion.html', tipos=tipos)

@app.route('/borra')
def borra():
    sql="SELECT Producto FROM productos GROUP BY Producto;"
    cursor.execute(sql)
    tipos=cursor.fetchall()
    
    return render_template('/productos/seleccionBorrar.html', tipos=tipos)
     
@app.route('/selborra', methods=['POST'] )
def selborra():
    _producto=request.form['tipoProducto']
     
    sql=f"SELECT * FROM productos WHERE Producto='{_producto}'"
    
    cursor.execute(sql)
    productos=cursor.fetchall()
        
    return render_template('seleccionadosBorrar.html', productos=productos)


@app.route('/modify/<int:Id>')
def modify(Id):
    sql=f"SELECT * FROM productos WHERE Id={Id}"
    cursor.execute(sql)
    item=cursor.fetchone()
    
    return render_template('/productos/edit.html', item=item)


@app.route('/update', methods=['POST'])
def update():
    
    _nombre=request.form['txtNombre']
    _producto=request.form['txtProducto']
    _foto=request.files['txtFoto']
    id=request.form['txtId']
    
        
    if _foto.filename!='':
        
       #SI CAMBIA LA FOTO
       sql=f"SELECT Foto from productos WHERE ID={id}"
       cursor.execute(sql)
       
       nombrefotovieja=cursor.fetchone()['Foto']
           
       try:
            os.remove(os.path.join(app.config['UPLOADS'],nombrefotovieja))

       except:
           print(f"error, no se pudo borrar la foto :  {nombrefotovieja}")
           pass
       
                    
       sql=f"UPDATE productos SET Nombre='{_nombre}', Producto='{_producto}' WHERE Id={id}"
       cursor.execute(sql)
       conn.commit()
         # aca se cargan TODOS los datos nuevos
                
       now =datetime.now()
       tiempo = now.strftime("%Y%H%M%S")
       nuevoNombreFoto=tiempo+"_"+_foto.filename 
       _foto.save("uploads/"+nuevoNombreFoto)
       
       sql=f"UPDATE productos SET Foto='{nuevoNombreFoto}' WHERE ID={id}" 
       cursor.execute(sql)
       conn.commit()
         
    else:
         #SI NO CAMBIA LA FOTO
         
        sql=f"UPDATE productos SET Nombre='{_nombre}', Producto='{_producto}' WHERE Id={id}"
         
        cursor.execute(sql)
        conn.commit()
       
    return redirect('/borra')         
       
       
@app.route('/delete/<int:Id>')       #esta funcionando confirmando mediante JS
def delete(Id):
    # flash('Realmente quiere borrar ese articulo?')
    sql=f"DELETE from productos WHERE Id={Id}"
    cursor.execute(sql)
    conn.commit()
    
    # return render_template('seleccionadosBorrar.html', error=error)
           
   
    return redirect('/borra')
       
       
       
       
       
       
    

if __name__=='__main__':
    app.run(debug=True)