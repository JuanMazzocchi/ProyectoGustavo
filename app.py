

# from distutils.log import error
from flask import Flask
from flask import render_template,request,redirect,url_for,send_from_directory,flash
from flaskext.mysql import MySQL
from datetime import datetime
import os

from pymysql.cursors import DictCursor
from sqlalchemy import text

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
    sql="SELECT DISTINCT linea FROM gustavo.web;"
    cursor.execute(sql)
    lineas=cursor.fetchall()
    print(lineas)
    
    return render_template('productos/index.html',lineas=lineas)

 


@app.route('/admin', methods=['POST'])
def admin():
    
    _Usuario=request.form['Usuario']
    _Password=request.form['Password']
    
    if _Usuario == 'gustavo' and _Password =='1234':
        return render_template('productos/adminMain.html')
    else:
              
        return redirect('/')
    
@app.route('/isAdmin')
def isAdmin():
    return render_template('productos/ingresoProd.html')   


@app.route('/store', methods=['POST'])
def storage():
    _codigo=request.form['txtCodigo']
    _linea=request.form['txtLinea']
    _rubro=request.form['txtRubro']
    _descripcion=request.form["txtDescripcion"]
    _precio=request.form['txtPrecio']
    _unidad=request.form['txtUnidad']
    _foto=request.files['txtFoto']
        
    if _foto.filename!="":
        _foto.save("uploads/"+_foto.filename)
       
    datos=(_codigo,_linea,_rubro,_descripcion,_precio,_unidad,_foto.filename)
    sql="INSERT INTO gustavo.web(`cod producto`, linea,rubro , descripcion, pcio_lista, unidad , imagen) VALUES (%s,%s,%s,%s,%s,%s)";
    cursor.execute(sql,datos)
    conn.commit()
    
    
    return render_template('productos/ingresoProd.html')


@app.route('/userpic/<path:nombreFoto>')
def uploads(nombreFoto):
    return send_from_directory(os.path.join('uploads'),nombreFoto)

@app.route('/seleccion', methods=['POST'] )
def seleccion():
    _linea=request.form['Name']
    sql=f"SELECT DISTINCT rubro FROM gustavo.web WHERE linea='{_linea}';"
   
    conn=mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql)
    rubros=cursor.fetchall()
    # print(rubros)
    # print(rubros[0][0])
    conn.commit()
    
    imagenes=[]
    # for item in rubros:
    #     print(item[0])
    #     sql=f"SELECT imagen from gustavo.web where rubro='{item[0]}' limit 1"
    #     cursor = conn.cursor()
    #     cursor.execute(sql)
    #     imagenes.append(cursor.fetchall())
        
        
    # print(imagenes)    
    
    sql="SELECT DISTINCT linea FROM gustavo.web;"
    cursor=conn.cursor(cursor=DictCursor)
    cursor.execute(sql)
    lineas=cursor.fetchall()
    print(lineas)
        
        
        
    
    
    return render_template('lineaseleccionada.html', rubros=rubros, linea=_linea,lineas=lineas )

@app.route('/rubros', methods=['POST'])
def rubros():
    _rubro=request.form['Name']
    sql=f"SELECT * FROM gustavo.web WHERE rubro = '{_rubro}';"
    conn=mysql.connect()
    cursor = conn.cursor()
    cursor.execute(sql)
    articulos=cursor.fetchall()
    return render_template('seleccionados.html', articulos=articulos)
    
    
@app.route('/mono', methods=['POST'])
def mono():
    _palabraBuscar=request.form['palabraBuscar']
    sql=f"SELECT * FROM gustavo.web WHERE `cod producto` LIKE '%{_palabraBuscar}%' OR descripcion LIKE '%{_palabraBuscar}%' ORDER BY linea LIMIT 0, 1000;"
    cursor.execute(sql)
    busqueda=cursor.fetchall()
    
    
    return render_template('seleccionbusqueda.html',  busqueda=busqueda )

@app.route('/monoAdmin', methods=['POST'])
def monoAdmin():
    _palabraBuscar=request.form['palabraBuscar']
    sql=f"SELECT * FROM gustavo.web WHERE `cod producto` LIKE '%{_palabraBuscar}%' OR descripcion LIKE '%{_palabraBuscar}%' ORDER BY linea LIMIT 0, 1000;"
    cursor.execute(sql)
    productos=cursor.fetchall()
        
    return render_template( 'seleccionadosBorrar.html', productos=productos )

@app.route('/borra')
def borra():
    
    sql="SELECT DISTINCT linea FROM gustavo.web;"
    cursor.execute(sql)
    tipos=cursor.fetchall()
    
    return render_template('/productos/seleccionBorrar.html', tipos=tipos)
     
