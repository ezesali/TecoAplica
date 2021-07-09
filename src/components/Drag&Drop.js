import React, {useMemo, useState, useCallback, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  overflow:'auto',
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

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(myFiles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMyFiles(items);
  }

  return (
    <div style={{alignItems:'center', justifyContent:''}} className="container">
        <div {...getRootProps({style})}>
            <input required {...getInputProps()} />
            {myFiles.length > 0 ? 
            <h2>{myFiles.length} {myFiles.length > 1 ? 
              'Archivos de '+ props.tipoArchivos.substring(0,props.tipoArchivos.indexOf('_')) +'/'+ props.tipoArchivos.substring(props.tipoArchivos.indexOf('_')+ 1,props.tipoArchivos.length) + ' subidos'
              : 
              'Archivo de '+ props.tipoArchivos.substring(0,props.tipoArchivos.indexOf('_')) +'/'+ props.tipoArchivos.substring(props.tipoArchivos.indexOf('_')+ 1,props.tipoArchivos.length) + ' subido'}
            </h2>
            : 
            <p>
              Agrega en {props.tipoArchivos.substring(0,props.tipoArchivos.indexOf('_')) +'/'+ props.tipoArchivos.substring(props.tipoArchivos.indexOf('_')+ 1,props.tipoArchivos.length)} lo que 
              vas a entregar arrastrandolos o haciendo click en el cuadro<br/>Ordenalos segun orden de ejecucion moviendolo a la posicion deseada
            </p>}
        </div>
        {myFiles.length > 0 ? <h3>{props.tipoArchivos.substring(0,props.tipoArchivos.indexOf('_')) +'/'+ props.tipoArchivos.substring(props.tipoArchivos.indexOf('_')+ 1,props.tipoArchivos.length)} Files</h3> : ''} 
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="files">
            {(provided) => (
              <ul style={{listStyleType:'auto'}} className="files" {...provided.droppableProps} ref={provided.innerRef}>
                {myFiles.map((file, index) => {
                  return (
                    <Draggable key={file.path} draggableId={file.path} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <li>
                            {file.path}
                            <IconButton id={file.path} onClick={removeFile(file)} size='small'>
                              <DeleteOutlineIcon style={{color:'red'}}/>
                            </IconButton>
                          </li>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
    </div>
  );
}