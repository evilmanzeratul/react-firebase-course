import { useEffect, useState } from 'react';
import './App.css';
import Auth from './components/auth';
import { db, auth, storage } from './config/firebase'
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from '@firebase/firestore';
import { ref, uploadBytes } from "firebase/storage"



function App() {

  const [movieList, setMovieList] = useState([])

  // new movie states

  const [newMovieTitle, setNewMovieTitle] = useState("")
  const [newReleaseDate, setNewReleaseDate] = useState(0)
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false)

  //update Title State
  const [updatedTitle, setUpdatedTitle] = useState()

  // File upload state
  const [fileUpload, steFileUpload] = useState(null)
  // pobieranie filmu z bazy
  const moviesCollectionRef = collection(db, "movies")

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef)
      const filterdData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setMovieList(filterdData);
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getMovieList()
  }, [])

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid
      })
      getMovieList()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await deleteDoc(movieDoc)
  }

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await updateDoc(movieDoc, { title: updatedTitle })
  }

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`)
    try {
      await uploadBytes(filesFolderRef, fileUpload)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <Auth />
      <div>
        <input type="text" placeholder='Movie title...'
          onChange={(e) => setNewMovieTitle(e.target.value)} />
        <input type="number" placeholder='Release Date'
          onChange={(e) => setNewReleaseDate(Number(e.target.value))} />
        <input type="checkbox" checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.value)} />
        <label >Received an Oscar</label>
        <button onClick={onSubmitMovie}> Submit Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input placeholder='new title...'
              onChange={(e) => setUpdatedTitle(e.target.value)} />
            <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => steFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload file</button>
      </div>
    </div>
  );
}

export default App;
