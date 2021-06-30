import React, {useEffect, useState} from 'react';
import { TextField, Grid, Select } from '@material-ui/core';
import IBMLogo from '../src/ibm-logo.webp';
import DragDrop from '../src/components/Drag&Drop';
import makeStyles  from '@material-ui/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { isMobile } from 'react-device-detect';
import sadFace from '../src/sadUnsupported.png';

const useStyles = makeStyles({
  SubmitButton: {
    color: 'white', 
    textDecoration: 'none', 
    backgroundColor: '#5360D1', 
    width:'10pc',
    padding: '10px', 
    borderRadius: '50px', 
    display: 'inline-block',
    cursor:'pointer'
  },
});

export default function App(props) {

  const styles = useStyles();

  //const [files, setfiles] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [errorInputName, seterrorInputName] = useState('');
  const [errorInputCRQ, seterrorInputCRQ] = useState('');
  const [errorInputVersion, seterrorInputVersion] = useState('');
  const [errorInputFrente, seterrorInputFrente] = useState('');

  const [Name, setName] = useState('');
  const [CRQ, setCRQ] = useState('');
  const [Frente, setFrente] = useState('');
  const [Version, setVersion] = useState('');
  const [myFiles, setmyFiles] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [MsgFile, setMsgFile] = useState('');
  
  useEffect(() => {
    //files.forEach((file) => URL.revokeObjectURL(file.preview)); 
    if (Name.length > 0 && CRQ.length > 0 && Frente.length > 0 && Version.length > 0 && myFiles.length > 0){
      console.log('Cambia')
      setDisableSubmit(false);
    }
    else{
      setDisableSubmit(true);
    }
  }, [Name,CRQ,Frente,Version,myFiles]);


  /*function addFile(file) {
    console.log(file);
    setfiles({
      files: file.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    });
  };*/

  function handleError(e) {    
    switch (e.target.name){
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
    }
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  function showAlert(){
    return (
      <Dialog onClose={handleCloseAlert} open={openAlert}>
        <DialogTitle onClose={handleCloseAlert}>
          Error
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            El archivo "{MsgFile}" no se puede agregar ya que se agrego anteriormente
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
          <form style={{paddingTop:'40px', display:'-ms-grid'}} noValidate onSubmit={() => console.log('SUBMIT FORM')} autoComplete="off">
            <div style={{padding:'20px 0 20px 0'}}>
              <TextField onChange={(e) => setName(e.target.value) } onFocus={() => seterrorInputName('')} name='Nombre' onBlur={ (e) => handleError(e)} autoFocus={true} style={{width:'60%'}} placeholder='CRQXXXXXXXXXX - Historia PRJ-XXX - CRM (IBM)' required label="Nombre/Descripcion del Aplica"/>
              {errorInputName ? <h5 style={{color:'red', margin:'0'}}>{errorInputName}</h5> : ''}
            </div>
            <div style={{padding:'20px 0 20px 0'}}>
              <TextField onChange={(e) => setCRQ(e.target.value)} onFocus={() => seterrorInputCRQ('')} name='CRQ' onBlur={ (e) => handleError(e)} style={{width:'60%'}} required label="CRQ"/>
              {errorInputCRQ ? <h5 style={{color:'red', margin:'0'}}>{errorInputCRQ}</h5> : ''}
            </div>
            <div style={{padding:'20px 0 20px 0'}}>
              <TextField onChange={(e) => { handleError(e); setVersion(e.target.value)}} onFocus={() => seterrorInputVersion('')} name='Version' onBlur={ (e) => handleError(e)} style={{width:'60%'}} required label="Version"/>
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
            <DragDrop attachFiles={filesArray => setmyFiles(filesArray)} 
            showAlert={(open, file) => { setOpenAlert(open); setMsgFile(file)}}/>
            <Button className={styles.SubmitButton}
                    type="submit" value="Submit"
                    disabled={disableSubmit}>Generar</Button>
          </form>
          {showAlert()}
        </div>
      </Grid>}
    </div>
  );
}
