import React, {useMemo, useState, useCallback, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const baseStyle = {
  flex: 1,
  width:'50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: 'black',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  cursor:'pointer',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

export default function DragDrop(props) {

  const [myFiles, setMyFiles] = useState([])


  const onDrop = useCallback(acceptedFiles => {
    let RepeatFiles = [];
    acceptedFiles.forEach((file) => {
      myFiles.forEach(function (myfile) {
        if (myfile.path === file.path){
          myFiles.splice(myFiles.indexOf(myfile), 1)
          RepeatFiles.push(file)  
        }
      });
    })
    if (RepeatFiles.length > 0){
      props.showAlert(true, RepeatFiles)
    }
    setMyFiles([...myFiles, ...acceptedFiles])
  }, [myFiles, props])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const removeFile = file => () => {
    const newFiles = [...myFiles]
    newFiles.splice(newFiles.indexOf(file), 1)
    setMyFiles(newFiles)
  }

  useEffect(() => {

    props.attachFiles(myFiles)

  }, [myFiles,props])

  const files = myFiles.map((file,index) => (
    <div key={index} style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{marginRight: '20px'}}>
            - {file.path}
        </div>
        <IconButton id={file.path} onClick={removeFile(file)} size='small'>
            <DeleteOutlineIcon style={{color:'red'}}/>
        </IconButton>
    </div>
  ))

  return (
    <div style={{alignItems:'center'}} className="container">
        <div {...getRootProps({style})}>
            <input required {...getInputProps()} />
            {myFiles.length > 0 ? <h1>{myFiles.length} {myFiles.length > 1 ? 'Archivos de '+ props.tipoArchivos + ' subidos': 'Archivo de ' + props.tipoArchivos +' subido'}</h1>: <p>Agrega los procedimientos y/o scripts que queres entregar en el {props.tipoArchivos} arrastrandolos o haciendo click en el cuadro</p>}
        </div>
        <aside style={{paddingBottom:'25px'}}>
            {myFiles.length > 0 ? <h3>{props.tipoArchivos} Files</h3> : ''}
            {files}
        </aside>
    </div>
  );
}