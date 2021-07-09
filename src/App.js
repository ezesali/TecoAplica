import React, {useEffect, useState} from 'react';
import { TextField, Grid, Select } from '@material-ui/core';
import IBMLogo from '../src/ibm-logo.webp';
import DragDrop from '../src/components/Drag&Drop';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { isMobile } from 'react-device-detect';
import sadFace from '../src/sadUnsupported.png';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function App(props) {

  //const [files, setfiles] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [errorInputName, seterrorInputName] = useState('');
  const [errorInputCRQ, seterrorInputCRQ] = useState('');
  const [errorInputVersion, seterrorInputVersion] = useState('');
  const [errorInputFrente, seterrorInputFrente] = useState('');
  const [errorInputComputerName, seterrorInputComputerName] = useState('');

  const [ComputerName, setComputerName] = useState('');
  const [Name, setName] = useState('');
  const [CRQ, setCRQ] = useState('');
  const [Frente, setFrente] = useState('');
  const [Version, setVersion] = useState('');
  const [myScriptFiles, setmyScriptFiles] = useState({});
  const [myPlsFiles, setmyPlsFiles] = useState({});
  const [myRbkPlsFiles, setmyRbkPlsFiles] = useState({});
  const [myRbkScriptFiles, setmyRbkScriptFiles] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [MsgFile, setMsgFile] = useState([]);
  
  useEffect(() => {
    //files.forEach((file) => URL.revokeObjectURL(file.preview)); 
    if (ComputerName.length > 0 && errorInputComputerName === '' && Name.length > 0 && errorInputName === '' && 
       CRQ.length > 0 && errorInputCRQ === '' && Frente.length > 0 && errorInputFrente === '' && Version.length > 0 && errorInputVersion === '' && 
       (myPlsFiles.length > 0 || myScriptFiles.length > 0) && (myRbkPlsFiles.length > 0 || myRbkScriptFiles.length > 0)){

      setDisableSubmit(false);
    }
    else{
      setDisableSubmit(true);
    }
  }, [ComputerName, errorInputComputerName, Name, errorInputName, CRQ, errorInputCRQ, Frente, errorInputFrente,Version, errorInputVersion,myScriptFiles,myPlsFiles, myRbkPlsFiles, myRbkScriptFiles]);

  function handleError(e) {    
    switch (e.target.name){
      case 'Aplicante':
        if (e.target.value === '' && e.target.required){
          seterrorInputComputerName('El '+ e.target.name + ' es requerido para crear la paquetizacion');
        }
        break;
      case 'Nombre':
        if (e.target.value === '' && e.target.required){
          seterrorInputName('El '+ e.target.name + ' es requerido para crear la paquetizacion');
        }
        break;
      case 'CRQ':
        if (e.target.value === '' && e.target.required){
          seterrorInputCRQ('El '+ e.target.name + ' es requerido para crear la paquetizacion');
        }
        break;
      case 'Frente':
        if (e.target.value === '' && e.target.required){
          seterrorInputFrente('El '+ e.target.name + ' es requerido para crear la paquetizacion');
        }
        break;
      case 'Version':
        //eslint-disable-next-line
        const regex = /^\d+\.\d+\.\d+$/;
        if (e.target.value === '' && e.target.required){
          seterrorInputVersion('La '+ e.target.name + ' es requerida para crear la paquetizacion');
        }
        else{
          if (regex.test(e.target.value)){
            seterrorInputVersion('')
          }
          else{
            seterrorInputVersion('Introduzca la version correctamente para crear la paquetizacion ');
          }
        }
        break;
      default:
        seterrorInputName('')
        seterrorInputCRQ('')
        seterrorInputFrente('')
        seterrorInputVersion('')
        seterrorInputComputerName('')
    }
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  function showAlert(){
    if (MsgFile.length > 1){
      return (
        <Dialog onClose={handleCloseAlert} open={openAlert}>
          <DialogTitle onClose={handleCloseAlert}>
            Error
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Los siguientes archivos no se pueden agregar ya que se agregaron anteriormente
              {MsgFile.map(function(file, i){
              return <li key={i}>"{file.path}"</li>
              })}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseAlert} color="primary">
              Entendido
            </Button>
          </DialogActions>
        </Dialog>
      )  
    }else if (MsgFile.length === 1){
      return (
        <Dialog onClose={handleCloseAlert} open={openAlert}>
          <DialogTitle onClose={handleCloseAlert}>
            Error
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              El archivo "{MsgFile[0].path}" no se puede agregar ya que se agrego anteriormente
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseAlert} color="primary">
              Entendido
            </Button>
          </DialogActions>
        </Dialog>
      )
    }
  }

  async function handleDriverText(TipoAplica) {
    
    const getDrvText = await fetch('./PaqStructure/FRENTE_CRQ_VERSION/APLICA/DRIVER.drv')

    const DrvText = await getDrvText.text()

    let textArray = DrvText.split('\n')

    for (var line=0; line < textArray.length;line++){

      if (textArray[line].includes('$NAME')){

        textArray[line] = textArray[line].replace('$NAME', Name.trim() )

      }

      if (textArray[line].includes('$DRIVER')){

        if (TipoAplica === 'ROLLBACK')

          textArray[line] = textArray[line].replace('$DRIVER', CRQ.trim() +'_ALL_01_Rollback' )
        else{

          textArray[line] = textArray[line].replace('$DRIVER', CRQ.trim() +'_ALL_01' )

        }

      }
      if (textArray[line].includes('$COPYFILES')){

        if (TipoAplica === 'APLICA'){

          let scriptAplica = '';

          if (myScriptFiles.length > 0){

            myScriptFiles.forEach((file) =>{

              scriptAplica = scriptAplica + '\ncopy c scripts ' + file.path;

            });

          }

          if(myPlsFiles.length > 0){

            myPlsFiles.forEach((file) =>{

              scriptAplica = scriptAplica + '\ncopy c pls ' + file.path;

            });

          }

          textArray[line] = textArray[line].replace('$COPYFILES',scriptAplica)

        } 
        else{

          let scriptRbk = '';

          if(myRbkPlsFiles.length > 0){

            myRbkPlsFiles.forEach((file) =>{

              scriptRbk = scriptRbk + '\ncopy c pls ' + file.path;

            });

          }


          if (myRbkScriptFiles.length > 0){

            myRbkScriptFiles.forEach((file) =>{

              scriptRbk = scriptRbk + '\ncopy c scripts ' + file.path;

            });

          }

          textArray[line] = textArray[line].replace('$COPYFILES',scriptRbk)
        }
        
      }
      if (textArray[line].includes('$SQLFILES')){

        if (TipoAplica === 'APLICA'){

          let scriptAplica = '';

          if (myScriptFiles.length > 0){

            myScriptFiles.forEach((file) =>{

              scriptAplica = scriptAplica + '\nsql c scripts ' + file.path;

            });

          }

          if(myPlsFiles.length > 0){

            myPlsFiles.forEach((file) =>{

              scriptAplica = scriptAplica + '\nsql c pls ' + file.path;

            });

          }

          textArray[line] = textArray[line].replace('$SQLFILES',scriptAplica)

        } 
        else{

          let scriptRbk = '';

          if(myRbkPlsFiles.length > 0){

            myRbkPlsFiles.forEach((file) =>{

              scriptRbk = scriptRbk + '\nsql c pls ' + file.path;

            });

          }

          if (myRbkScriptFiles.length > 0){

            myRbkScriptFiles.forEach((file) =>{

              scriptRbk = scriptRbk + '\nsql c scripts ' + file.path;

            });

          }

          textArray[line] = textArray[line].replace('$SQLFILES',scriptRbk)
        }

      }
      if (textArray[line].includes('$SYSDATE')){
        
        var actualDate = new Date();

        textArray[line] = textArray[line].replace('$SYSDATE', actualDate.getDate() + '/'+ actualDate.getMonth()+ '/' +actualDate.getFullYear())

      }
      if (textArray[line].includes('$CRQ')){

        textArray[line] = textArray[line].replace('$CRQ', CRQ.trim())

      }
      if (textArray[line].includes('$SYSNAME')){

        textArray[line] = textArray[line].replace('$SYSNAME', ComputerName.trim())

      }

    }

    let textFinal = textArray.join('\n')

    //return textArray
    return textFinal
  }

  const obtenerDefaultScript = async () =>{

    const getGrant = await fetch('./PaqStructure/FRENTE_CRQ_VERSION/APLICA/c/scripts/Grant.sql')

    const getRecompInv = await fetch('./PaqStructure/FRENTE_CRQ_VERSION/APLICA/c/scripts/RecompInv.sql')

    const getRecompProcFun = await fetch('./PaqStructure/FRENTE_CRQ_VERSION/APLICA/c/scripts/RecompProcFun.sql')

    
    const GrantText = await getGrant.text()

    const RecompInvText = await getRecompInv.text()

    const RecompProcFunText = await getRecompProcFun.text()


    var Grant = new File([GrantText], 'Grant.sql', {type: "text/plain"});

    var RecompInv = new File([RecompInvText], 'RecompInv.sql', {type: "text/plain"});

    var RecompProcFun = new File([RecompProcFunText], 'RecompProcFun.sql', {type: "text/plain"});

    return [Grant, RecompInv, RecompProcFun]
  }

  const generateZipFolder = async () =>{

    var zipEntrega = new JSZip();

    const CablevisionArray = ['billing','Capacitacion','cobranzas','crm','global','inventario_red','ordenes'];
    const ItemArray = ['framework', 'objetos','pls','scripts'];

    var MainFolder = zipEntrega.folder(Frente + '_' + CRQ.trim() + '_' + Version);

    var AplicaFolder = MainFolder.folder(CRQ.trim() +'_ALL_01');
    var RollbackFolder = MainFolder.folder(CRQ.trim() +'_ALL_01_Rollback');

    AplicaFolder.file(CRQ.trim() +'_ALL_01.drv', handleDriverText('APLICA'))
    RollbackFolder.file(CRQ.trim() +'_ALL_01_Rollback.drv', handleDriverText('ROLLBACK'))

    var Aplica_C = AplicaFolder.folder('c');
    var Rollback_C = RollbackFolder.folder('c');

    var Aplica_PLS = Aplica_C.folder('pls');

    myPlsFiles.forEach((file) =>{

      Aplica_PLS.file(file.path, file)

    });

    var Rollback_PLS = Rollback_C.folder('pls');

    myRbkPlsFiles.forEach((file) =>{

      Rollback_PLS.file(file.path, file)

    });



    var Aplica_Scripts = Aplica_C.folder('scripts');

    myScriptFiles.forEach((file) =>{

      Aplica_Scripts.file(file.path, file)
    
    });

    var Rollback_Scripts = Rollback_C.folder('scripts');

    myRbkScriptFiles.forEach((file) =>{

      Rollback_Scripts.file(file.path, file)
    
    });

    var defaultScriptCompiler = await obtenerDefaultScript();

    defaultScriptCompiler.forEach(async (file) => {

      Aplica_Scripts.file(file.name, file);
      Rollback_Scripts.file(file.name, file);

    });
    
    var AplicaCable = AplicaFolder.folder('Cablevision');
    var RollbackCable = RollbackFolder.folder('Cablevision');
    var folderCablevisionArrayAplica = [];
    var folderCablevisionArrayRbk = [];

    for(var i=0; i < CablevisionArray.length; i++){

      folderCablevisionArrayAplica.push(AplicaCable.folder(CablevisionArray[i]));
      folderCablevisionArrayRbk.push(RollbackCable.folder(CablevisionArray[i]));

      for(var k=0; k < ItemArray.length; k++){

        folderCablevisionArrayAplica[i].folder(ItemArray[k]);

        folderCablevisionArrayRbk[i].folder(ItemArray[k]);
      }
    }


    zipEntrega.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, Frente + '_' + CRQ.trim() + '_' + Version + '.zip');
    });

  }

  const generarZip = () => {
    console.log('Submit Form')

    generateZipFolder();
  }

  return (
    <div  style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor:'grey' }}>
      {isMobile ? 
      <Grid container direction="column" item xl={4} align="center" style={{height:'100vh', backgroundColor:'white', overflowY:'scroll' }}>
        <div style={{alignItems: 'center', justifyContent: 'center'}}>
          <img style={{padding:'30px'}} width="200" height="100" src={IBMLogo} alt="Logo" />
          <h3>HERRAMIENTA PARA<br/>LA PAQUETIZACION DE ENTREGAS DE PASAJE DE AMBIENTES</h3>
          <img style={{padding:'30px'}} width="200" height="200" src={sadFace} alt="Unsupported Device" />
          <h4 style={{fontFamily:'monospace', fontStyle:'oblique'}}>
            EL DISPOSITIVO EN EL QUE INTENTA ABRIR LA HERRAMIENTA NO ES COMPATIBLE.<br/>
            POR FAVOR ABRA LA WEB DESDE UN ORDENADOR.
          </h4>
        </div>
      </Grid>
      :
      <Grid container direction="column" item xs={10} align="center" style={{height:'100vh', backgroundColor:'white', overflowY:'scroll' }}>
        <div style={{alignItems: 'center', justifyContent: 'center'}}>
          <img style={{padding:'30px'}} width="200" height="100" src={IBMLogo} alt="Logo" />
          <h3>HERRAMIENTA PARA LA PAQUETIZACION<br/>DE ENTREGAS DE PASAJE DE AMBIENTES</h3>
          <div style={{width:'63%',border:'dashed',padding:'20px 0 20px 0',fontFamily:'monospace', fontSize:'13px'}}>  
            <h4>1- Ingresa el Nombre y/o Descripcion de la paquetizacion para dejarlo en<br/>los comentarios del archivo .drv</h4>
            <h4>2- Ingresa el CRQ correspondiente, esto sirve para ponerle el nombre a los<br/>Archivos Zipeados y tambien colocar en el archivo .drv</h4>
            <h4>3- Elegi el Frente en el cual estuviste trabajando y la Version de la paquetizacion<br/>tambien se va a colocar como formato del archivo zipeado y .drv</h4>
            <h4>4- Carga los archivos de los Procedimientos/Scripts necesarios que tenes que entregar.</h4>
            <h4>5- Corrobora que todo este correcto y presiona Generar.<br/><br/>Listo! Esto te va a abrir una ventana donde vas a poder guardar el .zip con la entrega generada.</h4>
          </div>
          <form style={{paddingTop:'40px', display:'-ms-grid'}} noValidate autoComplete="off">
            <div style={{padding:'20px 0 20px 0'}}>
              <TextField onChange={(e) => setComputerName(e.target.value) } onFocus={() => seterrorInputComputerName('')} name='Aplicante' onBlur={ (e) => handleError(e)} autoFocus={true} style={{width:'60%'}} placeholder='Coloque a nombre de quien va a estar el aplica' required label="Nombre del aplicante"/>
              {errorInputComputerName ? <h5 style={{color:'red', margin:'0'}}>{errorInputComputerName}</h5> : ''}
            </div>
            <div style={{padding:'20px 0 20px 0'}}>
              <TextField onChange={(e) => setName(e.target.value) } onFocus={() => seterrorInputName('')} name='Nombre' onBlur={ (e) => handleError(e)} style={{width:'60%'}} placeholder='CRQXXXXXXXXXX - Historia PRJ-XXX - CRM (IBM)' required label="Nombre/Descripcion del Aplica"/>
              {errorInputName ? <h5 style={{color:'red', margin:'0'}}>{errorInputName}</h5> : ''}
            </div>
            <div style={{padding:'20px 0 20px 0'}}>
              <TextField onChange={(e) => setCRQ(e.target.value)} onFocus={() => seterrorInputCRQ('')} name='CRQ' onBlur={ (e) => handleError(e)} style={{width:'60%'}} placeholder="CRQXXXXXXXXXX" required label="CRQ"/>
              {errorInputCRQ ? <h5 style={{color:'red', margin:'0'}}>{errorInputCRQ}</h5> : ''}
            </div>
            <div style={{padding:'20px 0 20px 0'}}>
              <TextField onChange={(e) => { handleError(e); setVersion(e.target.value)}} onFocus={() => seterrorInputVersion('')} name='Version' onBlur={ (e) => handleError(e)} style={{width:'60%'}} placeholder="X.X.X" required label="Version"/>
              {errorInputVersion ? <h5 style={{color:'red', margin:'0'}}>{errorInputVersion}</h5> : ''}
            </div>
            <div style={{padding:'20px 0 20px 0'}}>
              <Select onChange={(e) => setFrente(e.target.value)} onFocus={() => seterrorInputFrente('')} 
                      native
                      required
                      name='Frente'
                      style={{width:'60%'}}
                      defaultValue=''
                      onBlur={ (e) => handleError(e)}>
                <option label="Seleccione un Frente" value='' />
                <option value={'CRM'}>CRM</option>
                <option value={'Billing'}>Billing</option>
                <option value={'Cobranzas'}>Cobranzas</option>
                <option value={'Corporativos'}>Corporativos</option>
                <option value={'Promociones Billing'}>Promociones Billing</option>
                <option value={'Inv. de Red'}>Inv. de Red</option>
                <option value={'Promociones Coporativos'}>Promociones Coporativos</option>
                <option value={'Ordenes'}>Ordenes</option>
              </Select>
              {errorInputFrente ? <h5 style={{color:'red', margin:'0'}}>{errorInputFrente}</h5> : ''}
            </div>
            <h3><u>APLICA</u></h3>
            <Grid xl={6} item alignItems="center" style={{display:'flex', justifyContent:'center'}}>
              <DragDrop tipoArchivos='Aplica_PLS' attachFiles={filesArray => setmyPlsFiles(filesArray)} 
              showAlert={(open, file) => { setOpenAlert(open); setMsgFile(file)}}/>
              <DragDrop tipoArchivos='Aplica_Script' attachFiles={filesArray => setmyScriptFiles(filesArray)} 
              showAlert={(open, file) => { setOpenAlert(open); setMsgFile(file)}}/>
            </Grid>
            <h3><u>ROLLBACK</u></h3>
            <Grid xl={6} item alignItems="center" style={{display:'flex', justifyContent:'center'}}>
              <DragDrop tipoArchivos='Rollback_PLS' attachFiles={filesArray => setmyRbkPlsFiles(filesArray)} 
              showAlert={(open, file) => { setOpenAlert(open); setMsgFile(file)}}/>
              <DragDrop tipoArchivos='Rollback_Script' attachFiles={filesArray => setmyRbkScriptFiles(filesArray)} 
              showAlert={(open, file) => { setOpenAlert(open); setMsgFile(file)}}/>
            </Grid>              
            <Button variant='outlined'
                    size='large'
                    style={{width:'30%', margin:'50px 0 70px 0'}}
                    onClick={generarZip}
                    disabled={disableSubmit}>Generar</Button>
          </form>
          {showAlert()}
        </div>
      </Grid>}
    </div>
  );
}