@app.route('/selborra', methods=['POST'] )
def selborra():
    _producto=request.form['tipoProducto']
     
    sql=f"SELECT `cod producto`,rubro,descripcion, imagen FROM gustavo.web WHERE linea='{_producto}' order by rubro"
    
    cursor.execute(sql)
    productos=cursor.fetchall()
        
    return render_template('seleccionadosBorrar.html', productos=productos)


@app.route('/modify/<float:Id>')
def modify(Id):
    
    sql=f"SELECT * FROM gustavo.web WHERE `cod producto`={Id}"
    cursor.execute(sql)
    item=cursor.fetchone()
    print(item)
    
    return render_template('/productos/edit.html', item=item)


@app.route('/update', methods=['POST'])
def update():
    
    _codigo=request.form['txtCodigo']
    _linea=request.form['txtLinea']
    _rubro=request.form['txtRubro']
    _descripcion=request.form["txtDescripcion"]
    _precio=request.form['txtPrecio']
    _unidad=request.form['txtUnidad']
    
    _foto=request.files['txtFoto']
    
        
    if _foto.filename!='':
        
       #SI CAMBIA LA FOTO
       sql=f"SELECT imagen from gustavo.web WHERE `cod producto`={_codigo}"
       cursor.execute(sql)
       
       nombrefotovieja=cursor.fetchone()['imagen']
           
       try:
            os.remove(os.path.join(app.config['UPLOADS'],nombrefotovieja))

       except:
           print(f"error, no se pudo borrar la foto :  {nombrefotovieja}")
           pass
       
        
       _foto.save("uploads/"+_foto.filename)  
       imagen=_foto.filename
                 
       sql=f"UPDATE gustavo.web SET linea='{_linea}',rubro='{_rubro}',descripcion='{_descripcion}', pcio_lista='{_precio}', unidad='{_unidad}', imagen='{imagen}'  WHERE `cod producto`={_codigo}";
       cursor.execute(sql)
       conn.commit()
       
         # aca se cargan TODOS los datos nuevos
           
      
                
    else:
        #SI NO CAMBIA LA FOTO
        # datos=(_linea,_codlinea,_ordlinea,_rubro,_codrubro,_ordrubro,_descripcion,_precio,_unidad)
        # print(datos)
        # sql="UPDATE gustavo.web SET (linea,`cod linea`,`orden linea`,rubro ,`cod rubro`, `orden rubro`, descripcion, pcio_lista, unidad) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) WHERE `cod producto`='{_codigo}'";
        
        
        sql=f"UPDATE gustavo.web SET linea='{_linea}',rubro='{_rubro}',descripcion='{_descripcion}', pcio_lista='{_precio}', unidad='{_unidad}' WHERE `cod producto`='{_codigo}' limit 1";  
        cursor.execute(sql)
        conn.commit()
       
    return redirect('/borra')         
       
       
@app.route('/delete/<float:Id>')       #esta funcionando confirmando mediante JS
def delete(Id):
    # flash('Realmente quiere borrar ese articulo?')
    sql=f"SELECT imagen from gustavo.web WHERE `cod producto`={Id}"
    cursor.execute(sql)
       
    nombrefotovieja=cursor.fetchone()['imagen']
    nombreStr=str(nombrefotovieja)
    nombrefotoviejacompleto=str(nombreStr + ".jpg")
    
    try:
        os.remove(os.path.join(app.config['UPLOADS'],nombrefotoviejacompleto))

    except:
        print(f"error, no se pudo borrar la foto :  {nombrefotoviejacompleto}")
        pass
    
    
    sql=f"DELETE from gustavo.web WHERE `cod producto`={Id}"
    cursor.execute(sql)
    conn.commit()
    
    # return render_template('seleccionadosBorrar.html', error=error)
      
    return redirect('/borra')

@app.route('/actualizador')

def actualizador():
    return render_template('/productos/actualizador.html')
    
    
@app.route('/actualizarBase', methods=['POST'])       
def actualizandoBase():
    
    _base=request.files['baseActualizada']  
    _base.save("uploads/bd/"+_base.filename)            #grabo la base nueva en uploads/db
     
    
    
    sql=""" 
    LOAD DATA INFILE 'c:/users/juanm/downloads/LISTPROV.csv' 
    INTO TABLE gustavo.web
    character set latin1				#FUNCIONAN LAS ñ!!!!!!
    FIELDS TERMINATED BY '|'
    LINES TERMINATED BY '\n'
    ignore 1 lines
    (`cod producto`,linea,rubro,descripcion,pcio_lista,unidad,imagen)
    ;
    """
    
    
    
    
    
    
    cursor.execute(sql)
    conn.commit()
    
    
    
    return render_template('/productos/actualizador.html')


       
    

if __name__=='__main__':
    app.run(debug=True)