'use client'

import {Box, TextField, Button, List, ListItem, ListItemText, IconButton,Typography, Paper} from '@mui/material';
import { useEffect, useMemo, useState, useRef, useReducer } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import reducer from './reducer/reducer'

export default function Home() {
  const [todos2,setTodos]= useState([]);
  const [task,setTask]= useState('');
  const [filter, setFilter] = useState('all');
  const [editIndex, setIndex] = useState(null);
  const [edit, setEdit] = useState('');
  const [todos, dispatch] = useReducer(reducer, [])


  const addNewTask = ()=>{
    dispatch({type:"added", payload:{newTask:task}})
    if (task.trim() ==='') return;
      setTask('')
    };
  
  const toggleComplete = (index)=>{
      dispatch({type:"toggle", payload:{index:index}})
    };

    const deleteTodos = (index)=>{
      dispatch({type:"delete", payload:{index:index}})
    };

    const filteredTodos = useMemo(()=>{
      return todos.filter((todo)=>{
        if(filter === "completed") return todo.completed === true;
        if(filter === "notCompleted") return todo.completed === false;
        return true;
    });

    }, [todos,filter])

    const handleEditClick = (index)=>{
        setIndex(index);
        setEdit(todos[index].text)
      }

      const handleEditKeyDown = (event)=>{
        if (event.key === 'Enter'){
          if (edit.trim() === '') return;
          const updateTodos = [...todos];
          updateTodos[editIndex].text = edit;
          setTodos(updateTodos)
          localStorage.setItem("todo", JSON.stringify(updateTodos))
          setIndex(null)
          setEdit('')
          if (event.key === 'Escape') {
          setIndex(null);
          setEdit('');
        }}}

      useEffect(()=>{
        const showData = JSON.parse(localStorage.getItem("todo"))
        setTodos(showData)
      },[])

      const editRef = useRef(null);
      useEffect(() => {
        function handleClickOutside(event) {
          if (editRef.current && !editRef.current.contains(event.target)) {
            setIndex(null);
            setEdit('');
          }
        }

        if (editIndex !== null) {
          document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [editIndex]);


  return (
    <Box sx={{
      height:'100vh',
      background:"linear-gradient(to right, #6a11cb, #2575fc)",
      display:"flex",
      justifyContent:'center',
      alignItems:'center',
      p:2,
      margin:0,
      padding:0
    }}>
      <Paper elevation={4} sx={{p:4, width:'70%', maxWidth:500, maxHeight:"80vh", overflow:"scroll"}}>
        <Typography variant='h5' align='left' gutterBottom>
          TO-Do List
        </Typography>

        <Box sx={{display:'flex', gap:2, mb:2}}>
          <TextField
            fullWidth
            label="Add a task..."
            value={task}
            onChange={(e)=>setTask(e.target.value)}
            onKeyDown={(e)=>e.key === 'Enter' && addNewTask()}
            />
            <Button variant='contained' onClick={addNewTask}>Add</Button>
        </Box>

        <Box sx={{ display:"flex", justifyContent:"center", gap:2, mb:2}}>
          <Button variant={filter ==='all' ? 'contained' : 'outlined'} onClick={()=> setFilter('all')}>
            All
          </Button>
          <Button variant={filter ==='completed' ? 'contained' : 'outlined'} onClick={()=> setFilter('completed')}>
            completed
          </Button>
          <Button variant={filter ==='notCompleted' ? 'contained' : 'outlined'} onClick={()=> setFilter('notCompleted')}>
            Not completed
          </Button>
        </Box>

        <List>
          {filteredTodos.map((todo, index)=>(
            <ListItem
            key={index}
            secondaryAction={
              <>
                <IconButton onClick={()=>toggleComplete(index)}>
                  <CheckIcon color={todo.completed ? 'success' : 'disabled'} />
                </IconButton>
                <IconButton onClick={()=>deleteTodos(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
                <IconButton onClick={()=>
                  handleEditClick(index)}>
                  <EditIcon color="primary"/>
                </IconButton>
                
              </>
            }
            >
              <ListItemText
              primary={editIndex === index ? (
                  <Box ref={editRef} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection:"column" }}>
                    <TextField
                      value={edit}
                      onChange={(event) => setEdit(event.target.value)}
                      onKeyDown={handleEditKeyDown}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        if (edit.trim() === '') return;
                        const updateTodos = [...todos];
                        updateTodos[editIndex].text = edit;
                        setTodos(updateTodos);
                        setIndex(null);
                        setEdit('');
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                ) :(
                  todo.text
                )}
                
              secondary={`Date:${todo.date}`}/>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
